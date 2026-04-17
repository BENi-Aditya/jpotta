import type { VercelRequest, VercelResponse } from "@vercel/node";
import { desc } from "drizzle-orm";
import { db, newsTable } from "./_db";
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
    const articles = await db.select().from(newsTable).orderBy(desc(newsTable.publishedAt));
    return res.json(articles.map(a => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
    })));
  }

  if (req.method === "POST") {
    if (!(await isAdminRequest(req))) return res.status(401).json({ error: "Unauthorized" });
    const { title, summary, content, imageUrl, publishedAt } = (await readJsonBody(req)) ?? {};
    if (!title) return res.status(400).json({ error: "title is required" });
    const [article] = await db.insert(newsTable).values({
      title,
      summary: summary ?? "",
      content: content ?? "",
      imageUrl: imageUrl ?? null,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    }).returning();
    return res.status(201).json({
      ...article,
      publishedAt: article.publishedAt.toISOString(),
      createdAt: article.createdAt.toISOString(),
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
