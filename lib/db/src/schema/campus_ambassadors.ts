import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campusAmbassadorsTable = pgTable("campus_ambassadors", {
  id: serial("id").primaryKey(),
  organization: text("organization").notNull(),
  role: text("role").notNull(),
  duration: text("duration"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCampusAmbassadorSchema = createInsertSchema(campusAmbassadorsTable).omit({ id: true, createdAt: true });
export type InsertCampusAmbassador = z.infer<typeof insertCampusAmbassadorSchema>;
export type CampusAmbassador = typeof campusAmbassadorsTable.$inferSelect;
