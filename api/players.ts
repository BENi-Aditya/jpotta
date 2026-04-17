import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, playersTable, achievementPlayersTable } from "./_db";
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
    const players = await db.select().from(playersTable).orderBy(playersTable.displayOrder, playersTable.id);
    const mappings = await db.select().from(achievementPlayersTable);
    const result = players.map(p => ({
      ...p,
      achievementIds: mappings.filter(m => m.playerId === p.id).map(m => m.achievementId),
      createdAt: p.createdAt.toISOString(),
    }));
    return res.json(result);
  }

  if (req.method === "POST") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { name, photoUrl, district, state, districtRank, stateRank, nationalRank, internationalRank, blade, fhRubber, bhRubber, displayOrder } = (await readJsonBody(req)) ?? {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const [player] = await db.insert(playersTable).values({
      name, photoUrl, district, state,
      districtRank: districtRank || null,
      stateRank: stateRank || null,
      nationalRank: nationalRank || null,
      internationalRank: internationalRank || null,
      blade, fhRubber, bhRubber,
      displayOrder: displayOrder ?? 0,
    }).returning();
    return res.status(201).json({ ...player, achievementIds: [], createdAt: player.createdAt.toISOString() });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
