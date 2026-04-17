import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  UpdateReviewBody,
  UpdateReviewParams,
  DeleteReviewParams,
} from "@workspace/api-zod";

function serializeReview(r: typeof reviewsTable.$inferSelect) {
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
  };
}

const router: IRouter = Router();

router.get("/reviews", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
  res.json(reviews.map(serializeReview));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db.insert(reviewsTable).values(parsed.data).returning();
  res.status(201).json(serializeReview(review));
});

router.patch("/reviews/:id", async (req, res): Promise<void> => {
  const params = UpdateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.authorName != null) updateData.authorName = parsed.data.authorName;
  if (parsed.data.authorTitle !== undefined) updateData.authorTitle = parsed.data.authorTitle;
  if (parsed.data.content != null) updateData.content = parsed.data.content;
  if (parsed.data.rating != null) updateData.rating = parsed.data.rating;
  if (parsed.data.photoUrl !== undefined) updateData.photoUrl = parsed.data.photoUrl;

  const [review] = await db.update(reviewsTable).set(updateData).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(serializeReview(review));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
