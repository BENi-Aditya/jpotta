import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, committeeTable } from "@workspace/db";
import {
  CreateCommitteeMemberBody,
  UpdateCommitteeMemberBody,
  UpdateCommitteeMemberParams,
  DeleteCommitteeMemberParams,
} from "@workspace/api-zod";

function serializeMember(m: typeof committeeTable.$inferSelect) {
  return {
    ...m,
    displayOrder: m.displayOrder ?? 0,
    createdAt: m.createdAt.toISOString(),
  };
}

const router: IRouter = Router();

router.get("/committee", async (_req, res): Promise<void> => {
  const members = await db.select().from(committeeTable).orderBy(committeeTable.displayOrder);
  res.json(members.map(serializeMember));
});

router.post("/committee", async (req, res): Promise<void> => {
  const parsed = CreateCommitteeMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.insert(committeeTable).values({
    ...parsed.data,
    displayOrder: parsed.data.displayOrder ?? 0,
  }).returning();
  res.status(201).json(serializeMember(member));
});

router.patch("/committee/:id", async (req, res): Promise<void> => {
  const params = UpdateCommitteeMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCommitteeMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.name != null) updateData.name = parsed.data.name;
  if (parsed.data.role != null) updateData.role = parsed.data.role;
  if (parsed.data.photoUrl !== undefined) updateData.photoUrl = parsed.data.photoUrl;
  if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio;
  if (parsed.data.displayOrder != null) updateData.displayOrder = parsed.data.displayOrder;

  const [member] = await db.update(committeeTable).set(updateData).where(eq(committeeTable.id, params.data.id)).returning();
  if (!member) {
    res.status(404).json({ error: "Committee member not found" });
    return;
  }
  res.json(serializeMember(member));
});

router.delete("/committee/:id", async (req, res): Promise<void> => {
  const params = DeleteCommitteeMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [member] = await db.delete(committeeTable).where(eq(committeeTable.id, params.data.id)).returning();
  if (!member) {
    res.status(404).json({ error: "Committee member not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
