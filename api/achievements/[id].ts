import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, achievementsTable, achievementPlayersTable } from "../_db";
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
    const { title, shortDescription, longDescription, year, category, mainImageUrl, additionalImages, taggedPlayerIds } = (await readJsonBody(req)) ?? {};
    const update: Record<string, unknown> = {};
    if (title != null) update.title = title;
    if (shortDescription !== undefined) update.shortDescription = shortDescription;
    if (longDescription !== undefined) update.longDescription = longDescription;
    if (year != null) update.year = Number(year);
    if (category !== undefined) update.category = category;
    if (mainImageUrl !== undefined) update.mainImageUrl = mainImageUrl;
    if (additionalImages !== undefined) update.additionalImages = additionalImages;

    const [ach] = await db.update(achievementsTable).set(update).where(eq(achievementsTable.id, id)).returning();
    if (!ach) return res.status(404).json({ error: "Not found" });

    if (Array.isArray(taggedPlayerIds)) {
      await db.delete(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, id));
      if (taggedPlayerIds.length > 0) {
        await db.insert(achievementPlayersTable).values(
          taggedPlayerIds.map((pid: number) => ({ achievementId: id, playerId: pid }))
        );
      }
    }

    const mappings = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, id));
    return res.json({ ...ach, taggedPlayerIds: mappings.map(m => m.playerId), createdAt: ach.createdAt.toISOString() });
  }

  if (req.method === "DELETE") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    await db.delete(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, id));
    await db.delete(achievementsTable).where(eq(achievementsTable.id, id));
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
