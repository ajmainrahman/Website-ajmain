import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hobbiesTable = pgTable("hobbies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHobbySchema = createInsertSchema(hobbiesTable).omit({ id: true, createdAt: true });
export type InsertHobby = z.infer<typeof insertHobbySchema>;
export type Hobby = typeof hobbiesTable.$inferSelect;
