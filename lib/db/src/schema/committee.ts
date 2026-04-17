import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const committeeTable = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommitteeSchema = createInsertSchema(committeeTable).omit({ id: true, createdAt: true });
export type InsertCommitteeMember = z.infer<typeof insertCommitteeSchema>;
export type CommitteeMember = typeof committeeTable.$inferSelect;
