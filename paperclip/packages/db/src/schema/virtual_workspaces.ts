import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export interface VirtualWorkspaceZone {
  id: string;
  name: string;
  color: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export interface VirtualWorkspaceDesk {
  id: string;
  x: number;
  z: number;
  rotation: number;
  assignedMemberId?: string | null;
  zone: string;
}

export interface VirtualWorkspaceLayout {
  width: number;
  height: number;
  zones: VirtualWorkspaceZone[];
  desks: VirtualWorkspaceDesk[];
  floorType?: string;
  theme?: string;
}

export const virtualWorkspaces = pgTable(
  "virtual_workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    layout: jsonb("layout").$type<VirtualWorkspaceLayout>().notNull().default({
      width: 30,
      height: 20,
      zones: [],
      desks: [],
    }),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
    isDefault: boolean("is_default").notNull().default(false),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companySlugIdx: uniqueIndex("virtual_workspaces_company_slug_idx").on(table.companyId, table.slug),
    companyStatusIdx: index("virtual_workspaces_company_status_idx").on(table.companyId, table.status),
  })
);

export interface VirtualWorkspacePresencePosition {
  x: number;
  y: number;
  z?: number;
  floor?: number;
  zone?: string;
  deskId?: string | null;
  rotation?: number;
}

export interface VirtualWorkspaceActiveTask {
  id: string;
  title: string;
  identifier: string;
}

export const virtualWorkspacePresence = pgTable(
  "virtual_workspace_presence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => virtualWorkspaces.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    memberType: text("member_type").notNull(), // 'agent' | 'human'
    memberId: text("member_id").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("member"),
    status: text("status").notNull().default("active"), // 'active' | 'working' | 'idle' | 'in_meeting' | 'offline' | 'on_break'
    position: jsonb("position").$type<VirtualWorkspacePresencePosition>().notNull().default({ x: 0, y: 0 }),
    avatarConfig: jsonb("avatar_config").$type<Record<string, unknown>>().default({}),
    activeTask: jsonb("active_task").$type<VirtualWorkspaceActiveTask | null>(),
    currentSpeech: text("current_speech"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    workspaceMemberIdx: uniqueIndex("virtual_workspace_presence_workspace_member_idx").on(table.workspaceId, table.memberType, table.memberId),
    workspaceStatusIdx: index("virtual_workspace_presence_workspace_status_idx").on(table.workspaceId, table.status),
    lastSeenIdx: index("virtual_workspace_presence_last_seen_idx").on(table.workspaceId, table.lastSeenAt),
  })
);
