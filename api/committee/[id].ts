import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, committeeTable } from "../_db";
import { isAdminRequest, readJsonBody } from "../_auth";

const cors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  if (req.method === "PATCH") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { name, role, bio, photoUrl, order } = (await readJsonBody(req)) ?? {};
    const update: Record<string, unknown> = {};
    if (name != null) update.name = name;
    if (role != null) update.role = role;
    if (bio !== undefined) update.bio = bio;
    if (photoUrl !== undefined) update.photoUrl = photoUrl;
    if (order != null) update.displayOrder = Number(order);
    const [member] = await db.update(committeeTable).set(update).where(eq(committeeTable.id, id)).returning();
    if (!member) return res.status(404).json({ error: "Not found" });
    return res.json({ ...member, order: member.displayOrder, createdAt: member.createdAt.toISOString() });
  }

  if (req.method === "DELETE") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    await db.delete(committeeTable).where(eq(committeeTable.id, id));
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
