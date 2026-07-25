export type WorkforceType = "agent" | "human";

export interface Workforce3DMember {
  id: string;
  type: WorkforceType;
  name: string;
  role: string;
  title: string;
  department: string;
  status: string; // 'active' | 'working' | 'idle' | 'in_meeting' | 'offline' | 'on_break'
  reportsTo?: string | null;
  hourlyCostCents?: number;
  monthlyCostCents?: number;
  annualSalary?: number;
  monthlyCost?: number;
  workingHours?: { start: string; end: string; timezone: string };
  skills: string[];
  deskPosition: {
    x: number;
    y: number;
    floor?: number;
    zone?: string;
  };
  avatarConfig: {
    spriteId?: string;
    primaryColor?: string;
    hairStyle?: string;
    hairColor?: string;
    outfitColor?: string;
    skinTone?: string;
    accessory?: string;
  };
  activeTask?: {
    id: string;
    title: string;
    identifier: string;
  } | null;
  currentSpeech?: string | null;
}

export interface DeskLayout {
  id: string;
  x: number;
  z: number;
  rotation: number;
  assignedMemberId?: string | null;
  zone: string;
}

export interface OfficeZone {
  id: string;
  name: string;
  color: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}
