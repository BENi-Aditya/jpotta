import type { VercelRequest, VercelResponse } from "@vercel/node";
import { signAdminToken, isAdminRequest, readJsonBody } from "../_auth";

const cors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query.action as string;

  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const body = await readJsonBody(req) as { username?: string; password?: string };
    const { username, password } = body ?? {};
    const ok =
      username === (process.env.ADMIN_USERNAME ?? "admin") &&
      password === (process.env.ADMIN_PASSWORD ?? "jpotta@2024");
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = await signAdminToken();
    return res.json({ success: true, message: "Login successful", token });
  }

  if (action === "logout") {
    return res.json({ success: true, message: "Logged out" });
  }

  if (action === "me") {
    const authenticated = await isAdminRequest(req);
    return res.json({ authenticated, username: authenticated ? "admin" : null });
  }

  return res.status(404).json({ error: "Not found" });
}
