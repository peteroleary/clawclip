import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { authUsers } from "./auth.js";

export const humanEmployees = pgTable(
  "human_employees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    userId: text("user_id").references(() => authUsers.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    role: text("role").notNull().default("member"),
    title: text("title"),
    department: text("department").notNull().default("Engineering"),
    reportsTo: uuid("reports_to"),
    status: text("status").notNull().default("active"),
    workingHours: jsonb("working_hours").$type<{ start: string; end: string; timezone: string }>().default({
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
    }),
    hourlyCostCents: integer("hourly_cost_cents").notNull().default(5000),
    skills: jsonb("skills").$type<string[]>().default([]),
    deskPosition: jsonb("desk_position").$type<{ x: number; y: number; floor?: number; zone?: string }>().default({
      x: 0,
      y: 0,
      floor: 1,
      zone: "Main Open Office",
    }),
    avatarConfig: jsonb("avatar_config").$type<{
      hairStyle?: string;
      hairColor?: string;
      outfitColor?: string;
      skinTone?: string;
      accessory?: string;
      spriteId?: string;
    }>().default({
      hairStyle: "short",
      hairColor: "#3b82f6",
      outfitColor: "#1e293b",
      skinTone: "#f87171",
      accessory: "none",
      spriteId: "human_1",
    }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyStatusIdx: index("human_employees_company_status_idx").on(table.companyId, table.status),
    companyDeptIdx: index("human_employees_company_dept_idx").on(table.companyId, table.department),
  })
);
