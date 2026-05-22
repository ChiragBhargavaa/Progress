import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const creatorEnum = pgEnum("creator", ["admin", "client"]);
export const designSourceEnum = pgEnum("design_source", [
  "dribbble",
  "awwwards",
  "behance",
  "pinterest",
  "siteinspire",
  "custom",
]);

export type ThemeConfig = {
  mode: "preset" | "custom" | "developer";
  presetId?: string;
  colors?: Record<string, string>;
  developerVars?: Record<string, string>;
};

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: text("client_name").notNull(),
  projectName: text("project_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordEncrypted: text("password_encrypted").notNull(),
  liveSiteUrl: text("live_site_url"),
  techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
  theme: jsonb("theme").$type<ThemeConfig>().notNull().default({
    mode: "preset",
    presetId: "blush-classic",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdBy: creatorEnum("created_by").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const requirements = pgTable("requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  milestoneId: uuid("milestone_id")
    .notNull()
    .references(() => milestones.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdBy: creatorEnum("created_by").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const designReferences = pgTable("design_references", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  comment: text("comment"),
  source: designSourceEnum("source").notNull().default("custom"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
