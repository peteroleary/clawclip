import React from "react";
import { Building2, Cpu, Coffee, ShieldAlert, Sparkles } from "lucide-react";

interface OfficeFloorNavProps {
  activeZone: string;
  onZoneChange: (zone: string) => void;
}

export const OfficeFloorNav: React.FC<OfficeFloorNavProps> = ({
  activeZone,
  onZoneChange,
}) => {
  const zones = [
    { id: "main", label: "Main Open Office", icon: Building2 },
    { id: "ai_swarm", label: "AI Swarm Wing", icon: Cpu },
    { id: "lounge", label: "Coffee & Jukebox Lounge", icon: Coffee },
    { id: "standup", label: "Standup & Review Room", icon: Sparkles },
  ];

  return (
    <div className="flex items-center space-x-1.5 bg-[#090d16]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
      {zones.map((zone) => {
        const Icon = zone.icon;
        const isActive = activeZone === zone.id;
        return (
          <button
            key={zone.id}
            onClick={() => onZoneChange(zone.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isActive
                ? "bg-cyan-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{zone.label}</span>
          </button>
        );
      })}
    </div>
  );
};
