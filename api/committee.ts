import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, committeeTable } from "./_db";
import { isAdminRequest, readJsonBody } from "./_auth";

const cors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const members = await db.select().from(committeeTable).orderBy(committeeTable.displayOrder, committeeTable.id);
    return res.json(members.map(m => ({
      ...m,
      order: m.displayOrder,
      createdAt: m.createdAt.toISOString(),
    })));
  }

  if (req.method === "POST") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { name, role, bio, photoUrl, order } = (await readJsonBody(req)) ?? {};
    if (!name || !role) return res.status(400).json({ error: "name and role are required" });
    const [member] = await db.insert(committeeTable).values({
      name, role, bio: bio ?? null, photoUrl: photoUrl ?? null,
      displayOrder: Number(order ?? 10),
    }).returning();
    return res.status(201).json({ ...member, order: member.displayOrder, createdAt: member.createdAt.toISOString() });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
