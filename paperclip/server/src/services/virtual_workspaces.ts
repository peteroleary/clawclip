import type { Db } from "@paperclipai/db";
import { virtualWorkspaces, virtualWorkspacePresence } from "@paperclipai/db";
import { eq, and, desc, lt, ne } from "drizzle-orm";
import type {
  CreateVirtualWorkspace,
  UpdateVirtualWorkspace,
  UpdateMemberPresence,
  VirtualWorkspaceLayout,
} from "@paperclipai/shared";
import { publishLiveEvent } from "./live-events.js";

const DEFAULT_WORKSPACE_LAYOUT: VirtualWorkspaceLayout = {
  width: 40,
  height: 30,
  zones: [
    {
      id: "open-office",
      name: "Main Open Office",
      color: "#3b82f6",
      bounds: { minX: -15, maxX: 5, minZ: -10, maxZ: 10 },
    },
    {
      id: "meeting-room",
      name: "Conference Room A",
      color: "#10b981",
      bounds: { minX: 8, maxX: 18, minZ: -10, maxZ: 0 },
    },
    {
      id: "breakroom",
      name: "Breakroom & Cafe",
      color: "#f59e0b",
      bounds: { minX: 8, maxX: 18, minZ: 2, maxZ: 12 },
    },
    {
      id: "executive-suite",
      name: "Executive Suite",
      color: "#8b5cf6",
      bounds: { minX: -15, maxX: -5, minZ: 12, maxZ: 18 },
    },
  ],
  desks: [
    { id: "desk-1", x: -10, z: -5, rotation: 0, zone: "Main Open Office" },
    { id: "desk-2", x: -6, z: -5, rotation: 0, zone: "Main Open Office" },
    { id: "desk-3", x: -2, z: -5, rotation: 0, zone: "Main Open Office" },
    { id: "desk-4", x: -10, z: 0, rotation: 180, zone: "Main Open Office" },
    { id: "desk-5", x: -6, z: 0, rotation: 180, zone: "Main Open Office" },
    { id: "desk-6", x: -2, z: 0, rotation: 180, zone: "Main Open Office" },
    { id: "desk-7", x: -10, z: 5, rotation: 0, zone: "Main Open Office" },
    { id: "desk-8", x: -6, z: 5, rotation: 0, zone: "Main Open Office" },
  ],
  floorType: "carpet_blue",
  theme: "retro_3d",
};

