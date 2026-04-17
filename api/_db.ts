import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

let _db: NeonHttpDatabase | null = null;

function getDb(): NeonHttpDatabase {
  if (_db) return _db;
  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) throw new Error("POSTGRES_URL or DATABASE_URL environment variable is required");
  _db = drizzle(neon(connectionString));
  return _db;
}

export const db: NeonHttpDatabase = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export const playersTable = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  district: text("district"),
  state: text("state"),
  districtRank: text("district_rank"),
  stateRank: text("state_rank"),
  nationalRank: text("national_rank"),
  internationalRank: text("international_rank"),
  blade: text("blade"),
  bhRubber: text("bh_rubber"),
  fhRubber: text("fh_rubber"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  longDescription: text("long_description").notNull().default(""),
  year: integer("year").notNull(),
  category: text("category"),
  mainImageUrl: text("main_image_url"),
  additionalImages: text("additional_images").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievementPlayersTable = pgTable("achievement_players", {
  achievementId: integer("achievement_id").notNull(),
  playerId: integer("player_id").notNull(),
});

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const committeeTable = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
