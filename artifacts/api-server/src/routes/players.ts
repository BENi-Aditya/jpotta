import { Router, type IRouter } from "express";
import { eq, ilike, inArray } from "drizzle-orm";
import { db, playersTable, achievementsTable, achievementPlayersTable } from "@workspace/db";
import {
  CreatePlayerBody,
  UpdatePlayerBody,
  UpdatePlayerParams,
  GetPlayerParams,
  DeletePlayerParams,
  ListPlayersQueryParams,
} from "@workspace/api-zod";

function serializePlayer(p: typeof playersTable.$inferSelect) {
  return {
    ...p,
    displayOrder: p.displayOrder ?? 0,
    createdAt: p.createdAt.toISOString(),
  };
}

function serializeAchievement(a: typeof achievementsTable.$inferSelect, taggedPlayerIds: number[] = []) {
  return {
    ...a,
    taggedPlayerIds,
    createdAt: a.createdAt.toISOString(),
  };
}

const router: IRouter = Router();

router.get("/players", async (req, res): Promise<void> => {
  const query = ListPlayersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let players;
  if (query.data.search) {
    players = await db.select().from(playersTable).where(ilike(playersTable.name, `%${query.data.search}%`)).orderBy(playersTable.displayOrder);
  } else {
    players = await db.select().from(playersTable).orderBy(playersTable.displayOrder);
  }

  res.json(players.map(serializePlayer));
});

router.post("/players", async (req, res): Promise<void> => {
  const parsed = CreatePlayerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [player] = await db.insert(playersTable).values({
    ...parsed.data,
    displayOrder: parsed.data.displayOrder ?? 0,
  }).returning();
  res.status(201).json(serializePlayer(player));
});

router.get("/players/:id", async (req, res): Promise<void> => {
  const params = GetPlayerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [player] = await db.select().from(playersTable).where(eq(playersTable.id, params.data.id));
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  const tags = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.playerId, player.id));
  let achievements: (typeof achievementsTable.$inferSelect)[] = [];
  if (tags.length > 0) {
    achievements = await db.select().from(achievementsTable).where(inArray(achievementsTable.id, tags.map((t) => t.achievementId)));
  }

  const achievementsWithTags = await Promise.all(
    achievements.map(async (a) => {
      const aTags = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, a.id));
      return serializeAchievement(a, aTags.map((t) => t.playerId));
    })
  );

  res.json({ ...serializePlayer(player), achievements: achievementsWithTags });
});

router.patch("/players/:id", async (req, res): Promise<void> => {
  const params = UpdatePlayerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePlayerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.name != null) updateData.name = parsed.data.name;
  if (parsed.data.photoUrl !== undefined) updateData.photoUrl = parsed.data.photoUrl;
  if (parsed.data.district !== undefined) updateData.district = parsed.data.district;
  if (parsed.data.state !== undefined) updateData.state = parsed.data.state;
  if (parsed.data.districtRank !== undefined) updateData.districtRank = parsed.data.districtRank || null;
  if (parsed.data.stateRank !== undefined) updateData.stateRank = parsed.data.stateRank || null;
  if (parsed.data.nationalRank !== undefined) updateData.nationalRank = parsed.data.nationalRank || null;
  if (parsed.data.internationalRank !== undefined) updateData.internationalRank = parsed.data.internationalRank || null;
  if (parsed.data.blade !== undefined) updateData.blade = parsed.data.blade;
  if (parsed.data.bhRubber !== undefined) updateData.bhRubber = parsed.data.bhRubber;
  if (parsed.data.fhRubber !== undefined) updateData.fhRubber = parsed.data.fhRubber;
  if (parsed.data.displayOrder != null) updateData.displayOrder = parsed.data.displayOrder;

  const [player] = await db.update(playersTable).set(updateData).where(eq(playersTable.id, params.data.id)).returning();
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }
  res.json(serializePlayer(player));
});

router.delete("/players/:id", async (req, res): Promise<void> => {
  const params = DeletePlayerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [player] = await db.delete(playersTable).where(eq(playersTable.id, params.data.id)).returning();
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
