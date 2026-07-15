import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Moshfiqur Rahman Ajmain"),
  tagline: text("tagline").notNull().default("Building AI that understands both data and people."),
  profilePictureUrl: text("profile_picture_url"),
  cvLink: text("cv_link"),
  bio: text("bio"),
  quote: text("quote"),
  bengaliQuote: text("bengali_quote"),
  openToWork: boolean("open_to_work").notNull().default(false),
  openToWorkText: text("open_to_work_text"),
  homeLabelResearch: text("home_label_research"),
  homeLabelIndustry: text("home_label_industry"),
  researchGate: text("research_gate"),
  orcid: text("orcid"),
  googleScholar: text("google_scholar"),
  academia: text("academia"),
  researchInterests: text("research_interests"),
  industryInterests: text("industry_interests"),
  problemSolvingText: text("problem_solving_text"),
  problemSolvingPlatforms: text("problem_solving_platforms"),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;
