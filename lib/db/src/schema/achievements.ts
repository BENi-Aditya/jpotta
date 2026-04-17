import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  longDescription: text("long_description").notNull(),
  year: integer("year").notNull(),
  mainImageUrl: text("main_image_url"),
  additionalImages: text("additional_images").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievementPlayersTable = pgTable("achievement_players", {
  achievementId: integer("achievement_id").notNull().references(() => achievementsTable.id, { onDelete: "cascade" }),
  playerId: integer("player_id").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievementsTable).omit({ id: true, createdAt: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievementsTable.$inferSelect;
export type AchievementPlayer = typeof achievementPlayersTable.$inferSelect;
