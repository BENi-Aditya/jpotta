import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  CreateNewsArticleBody,
  UpdateNewsArticleBody,
  UpdateNewsArticleParams,
  GetNewsArticleParams,
  DeleteNewsArticleParams,
} from "@workspace/api-zod";

function serializeNews(a: typeof newsTable.$inferSelect) {
  return {
    ...a,
    publishedAt: a.publishedAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
  };
}

const router: IRouter = Router();

router.get("/news", async (_req, res): Promise<void> => {
  const articles = await db.select().from(newsTable).orderBy(newsTable.publishedAt);
  res.json(articles.map(serializeNews));
});

router.post("/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [article] = await db.insert(newsTable).values({
    ...parsed.data,
    publishedAt: new Date(parsed.data.publishedAt),
  }).returning();
  res.status(201).json(serializeNews(article));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [article] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!article) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(serializeNews(article));
});

router.patch("/news/:id", async (req, res): Promise<void> => {
  const params = UpdateNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.title != null) updateData.title = parsed.data.title;
  if (parsed.data.summary != null) updateData.summary = parsed.data.summary;
  if (parsed.data.content != null) updateData.content = parsed.data.content;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.publishedAt != null) updateData.publishedAt = new Date(parsed.data.publishedAt);

  const [article] = await db.update(newsTable).set(updateData).where(eq(newsTable.id, params.data.id)).returning();
  if (!article) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(serializeNews(article));
});

router.delete("/news/:id", async (req, res): Promise<void> => {
  const params = DeleteNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [article] = await db.delete(newsTable).where(eq(newsTable.id, params.data.id)).returning();
  if (!article) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
