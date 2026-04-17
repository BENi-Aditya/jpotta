import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db, newsTable } from "../_db";
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
    const { title, summary, content, imageUrl, publishedAt } = (await readJsonBody(req)) ?? {};
    const update: Record<string, unknown> = {};
    if (title != null) update.title = title;
    if (summary !== undefined) update.summary = summary;
    if (content !== undefined) update.content = content;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (publishedAt !== undefined) update.publishedAt = new Date(publishedAt);
    const [article] = await db.update(newsTable).set(update).where(eq(newsTable.id, id)).returning();
    if (!article) return res.status(404).json({ error: "Not found" });
    return res.json({ ...article, publishedAt: article.publishedAt.toISOString(), createdAt: article.createdAt.toISOString() });
  }

  if (req.method === "DELETE") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    await db.delete(newsTable).where(eq(newsTable.id, id));
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
