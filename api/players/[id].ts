import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, playersTable, achievementPlayersTable } from "../_db";
import { isAdminRequest, readJsonBody } from "../_auth";

const cors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  if (req.method === "GET") {
    const [player] = await db.select().from(playersTable).where(eq(playersTable.id, id));
    if (!player) return res.status(404).json({ error: "Not found" });
    const mappings = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.playerId, id));
    return res.json({ ...player, achievementIds: mappings.map(m => m.achievementId), createdAt: player.createdAt.toISOString() });
  }

  if (req.method === "PATCH") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { name, photoUrl, district, state, districtRank, stateRank, nationalRank, internationalRank, blade, fhRubber, bhRubber, displayOrder } = (await readJsonBody(req)) ?? {};
    const update: Record<string, unknown> = {};
    if (name != null) update.name = name;
    if (photoUrl !== undefined) update.photoUrl = photoUrl;
    if (district !== undefined) update.district = district;
    if (state !== undefined) update.state = state;
    if (districtRank !== undefined) update.districtRank = districtRank || null;
    if (stateRank !== undefined) update.stateRank = stateRank || null;
    if (nationalRank !== undefined) update.nationalRank = nationalRank || null;
    if (internationalRank !== undefined) update.internationalRank = internationalRank || null;
    if (blade !== undefined) update.blade = blade;
    if (fhRubber !== undefined) update.fhRubber = fhRubber;
    if (bhRubber !== undefined) update.bhRubber = bhRubber;
    if (displayOrder != null) update.displayOrder = Number(displayOrder);
    const [player] = await db.update(playersTable).set(update).where(eq(playersTable.id, id)).returning();
    if (!player) return res.status(404).json({ error: "Not found" });
    const mappings = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.playerId, id));
    return res.json({ ...player, achievementIds: mappings.map(m => m.achievementId), createdAt: player.createdAt.toISOString() });
  }

  if (req.method === "DELETE") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    await db.delete(achievementPlayersTable).where(eq(achievementPlayersTable.playerId, id));
    await db.delete(playersTable).where(eq(playersTable.id, id));
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
