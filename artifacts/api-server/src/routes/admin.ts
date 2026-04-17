import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
declare module "express-session" {
  interface SessionData {
    authenticated?: boolean;
    username?: string;
  }
}

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "jpotta@2024";

  if (username === adminUsername && password === adminPassword) {
    req.session.authenticated = true;
    req.session.username = username;
    const { SignJWT } = await import("jose");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "jpotta-jwt-secret-change-in-production");
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);
    res.json({ success: true, message: "Login successful", token });
  } else {
    logger.warn({ username }, "Failed admin login attempt");
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  if (req.session.authenticated) {
    res.json({ authenticated: true, username: req.session.username ?? null });
  } else {
    res.json({ authenticated: false, username: null });
  }
});

export default router;
