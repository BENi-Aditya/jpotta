import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, reviewsTable } from "./_db";
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
    const reviews = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
    return res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  }

  if (req.method === "POST") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { authorName, authorTitle, content, rating, photoUrl } = (await readJsonBody(req)) ?? {};
    if (!authorName || !content) return res.status(400).json({ error: "authorName and content are required" });
    const [review] = await db.insert(reviewsTable).values({
      authorName, authorTitle: authorTitle ?? null, content,
      rating: Number(rating ?? 5), photoUrl: photoUrl ?? null,
    }).returning();
    return res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
