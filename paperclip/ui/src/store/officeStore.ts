import { create } from "zustand";

export interface OfficeEntity {
  type: "project" | "human" | "agent" | "facility" | "task" | "goal";
  id: string;
}

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

interface OfficeState {
  // UI Panels State
  activePanels: {
    top: boolean;
    bottom: string | null;
    left: string | null; // e.g. "projects", "facilities", "directory", "offers"
    right: string | null; // e.g. "hq", "chat", "marketplace", "orgchart"
  };
  setPanelState: (panel: "top", isOpen: boolean) => void;
  setActiveDrawer: (side: "left" | "right" | "bottom", drawerId: string | null) => void;

  // Selection & 3D Sync State
  selectedEntity: OfficeEntity | null;
  setSelectedEntity: (entity: OfficeEntity | null) => void;

  cameraTarget: CameraTarget | null;
  setCameraTarget: (target: CameraTarget | null) => void;
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

  selectedEntity: null,
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
