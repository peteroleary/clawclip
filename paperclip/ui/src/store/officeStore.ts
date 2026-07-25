import { create } from "zustand";
import { FacilityItem, initialFacilities } from "../features/office/screens/FacilitiesImmersiveScreen";

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
}));
