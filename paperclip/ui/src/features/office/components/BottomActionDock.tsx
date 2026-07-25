import React, { useState } from "react";
import { Target, Kanban, Plus, Calendar, Repeat, X, Sparkles } from "lucide-react";

interface BottomActionDockProps {
  onOpenGoals: () => void;
  onOpenBoard: () => void;
  onOpenTimeline: () => void;
  onOpenRoutines: () => void;
  onOpenCreateMenu: () => void;
}

export const BottomActionDock: React.FC<BottomActionDockProps> = ({
  onOpenGoals,
  onOpenBoard,
  onOpenTimeline,
  onOpenRoutines,
  onOpenCreateMenu,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const dockItems = [
    { id: "goals", label: "Goals", icon: Target, action: onOpenGoals, color: "text-amber-400 hover:bg-amber-950/40 border-amber-500/30" },
    { id: "board", label: "Board", icon: Kanban, action: onOpenBoard, color: "text-cyan-400 hover:bg-cyan-950/40 border-cyan-500/30" },
    { id: "create", label: "Create", icon: Plus, action: onOpenCreateMenu, isCreate: true },
    { id: "timeline", label: "Timeline", icon: Calendar, action: onOpenTimeline, color: "text-blue-400 hover:bg-blue-950/40 border-blue-500/30" },
    { id: "routines", label: "Routines", icon: Repeat, action: onOpenRoutines, color: "text-emerald-400 hover:bg-emerald-950/40 border-emerald-500/30" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="flex items-center space-x-3 bg-[#06090d]/90 backdrop-blur-xl border border-slate-800/80 p-2.5 rounded-2xl shadow-2xl shadow-cyan-950/40">
        {dockItems.map((item) => {
          const Icon = item.icon;
          if (item.isCreate) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white flex items-center justify-center shadow-lg shadow-cyan-900/50 border border-cyan-300/40 transition-all hover:scale-110 active:scale-95 group relative"
                title="Create New Entity (+)"
              >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                <span className="absolute -top-9 bg-slate-900 border border-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition">
                  New Entity
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                item.action();
              }}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border border-transparent transition-all hover:scale-105 active:scale-95 group relative ${item.color}`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold tracking-wide uppercase">{item.label}</span>

              {/* Hover label preview */}
              <span className="absolute -top-9 bg-slate-900 border border-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {item.label} View
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
