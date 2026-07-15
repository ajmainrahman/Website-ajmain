import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const researchPapersTable = pgTable("research_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  abstract: text("abstract"),
  venue: text("venue").notNull(),
  year: integer("year").notNull(),
  paperLink: text("paper_link"),
  tags: text("tags").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertResearchPaperSchema = createInsertSchema(researchPapersTable).omit({ id: true, createdAt: true });
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;
export type ResearchPaper = typeof researchPapersTable.$inferSelect;
