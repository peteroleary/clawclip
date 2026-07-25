import React, { useState } from "react";
import { FolderOpen, Building, Contact, Tag, Plus, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";

interface LeftBusinessDrawerProps {
  onOpenProjects: () => void;
  onOpenFacilities: () => void;
  onOpenDirectory: () => void;
  onOpenOffers: () => void;
  onOpenCreateBusiness: () => void;
}

export const LeftBusinessDrawer: React.FC<LeftBusinessDrawerProps> = ({
  onOpenProjects,
  onOpenFacilities,
  onOpenDirectory,
  onOpenOffers,
  onOpenCreateBusiness,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const businessItems = [
    { id: "projects", label: "Projects", icon: FolderOpen, action: onOpenProjects, desc: "Active workspace initiatives" },
    { id: "facilities", label: "Facilities", icon: Building, action: onOpenFacilities, desc: "Physical & virtual office spaces" },
    { id: "directory", label: "Directory", icon: Contact, action: onOpenDirectory, desc: "Contacts, vendors & suppliers" },
    { id: "offers", label: "Offers", icon: Tag, action: onOpenOffers, desc: "Products & services catalog" },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-20 z-30 flex items-start select-none">
      {/* Floating Left Bar */}
      <div className="flex flex-col h-full bg-[#06090d]/95 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl transition-all duration-200">
        {/* Header Toggle */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          {expanded && (
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💼</span> Business
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition"
          >
            {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Button: Create New Business Entity */}
        <div className="p-2 border-b border-slate-800">
          <button
            onClick={onOpenCreateBusiness}
            className={`w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition ${
              !expanded ? "px-2" : "px-3"
            }`}
            title="Create Business Entity"
          >
            <Plus className="w-4 h-4" />
            {expanded && <span>Create Entity</span>}
          </button>
        </div>

        {/* Business Nav Items */}
        <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
          {businessItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  item.action();
                }}
                className={`w-full p-2.5 rounded-xl border border-transparent text-left flex items-center space-x-3 transition group ${
                  activeItem === item.id
                    ? "bg-cyan-950/60 border-cyan-500/40 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400 shrink-0" />
                {expanded && (
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
