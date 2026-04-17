import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { db, playersTable, achievementsTable, achievementPlayersTable, newsTable, committeeTable, reviewsTable } from "./_db";

const cors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) return res.status(500).json({ error: "Database not configured" });

  const sql = neon(connectionString);

  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      photo_url TEXT,
      district TEXT,
      state TEXT,
      district_rank TEXT,
      state_rank TEXT,
      national_rank TEXT,
      international_rank TEXT,
      blade TEXT,
      bh_rubber TEXT,
      fh_rubber TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE players ADD COLUMN IF NOT EXISTS district_rank TEXT`;
  await sql`ALTER TABLE players ADD COLUMN IF NOT EXISTS state_rank TEXT`;
  await sql`ALTER TABLE players ADD COLUMN IF NOT EXISTS national_rank TEXT`;
  await sql`ALTER TABLE players ADD COLUMN IF NOT EXISTS international_rank TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL DEFAULT '',
      long_description TEXT NOT NULL DEFAULT '',
      year INTEGER NOT NULL,
      category TEXT,
      main_image_url TEXT,
      additional_images TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievement_players (
      achievement_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      image_url TEXT,
      published_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS committee_members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      photo_url TEXT,
      bio TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      author_name TEXT NOT NULL,
      author_title TEXT,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      photo_url TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  const existingPlayers = await db.select().from(playersTable);
  if (existingPlayers.length === 0) {
    await db.insert(playersTable).values([
      { name: "Karthik Selvam", district: "Chennai", state: "Tamil Nadu", districtRank: "#1", stateRank: "#3", nationalRank: null, internationalRank: null, blade: "Butterfly Viscaria", fhRubber: "Tenergy 05", bhRubber: "Tenergy 64", displayOrder: 1 },
      { name: "Meena Devi", district: "Coimbatore", state: "Tamil Nadu", districtRank: "#2", stateRank: "#7", nationalRank: null, internationalRank: null, blade: "Stiga Infinity VPS V", fhRubber: "Xiom Omega VII", bhRubber: "Xiom Vega Pro", displayOrder: 2 },
      { name: "Arun Prakash", district: "Madurai", state: "Tamil Nadu", districtRank: "#1", stateRank: "#12", nationalRank: null, internationalRank: null, blade: "DHS Hurricane Long 5", fhRubber: "DHS Hurricane 3", bhRubber: "Yasaka Rakza 7", displayOrder: 3 },
    ]);
  }

  const existingNews = await db.select().from(newsTable);
  if (existingNews.length === 0) {
    await db.insert(newsTable).values([
      { title: "JPOTTA Players Shine at State Championship 2024", summary: "Our players delivered stellar performances at the Tamil Nadu State Table Tennis Championship 2024.", content: "Our players delivered stellar performances at the Tamil Nadu State Table Tennis Championship 2024, bringing home multiple medals across categories.", publishedAt: new Date("2024-01-15") },
      { title: "New Training Block Inaugurated at Main Centre", summary: "JP Olympia Table Tennis Academy inaugurated a state-of-the-art training block with 10 new competition-grade tables.", content: "JP Olympia Table Tennis Academy inaugurated a state-of-the-art training block with 10 new competition-grade tables, modern lighting and video analysis systems.", publishedAt: new Date("2024-03-28") },
      { title: "Annual Summer Camp Registration Now Open", summary: "Registrations for our Annual Summer Intensive Training Camp are now open for players aged 8-18.", content: "Registrations for our Annual Summer Intensive Training Camp are now open. The camp offers focused training for players aged 8-18 across skill levels.", publishedAt: new Date("2024-04-10") },
    ]);
  }

  const existingAchievements = await db.select().from(achievementsTable);
  if (existingAchievements.length === 0) {
    const [a1] = await db.insert(achievementsTable).values([
      { title: "Tamil Nadu State Junior Champion", shortDescription: "Gold medal at TTFI-recognised State Junior Championship", longDescription: "Our academy player clinched the coveted Tamil Nadu State Junior Championship title.", year: 2024, category: "State" },
    ]).returning();
    const [a2] = await db.insert(achievementsTable).values([
      { title: "District Teams Championship – First Place", shortDescription: "JPOTTA team won the overall District Teams Championship", longDescription: "The JPOTTA team dominated the District Teams Championship with an unbeaten run.", year: 2023, category: "District" },
    ]).returning();
    const [a3] = await db.insert(achievementsTable).values([
      { title: "National Sub-Junior Ranking Tournament – Bronze", shortDescription: "Bronze medal at the National Sub-Junior Ranking Tournament", longDescription: "One of our youngest players competed at the National Sub-Junior Ranking Tournament and returned with a bronze medal.", year: 2023, category: "National" },
    ]).returning();

    const players = await db.select().from(playersTable);
    if (players.length >= 3) {
      await db.insert(achievementPlayersTable).values([
        { achievementId: a1.id, playerId: players[0].id },
        { achievementId: a2.id, playerId: players[0].id },
        { achievementId: a2.id, playerId: players[1].id },
        { achievementId: a3.id, playerId: players[2].id },
      ]);
    }
  }

  const existingReviews = await db.select().from(reviewsTable);
  if (existingReviews.length === 0) {
    await db.insert(reviewsTable).values([
      { authorName: "Ramesh Kumar", authorTitle: "Parent of Trainee", content: "JP Olympia is one of the best academies in Tamil Nadu. My son has improved dramatically in just 6 months.", rating: 5 },
      { authorName: "Priya Shankar", authorTitle: "State-level Player", content: "Excellent facility and outstanding coaching. The training environment here pushed me to achieve my state ranking.", rating: 5 },
      { authorName: "Arjun Venkat", authorTitle: "Junior Champion", content: "The dedication of the coaches here is unparalleled. Within a year I won my first district-level championship.", rating: 5 },
    ]);
  }

  const existingCommittee = await db.select().from(committeeTable);
  if (existingCommittee.length === 0) {
    await db.insert(committeeTable).values([
      { name: "Dr. P. Jayakumar", role: "President & Founder", bio: "National-level administrator with 20+ years of service to table tennis.", displayOrder: 1 },
      { name: "Mrs. Latha Rajan", role: "Secretary General", bio: "Organiser of multiple national and state tournaments.", displayOrder: 2 },
      { name: "Mr. Suresh Natarajan", role: "Chief Coach", bio: "Former national-ranked player with international coaching certifications.", displayOrder: 3 },
    ]);
  }

  return res.json({ success: true, message: "Database setup complete" });
}
