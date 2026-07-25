import { create } from "zustand";
import { FacilityItem, initialFacilities } from "../features/office/screens/FacilitiesImmersiveScreen";

export const CLASSROOM_NODES: [number, number, number][] = [
  [-4, 0.75, -4], [-4, 0.75, -1], [-4, 0.75, 2], // Eng Desks (Offset from table centers)
  [4, 0.75, -4], [4, 0.75, -1], [4, 0.75, 2], // AI Desks (Offset from table centers)
  [-1.5, 0.75, -6.5], [1.5, 0.75, -6.5], // Standup area
  [-2, 0.75, 5.5], [2, 0.75, 5.5], // Lounge area
  [0, 0.75, -8], // Whiteboard presentation
];

export const OFFICE_NODES: [number, number, number][] = [
  [0, 0.5, -4.8], // Executive Chair
  [-0.8, 0.45, -2.8], [0.8, 0.45, -2.8], // Guest Chairs
  [-7.5, 0.45, 1], [-7.5, 0.45, 2], [-7.5, 0.45, 3], // Conf Left Chairs
  [-4.5, 0.45, 1], [-4.5, 0.45, 2], [-4.5, 0.45, 3], // Conf Right Chairs
  [4.5, 0.3, 4], [7.5, 0.3, 4], // Sofa seats
];

export const getNodesForFacility = (facility: FacilityItem | null): [number, number, number][] => {
  if (!facility) return CLASSROOM_NODES;
  if (facility.type === "Office") return OFFICE_NODES;
  if (facility.type === "Classroom") return CLASSROOM_NODES;

  // For all other presets, generate safe grid nodes based on dimensions
  const w = (facility.widthMeters || 20) * 0.35;
  const d = (facility.depthMeters || 15) * 0.35;
  return [
    [-w, 0.5, -d], [0, 0.5, -d], [w, 0.5, -d],
    [-w, 0.5, 0], [0, 0.5, 0], [w, 0.5, 0],
    [-w, 0.5, d], [0, 0.5, d], [w, 0.5, d],
  ];
};

export interface OfficeEntity {
  type: "project" | "human" | "agent" | "facility" | "task" | "goal";
  id: string;
}

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export interface LinkModalState {
  isOpen: boolean;
  sourceNodeId: string;
  sourceNodeType: string;
  sourceNodeName: string;
}

interface OfficeState {
  // UI Panels State
  activePanels: {
    top: boolean;
    bottom: string | null;
    left: string | null;
    right: string | null;
  };
  setPanelState: (panel: "top", isOpen: boolean) => void;
  setActiveDrawer: (side: "left" | "right" | "bottom", drawerId: string | null) => void;

  // Interlinked Navigation State
  focusedBoardId?: string;
  focusedChannelId?: string;
  openEntityBoard: (boardId: string) => void;
  openEntityChat: (channelId: string) => void;

  // Selection & 3D Sync State
  selectedEntity: OfficeEntity | null;
  setSelectedEntity: (entity: OfficeEntity | null) => void;

  cameraTarget: CameraTarget | null;
  setCameraTarget: (target: CameraTarget | null) => void;

  // Global Linking State
  linkModal: LinkModalState | null;
  openLinkModal: (id: string, type: string, name: string) => void;
  closeLinkModal: () => void;

  // Facilities
  activeFacility: FacilityItem | null;
  setActiveFacility: (facility: FacilityItem) => void;

  // Ambient Movement & State
  facilityWorkforceState: Record<string, Record<string, [number, number, number]>>;
  setMemberPosition: (facilityId: string, memberId: string, position: [number, number, number]) => void;
}

export const useOfficeStore = create<OfficeState>((set) => ({
  activePanels: {
    top: true,
    bottom: null,
    left: null,
    right: "hq",
  },
  setPanelState: (panel, isOpen) =>
    set((state) => ({
      activePanels: { ...state.activePanels, [panel]: isOpen },
    })),
  setActiveDrawer: (side, drawerId) =>
    set((state) => ({
      activePanels: { ...state.activePanels, [side]: drawerId },
    })),

  focusedBoardId: "master",
  focusedChannelId: "general",
  openEntityBoard: (boardId) =>
    set((state) => ({
      focusedBoardId: boardId,
      activePanels: { ...state.activePanels, bottom: "board" },
    })),
  openEntityChat: (channelId) =>
    set((state) => ({
      focusedChannelId: channelId,
      activePanels: { ...state.activePanels, bottom: "comms" },
    })),

  selectedEntity: null,
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  linkModal: null,
  openLinkModal: (id, type, name) => 
    set({ linkModal: { isOpen: true, sourceNodeId: id, sourceNodeType: type, sourceNodeName: name } }),
  closeLinkModal: () => 
    set({ linkModal: null }),

  activeFacility: initialFacilities.find(f => f.isCurrentOffice) || initialFacilities[0],
  setActiveFacility: (facility) => set({ activeFacility: facility }),

  facilityWorkforceState: {},
  setMemberPosition: (facilityId, memberId, position) =>
    set((state) => {
      const facilityState = state.facilityWorkforceState[facilityId] || {};
      return {
        facilityWorkforceState: {
          ...state.facilityWorkforceState,
          [facilityId]: {
            ...facilityState,
            [memberId]: position,
          },
        },
      };
    }),
}));