export function virtualWorkspaceService(db: Db) {
  return {
    async listWorkspaces(companyId: string) {
      await this.ensureDefaultWorkspace(companyId);
      return db
        .select()
        .from(virtualWorkspaces)
        .where(eq(virtualWorkspaces.companyId, companyId))
        .orderBy(desc(virtualWorkspaces.isDefault), desc(virtualWorkspaces.createdAt));
    },

    async getWorkspace(companyId: string, workspaceIdOrSlug: string) {
      await this.ensureDefaultWorkspace(companyId);
      const [byUuid] = await db
        .select()
        .from(virtualWorkspaces)
        .where(
          and(
            eq(virtualWorkspaces.companyId, companyId),
            eq(virtualWorkspaces.id, workspaceIdOrSlug)
          )
        )
        .limit(1);

      if (byUuid) return byUuid;

      const [bySlug] = await db
        .select()
        .from(virtualWorkspaces)
        .where(
          and(
            eq(virtualWorkspaces.companyId, companyId),
            eq(virtualWorkspaces.slug, workspaceIdOrSlug)
          )
        )
        .limit(1);

      return bySlug ?? null;
    },

    async createWorkspace(companyId: string, input: CreateVirtualWorkspace) {
      const slug =
        input.slug ||
        input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const [created] = await db
        .insert(virtualWorkspaces)
        .values({
          companyId,
          name: input.name,
          slug,
          description: input.description ?? null,
          layout: input.layout ?? DEFAULT_WORKSPACE_LAYOUT,
          settings: input.settings ?? {},
          isDefault: input.isDefault ?? false,
          status: "active",
        })
        .returning();

      return created;
    },

    async updateWorkspace(
      companyId: string,
      workspaceId: string,
      input: UpdateVirtualWorkspace
    ) {
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.layout !== undefined) updateData.layout = input.layout;
      if (input.settings !== undefined) updateData.settings = input.settings;
      if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;
      if (input.status !== undefined) updateData.status = input.status;

      const [updated] = await db
        .update(virtualWorkspaces)
        .set(updateData)
        .where(
          and(
            eq(virtualWorkspaces.companyId, companyId),
            eq(virtualWorkspaces.id, workspaceId)
          )
        )
        .returning();

      if (updated) {
        publishLiveEvent({
          companyId,
          type: "virtual_workspace:updated" as any,
          payload: { workspaceId: updated.id, name: updated.name },
        });
      }

      return updated ?? null;
    },

    async deleteWorkspace(companyId: string, workspaceId: string) {
      const [deleted] = await db
        .delete(virtualWorkspaces)
        .where(
          and(
            eq(virtualWorkspaces.companyId, companyId),
            eq(virtualWorkspaces.id, workspaceId)
          )
        )
        .returning();

      return deleted ?? null;
    },

    async ensureDefaultWorkspace(companyId: string) {
      const [existing] = await db
        .select()
        .from(virtualWorkspaces)
        .where(
          and(
            eq(virtualWorkspaces.companyId, companyId),
            eq(virtualWorkspaces.isDefault, true)
          )
        )
        .limit(1);

      if (existing) return existing;

      // Also check if any workspace exists for company
      const [anyWorkspace] = await db
        .select()
        .from(virtualWorkspaces)
        .where(eq(virtualWorkspaces.companyId, companyId))
        .limit(1);

      if (anyWorkspace) return anyWorkspace;

      // Create default
      const [created] = await db
        .insert(virtualWorkspaces)
        .values({
          companyId,
          name: "Main Virtual Office",
          slug: "main",
          description: "Primary 3D collaborative workspace for agents and team members.",
          layout: DEFAULT_WORKSPACE_LAYOUT,
          settings: { allowGuests: true },
          isDefault: true,
          status: "active",
        })
        .returning();

      return created;
    },

    async getWorkspacePresence(companyId: string, workspaceId: string) {
      return db
        .select()
        .from(virtualWorkspacePresence)
        .where(
          and(
            eq(virtualWorkspacePresence.companyId, companyId),
            eq(virtualWorkspacePresence.workspaceId, workspaceId)
          )
        )
        .orderBy(desc(virtualWorkspacePresence.lastSeenAt));
    },

    async upsertMemberPresence(
      companyId: string,
      workspaceId: string,
      input: UpdateMemberPresence
    ) {
      const now = new Date();

      const [existing] = await db
        .select()
        .from(virtualWorkspacePresence)
        .where(
          and(
            eq(virtualWorkspacePresence.workspaceId, workspaceId),
            eq(virtualWorkspacePresence.memberType, input.memberType),
            eq(virtualWorkspacePresence.memberId, input.memberId)
          )
        )
        .limit(1);

      if (existing) {
        const updateValues: Record<string, unknown> = {
          lastSeenAt: now,
          updatedAt: now,
        };

        if (input.name !== undefined) updateValues.name = input.name;
        if (input.role !== undefined) updateValues.role = input.role;
        if (input.status !== undefined) updateValues.status = input.status;
        if (input.position !== undefined) updateValues.position = input.position;
        if (input.avatarConfig !== undefined) updateValues.avatarConfig = input.avatarConfig;
        if (input.activeTask !== undefined) updateValues.activeTask = input.activeTask;
        if (input.currentSpeech !== undefined) updateValues.currentSpeech = input.currentSpeech;

        const [updated] = await db
          .update(virtualWorkspacePresence)
          .set(updateValues)
          .where(eq(virtualWorkspacePresence.id, existing.id))
          .returning();

        return updated;
      }

      const [created] = await db
        .insert(virtualWorkspacePresence)
        .values({
          workspaceId,
          companyId,
          memberType: input.memberType,
          memberId: input.memberId,
          name: input.name || `${input.memberType}_${input.memberId.slice(0, 8)}`,
          role: input.role || "member",
          status: input.status || "active",
          position: input.position || { x: 0, y: 0 },
          avatarConfig: input.avatarConfig || {},
          activeTask: input.activeTask || null,
          currentSpeech: input.currentSpeech || null,
          lastSeenAt: now,
        })
        .returning();

      return created;
    },

    async removeMemberPresence(
      companyId: string,
      workspaceId: string,
      memberType: string,
      memberId: string
    ) {
      const [removed] = await db
        .delete(virtualWorkspacePresence)
        .where(
          and(
            eq(virtualWorkspacePresence.companyId, companyId),
            eq(virtualWorkspacePresence.workspaceId, workspaceId),
            eq(virtualWorkspacePresence.memberType, memberType),
            eq(virtualWorkspacePresence.memberId, memberId)
          )
        )
        .returning();

      return removed ?? null;
    },

    async sweepStalePresence(companyId: string, workspaceId: string, timeoutMs = 60000) {
      const cutoff = new Date(Date.now() - timeoutMs);

      const stale = await db
        .update(virtualWorkspacePresence)
        .set({
          status: "offline",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(virtualWorkspacePresence.companyId, companyId),
            eq(virtualWorkspacePresence.workspaceId, workspaceId),
            lt(virtualWorkspacePresence.lastSeenAt, cutoff),
            ne(virtualWorkspacePresence.status, "offline")
          )
        )
        .returning();

      return stale;
    },
  };
}
