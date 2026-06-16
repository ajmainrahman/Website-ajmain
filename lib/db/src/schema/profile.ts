import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Moshfiqur Rahman Ajmain"),
  tagline: text("tagline").notNull().default("Building AI that understands both data and people."),
  profilePictureUrl: text("profile_picture_url"),
  cvLink: text("cv_link"),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;
