import type {
  VirtualWorkspaceDesk,
  VirtualWorkspaceLayout,
  VirtualWorkspacePresencePosition,
  VirtualWorkspaceZone,
  WorkspaceMemberType,
  WorkspacePresenceStatus,
} from "../validators/virtual-workspace.js";

export interface VirtualWorkspace {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  description?: string | null;
  layout: VirtualWorkspaceLayout;
  settings: Record<string, unknown>;
  isDefault: boolean;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface VirtualWorkspaceActiveTask {
  id: string;
  title: string;
  identifier: string;
}

export interface VirtualWorkspacePresence {
  id: string;
  workspaceId: string;
  companyId: string;
  memberType: WorkspaceMemberType;
  memberId: string;
  name: string;
  role: string;
  status: WorkspacePresenceStatus;
  position: VirtualWorkspacePresencePosition;
  avatarConfig: Record<string, unknown>;
  activeTask?: VirtualWorkspaceActiveTask | null;
  currentSpeech?: string | null;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualWorkspaceWSEvent {
  type:
    | "presence:state"
    | "presence:join"
    | "presence:leave"
    | "presence:update"
    | "workspace:updated";
  workspaceId: string;
  companyId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}
