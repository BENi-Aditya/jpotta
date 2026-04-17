# CRITICAL BUG ANALYSIS - Admin Login Failure

## Issue Summary
Admin login fails with "Invalid credentials" even when correct username and password are provided via environment variables.

## When Does This Issue Occur?
1. User navigates to `/admin` (admin login page)
2. User enters correct ADMIN_USERNAME and ADMIN_PASSWORD (set in Vercel env vars)
3. User clicks "Sign In"
4. Login immediately fails with "Invalid credentials" error

## Root Cause
**Vercel Node.js runtime does NOT automatically parse JSON request bodies.**

The API code at `/api/admin/[action].ts:18` directly accesses `req.body`:
```typescript
const { username, password } = req.body ?? {};
```

However, in Vercel's Node.js runtime:
- `req.body` is `undefined` by default
- The raw request body must be manually read from the stream
- JSON must be manually parsed

**Result**: `username` and `password` are always `undefined`, causing the comparison to always fail:
```typescript
const ok =
  username === (process.env.ADMIN_USERNAME ?? "admin") &&
  password === (process.env.ADMIN_PASSWORD ?? "jpotta@2024");
// undefined === "actual_username" => ALWAYS FALSE
```

## Why Vercel Logs Show "Success"
The Vercel logs show the POST request was received because:
1. The HTTP request DOES reach the server
2. The server DOES respond with a 401 (which Vercel considers a successful handling)
3. The route itself works - the body parsing is what's broken

## Files That Were Fixed
1. `/api/_auth.ts` - Added `readJsonBody()` helper function
2. `/api/admin/[action].ts` - Login endpoint (CRITICAL FIX)
3. `/api/achievements.ts` - POST body parsing
4. `/api/players.ts` - POST body parsing
5. `/api/news.ts` - POST body parsing
6. `/api/committee.ts` - POST body parsing
7. `/api/reviews.ts` - POST body parsing
8. `/api/achievements/[id].ts` - PATCH body parsing
9. `/api/players/[id].ts` - PATCH body parsing
10. `/api/news/[id].ts` - PATCH body parsing
11. `/api/committee/[id].ts` - PATCH body parsing
12. `/api/reviews/[id].ts` - PATCH body parsing

## What Was Changed
In every file, `req.body ?? {}` was replaced with `(await readJsonBody(req)) ?? {}`.

The `readJsonBody` function reads the raw request stream and parses JSON manually:
```typescript
export async function readJsonBody(req: VercelRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}
```

---

# HOW TO DEPLOY AND TEST

## Step 1: Deploy to Vercel
```bash
git add .
git commit -m "Fix admin login - add JSON body parsing for Vercel runtime"
git push origin main
```
Vercel will auto-deploy from your Git push. Wait 1-2 minutes for deployment to complete.

## Step 2: Test as a USER (End-to-End)

### Test 2a: Login with correct credentials
1. Open your website URL (e.g. `https://your-domain.vercel.app/admin`)
2. You will see the Admin Portal login page
3. Enter the **exact** username and password that are set in your Vercel environment variables (ADMIN_USERNAME and ADMIN_PASSWORD)
4. Click "Sign In"
5. **EXPECTED RESULT**: You see a green toast notification saying "Login successful - Welcome to the admin dashboard" and you are redirected to the admin dashboard page
6. **BUG STILL PRESENT**: You see a red toast notification saying "Login failed - Invalid credentials"

### Test 2b: Login with WRONG credentials
1. Go back to `/admin`
2. Enter a wrong username or wrong password
3. Click "Sign In"
4. **EXPECTED RESULT**: You see a red toast notification saying "Login failed - Invalid username or password"
5. This confirms the error handling still works correctly

### Test 2c: Admin dashboard access after login
1. After successful login, you should be on `/admin/dashboard`
2. You should see all the admin panels (players, news, achievements, reviews, committee)
3. Try adding a new review from the dashboard
4. **EXPECTED RESULT**: Review gets created successfully and appears in the list
5. This confirms that POST/PATCH body parsing also works for admin actions

## Step 3: Test as a DEVELOPER (API-Level)

### Test 3a: Test login API directly with Hoppscotch/Postman
1. Open Hoppscotch or Postman
2. Send a POST request to: `https://your-domain.vercel.app/api/admin/login`
3. Set header: `Content-Type: application/json`
4. Set body (raw JSON):
   ```json
   {
     "username": "YOUR_ADMIN_USERNAME",
     "password": "YOUR_ADMIN_PASSWORD"
   }
   ```
5. **EXPECTED RESULT**: You get a 200 response with:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiJ9..."
   }
   ```
6. **BUG STILL PRESENT**: You get a 401 response with:
   ```json
   {
     "success": false,
     "message": "Invalid credentials"
   }
   ```

### Test 3b: Test the "me" endpoint (verify token works)
1. Take the token from Test 3a
2. Send a GET request to: `https://your-domain.vercel.app/api/admin/me`
3. Set header: `Authorization: Bearer YOUR_TOKEN_HERE`
4. **EXPECTED RESULT**:
   ```json
   {
     "authenticated": true,
     "username": "admin"
   }
   ```

### Test 3c: Test creating data (verify POST body parsing)
1. Use the token from login
2. Send a POST to: `https://your-domain.vercel.app/api/reviews`
3. Headers: `Content-Type: application/json` and `Authorization: Bearer YOUR_TOKEN`
4. Body:
   ```json
   {
     "authorName": "Test User",
     "content": "This is a test review",
     "rating": 5
   }
   ```
5. **EXPECTED RESULT**: 201 response with the created review object

### Test 3d: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Logs
2. Try logging in from the website
3. Check the function logs for `/api/admin/login`
4. **EXPECTED**: No errors, function completes successfully
5. **BUG STILL PRESENT**: Function returns 401 (you'd see this in the response code in logs)

## Step 4: Check Neon Database (Optional)
1. Go to Neon Console → Your project
2. Check the tables - you should see: `players`, `achievements`, `achievement_players`, `news`, `committee_members`, `reviews`
3. Note: There is NO "users" table and there NEVER WAS one. The admin credentials come from environment variables, not from the database. This is by design.

## Quick Summary
| Test | What to do | What success looks like |
|------|-----------|----------------------|
| Login (correct creds) | Enter correct username/password on /admin | Redirected to /admin/dashboard |
| Login (wrong creds) | Enter wrong username/password on /admin | "Invalid credentials" error toast |
| API login test | POST /api/admin/login with correct JSON | 200 + token in response |
| Create data test | POST /api/reviews with auth token | 201 + created review object |
