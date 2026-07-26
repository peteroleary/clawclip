import React from "react";
import {
  Users,
  Target,
  FolderKanban,
  Kanban,
  Calendar,
  Building2,
  Contact,
  Brain,
  Box,
  Wallet,
  MessageSquare,
  Compass,
  Github,
} from "lucide-react";
import { useOfficeStore } from "../../../store/officeStore.js";

interface BottomActionDockProps {
  onOpenExample?: () => void;
  onOpenTeam?: () => void;
  onOpenTargets?: () => void;
  onOpenProjects?: () => void;
  onOpenBoard?: () => void;
  onOpenScheduling?: () => void;
  onOpenFacilities?: () => void;
  onOpenDiscover?: () => void;
  onOpenDirectory?: () => void;
  onOpenMemory?: () => void;
  onOpenArtifacts?: () => void;
  onOpenWallet?: () => void;
  onOpenComms?: () => void;
}

export const BottomActionDock: React.FC<BottomActionDockProps> = ({
  onOpenExample,
  onOpenTeam,
  onOpenTargets,
  onOpenProjects,
  onOpenBoard,
  onOpenScheduling,
  onOpenFacilities,
  onOpenDiscover,
  onOpenDirectory,
  onOpenMemory,
  onOpenArtifacts,
  onOpenWallet,
  onOpenComms,
}) => {
  const activeItem = useOfficeStore((state) => state.activePanels.bottom);

  // Example at start (left of Team), Wallet and Chat (Comms) at the right end
  const mainDockItems = [
    { id: "example", label: "Example", icon: Github, action: onOpenExample, color: "text-slate-400 hover:bg-slate-950/40 border-slate-500/30" },
    { id: "team", label: "Team", icon: Users, action: onOpenTeam, color: "text-purple-400 hover:bg-purple-950/40 border-purple-500/30" },
    { id: "targets", label: "Targets", icon: Target, action: onOpenTargets, color: "text-rose-400 hover:bg-rose-950/40 border-rose-500/30" },
    { id: "projects", label: "Projects", icon: FolderKanban, action: onOpenProjects, color: "text-blue-400 hover:bg-blue-950/40 border-blue-500/30" },
    { id: "board", label: "Board", icon: Kanban, action: onOpenBoard, color: "text-cyan-400 hover:bg-cyan-950/40 border-cyan-500/30" },
    { id: "scheduling", label: "Scheduling", icon: Calendar, action: onOpenScheduling, color: "text-emerald-400 hover:bg-emerald-950/40 border-emerald-500/30" },
    { id: "facilities", label: "Facilities", icon: Building2, action: onOpenFacilities, color: "text-amber-400 hover:bg-amber-950/40 border-amber-500/30" },
    { id: "discover", label: "Discover", icon: Compass, action: onOpenDiscover, color: "text-orange-400 hover:bg-orange-950/40 border-orange-500/30" },
    { id: "directory", label: "Directory", icon: Contact, action: onOpenDirectory, color: "text-teal-400 hover:bg-teal-950/40 border-teal-500/30" },
    { id: "memory", label: "Memory", icon: Brain, action: onOpenMemory, color: "text-pink-400 hover:bg-pink-950/40 border-pink-500/30" },
    { id: "artifacts", label: "Artifacts", icon: Box, action: onOpenArtifacts, color: "text-indigo-400 hover:bg-indigo-950/40 border-indigo-500/30" },
    { id: "wallet", label: "Wallet", icon: Wallet, action: onOpenWallet, color: "text-amber-400 hover:bg-amber-950/40 border-amber-500/30" },
    { id: "comms", label: "Chat", icon: MessageSquare, action: onOpenComms, color: "text-cyan-400 hover:bg-cyan-950/40 border-cyan-500/30" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 select-none flex items-center">
      {/* Main Floating Dock Bar */}
      <div className="flex items-center space-x-1 bg-[#06090d]/90 backdrop-blur-xl border border-slate-800/80 p-2 rounded-2xl shadow-2xl shadow-cyan-950/40">
        {mainDockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all hover:scale-105 active:scale-95 group relative ${
                isActive
                  ? "bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white font-bold"
                  : `border-transparent ${item.color}`
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-wide uppercase">{item.label}</span>

              {/* Hover label preview */}
              <span className="absolute -top-9 bg-slate-900 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
