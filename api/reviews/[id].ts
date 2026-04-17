import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "../_db";
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
    const { authorName, authorTitle, content, rating, photoUrl } = (await readJsonBody(req)) ?? {};
    const update: Record<string, unknown> = {};
    if (authorName != null) update.authorName = authorName;
    if (authorTitle !== undefined) update.authorTitle = authorTitle;
    if (content != null) update.content = content;
    if (rating != null) update.rating = Number(rating);
    if (photoUrl !== undefined) update.photoUrl = photoUrl;
    const [review] = await db.update(reviewsTable).set(update).where(eq(reviewsTable.id, id)).returning();
    if (!review) return res.status(404).json({ error: "Not found" });
    return res.json({ ...review, createdAt: review.createdAt.toISOString() });
  }

  if (req.method === "DELETE") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
