import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { db, achievementsTable, achievementPlayersTable, playersTable } from "@workspace/db";
import {
  CreateAchievementBody,
  UpdateAchievementBody,
  UpdateAchievementParams,
  GetAchievementParams,
  DeleteAchievementParams,
  TagPlayerInAchievementParams,
  TagPlayerInAchievementBody,
  UntagPlayerFromAchievementParams,
  UntagPlayerFromAchievementBody,
  ListAchievementsQueryParams,
} from "@workspace/api-zod";

function serializeAchievement(a: typeof achievementsTable.$inferSelect, taggedPlayerIds: number[] = []) {
  return {
    ...a,
    taggedPlayerIds,
    createdAt: a.createdAt.toISOString(),
  };
}

function serializePlayer(p: typeof playersTable.$inferSelect) {
  return {
    ...p,
    displayOrder: p.displayOrder ?? 0,
    createdAt: p.createdAt.toISOString(),
  };
}

async function getTaggedPlayerIds(achievementId: number): Promise<number[]> {
  const tags = await db.select().from(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, achievementId));
  return tags.map((t) => t.playerId);
}

const router: IRouter = Router();

router.get("/achievements/years", async (_req, res): Promise<void> => {
  const rows = await db.selectDistinct({ year: achievementsTable.year }).from(achievementsTable).orderBy(achievementsTable.year);
  res.json(rows.map((r) => r.year));
});

router.get("/achievements", async (req, res): Promise<void> => {
  const query = ListAchievementsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let achievements;
  const year = query.data.year;

  if (year != null) {
    achievements = await db.select().from(achievementsTable).where(eq(achievementsTable.year, year)).orderBy(achievementsTable.createdAt);
  } else {
    achievements = await db.select().from(achievementsTable).orderBy(achievementsTable.createdAt);
  }

  const result = await Promise.all(
    achievements.map(async (a) => {
      const taggedPlayerIds = await getTaggedPlayerIds(a.id);
      return serializeAchievement(a, taggedPlayerIds);
    })
  );

  res.json(result);
});

router.get("/achievements/:id", async (req, res): Promise<void> => {
  const params = GetAchievementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [achievement] = await db.select().from(achievementsTable).where(eq(achievementsTable.id, params.data.id));
  if (!achievement) {
    res.status(404).json({ error: "Achievement not found" });
    return;
  }

  const taggedPlayerIds = await getTaggedPlayerIds(achievement.id);
  let taggedPlayers: (typeof playersTable.$inferSelect)[] = [];
  if (taggedPlayerIds.length > 0) {
    taggedPlayers = await db.select().from(playersTable).where(inArray(playersTable.id, taggedPlayerIds));
  }

  res.json({
    ...serializeAchievement(achievement, taggedPlayerIds),
    taggedPlayers: taggedPlayers.map(serializePlayer),
  });
});

router.post("/achievements", async (req, res): Promise<void> => {
  const parsed = CreateAchievementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { taggedPlayerIds, ...achievementData } = parsed.data;
  const [achievement] = await db.insert(achievementsTable).values({
    ...achievementData,
    additionalImages: achievementData.additionalImages ?? [],
  }).returning();

  if (taggedPlayerIds && taggedPlayerIds.length > 0) {
    await db.insert(achievementPlayersTable).values(
      taggedPlayerIds.map((playerId) => ({ achievementId: achievement.id, playerId }))
    );
  }

  const tagIds = await getTaggedPlayerIds(achievement.id);
  res.status(201).json(serializeAchievement(achievement, tagIds));
});

router.patch("/achievements/:id", async (req, res): Promise<void> => {
  const params = UpdateAchievementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAchievementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { taggedPlayerIds, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = {};
  if (rest.title != null) updateData.title = rest.title;
  if (rest.shortDescription != null) updateData.shortDescription = rest.shortDescription;
  if (rest.longDescription != null) updateData.longDescription = rest.longDescription;
  if (rest.year != null) updateData.year = rest.year;
  if (rest.mainImageUrl !== undefined) updateData.mainImageUrl = rest.mainImageUrl;
  if (rest.additionalImages !== undefined) updateData.additionalImages = rest.additionalImages;

  const [achievement] = await db.update(achievementsTable).set(updateData).where(eq(achievementsTable.id, params.data.id)).returning();
  if (!achievement) {
    res.status(404).json({ error: "Achievement not found" });
    return;
  }

  if (taggedPlayerIds !== undefined) {
    await db.delete(achievementPlayersTable).where(eq(achievementPlayersTable.achievementId, achievement.id));
    if (taggedPlayerIds.length > 0) {
      await db.insert(achievementPlayersTable).values(
        taggedPlayerIds.map((playerId) => ({ achievementId: achievement.id, playerId }))
      );
    }
  }

  const tagIds = await getTaggedPlayerIds(achievement.id);
  res.json(serializeAchievement(achievement, tagIds));
});

router.delete("/achievements/:id", async (req, res): Promise<void> => {
  const params = DeleteAchievementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [achievement] = await db.delete(achievementsTable).where(eq(achievementsTable.id, params.data.id)).returning();
  if (!achievement) {
    res.status(404).json({ error: "Achievement not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/achievements/:id/players", async (req, res): Promise<void> => {
  const params = TagPlayerInAchievementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = TagPlayerInAchievementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(achievementPlayersTable).values({ achievementId: params.data.id, playerId: parsed.data.playerId }).onConflictDoNothing();
  res.json({ success: true });
});

router.delete("/achievements/:id/players", async (req, res): Promise<void> => {
  const params = UntagPlayerFromAchievementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UntagPlayerFromAchievementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.delete(achievementPlayersTable)
    .where(eq(achievementPlayersTable.achievementId, params.data.id));
  res.sendStatus(204);
});

export default router;
