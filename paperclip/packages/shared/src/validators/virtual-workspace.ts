import { z } from "zod";

export const workspaceMemberTypeSchema = z.enum(["agent", "human"]);
export type WorkspaceMemberType = z.infer<typeof workspaceMemberTypeSchema>;

export const workspacePresenceStatusSchema = z.enum([
  "active",
  "working",
  "idle",
  "in_meeting",
  "offline",
  "on_break",
]);
export type WorkspacePresenceStatus = z.infer<typeof workspacePresenceStatusSchema>;

export const virtualWorkspaceZoneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1),
  bounds: z.object({
    minX: z.number(),
    maxX: z.number(),
    minZ: z.number(),
    maxZ: z.number(),
  }),
});
export type VirtualWorkspaceZone = z.infer<typeof virtualWorkspaceZoneSchema>;

export const virtualWorkspaceDeskSchema = z.object({
  id: z.string().min(1),
  x: z.number(),
  z: z.number(),
  rotation: z.number().default(0),
  assignedMemberId: z.string().nullable().optional(),
  zone: z.string().min(1),
});
export type VirtualWorkspaceDesk = z.infer<typeof virtualWorkspaceDeskSchema>;

export const virtualWorkspaceLayoutSchema = z.object({
  width: z.number().default(30),
  height: z.number().default(20),
  zones: z.array(virtualWorkspaceZoneSchema).default([]),
  desks: z.array(virtualWorkspaceDeskSchema).default([]),
  floorType: z.string().optional(),
  theme: z.string().optional(),
});
export type VirtualWorkspaceLayout = z.infer<typeof virtualWorkspaceLayoutSchema>;

export const createVirtualWorkspaceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  layout: virtualWorkspaceLayoutSchema.optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  isDefault: z.boolean().optional().default(false),
});
export type CreateVirtualWorkspace = z.infer<typeof createVirtualWorkspaceSchema>;

export const updateVirtualWorkspaceSchema = createVirtualWorkspaceSchema.partial().extend({
  status: z.enum(["active", "archived"]).optional(),
});
export type UpdateVirtualWorkspace = z.infer<typeof updateVirtualWorkspaceSchema>;

export const virtualWorkspacePresencePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
  floor: z.number().optional(),
  zone: z.string().optional(),
  deskId: z.string().nullable().optional(),
  rotation: z.number().optional(),
});
export type VirtualWorkspacePresencePosition = z.infer<typeof virtualWorkspacePresencePositionSchema>;

export const updateMemberPresenceSchema = z.object({
  memberType: workspaceMemberTypeSchema,
  memberId: z.string().min(1),
  name: z.string().optional(),
  role: z.string().optional(),
  status: workspacePresenceStatusSchema.optional(),
  position: virtualWorkspacePresencePositionSchema.optional(),
  avatarConfig: z.record(z.string(), z.unknown()).optional(),
  activeTask: z
    .object({
      id: z.string(),
      title: z.string(),
      identifier: z.string(),
    })
    .nullable()
    .optional(),
  currentSpeech: z.string().nullable().optional(),
});
export type UpdateMemberPresence = z.infer<typeof updateMemberPresenceSchema>;
