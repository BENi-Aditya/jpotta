import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc } from "drizzle-orm";
import { db, achievementsTable, achievementPlayersTable } from "./_db";
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
    const achievements = await db.select().from(achievementsTable).orderBy(desc(achievementsTable.year));
    const mappings = await db.select().from(achievementPlayersTable);
    return res.json(achievements.map(a => ({
      ...a,
      taggedPlayerIds: mappings.filter(m => m.achievementId === a.id).map(m => m.playerId),
      createdAt: a.createdAt.toISOString(),
    })));
  }

  if (req.method === "POST") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { title, shortDescription, longDescription, year, category, mainImageUrl, additionalImages, taggedPlayerIds } = (await readJsonBody(req)) ?? {};
    if (!title || !year) return res.status(400).json({ error: "title and year are required" });
    const [ach] = await db.insert(achievementsTable).values({
      title,
      shortDescription: shortDescription ?? "",
      longDescription: longDescription ?? "",
      year: Number(year),
      category: category ?? null,
      mainImageUrl: mainImageUrl ?? null,
      additionalImages: additionalImages ?? [],
    }).returning();
    if (Array.isArray(taggedPlayerIds) && taggedPlayerIds.length > 0) {
      await db.insert(achievementPlayersTable).values(
        taggedPlayerIds.map((pid: number) => ({ achievementId: ach.id, playerId: pid }))
      );
    }
    return res.status(201).json({
      ...ach,
      taggedPlayerIds: taggedPlayerIds ?? [],
      createdAt: ach.createdAt.toISOString(),
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
