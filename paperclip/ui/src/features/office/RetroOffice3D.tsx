import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { OfficeEnvironment } from "./OfficeEnvironment.js";
import { WorkforceAvatar3D } from "./WorkforceAvatar3D.js";
import { AtmImmersiveScreen } from "./screens/AtmImmersiveScreen.js";
import { GithubImmersiveScreen } from "./screens/GithubImmersiveScreen.js";
import { StandupImmersiveScreen } from "./screens/StandupImmersiveScreen.js";
import { KanbanImmersiveScreen } from "./screens/KanbanImmersiveScreen.js";
import type { Workforce3DMember } from "./types.js";
import { MessageSquare, Volume2, Shield, Sparkles, Building2, Kanban } from "lucide-react";

interface RetroOffice3DProps {
  workforce: Workforce3DMember[];
  onSelectMember?: (member: Workforce3DMember) => void;
  selectedMemberId?: string | null;
  companyId?: string;
  initialKanbanCreateMode?: boolean;
}

export const RetroOffice3D: React.FC<RetroOffice3DProps> = ({
  workforce,
  onSelectMember,
  selectedMemberId,
  companyId,
  initialKanbanCreateMode = false,
}) => {
  const [selectedMember, setSelectedMember] = useState<Workforce3DMember | null>(null);
  const [atmOpen, setAtmOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [standupOpen, setStandupOpen] = useState(false);
  const [kanbanOpen, setKanbanOpen] = useState(false);
  const [kanbanCreateMode, setKanbanCreateMode] = useState(false);

  React.useEffect(() => {
    if (initialKanbanCreateMode) {
      setKanbanCreateMode(true);
      setKanbanOpen(true);
    }
  }, [initialKanbanCreateMode]);

  const handleSelect = (member: Workforce3DMember) => {
    setSelectedMember(member);
    onSelectMember?.(member);
  };

  const handleDeskClick = (deskId: string) => {
    if (deskId.includes("atm")) setAtmOpen(true);
    else if (deskId.includes("github") || deskId.includes("review")) setGithubOpen(true);
    else if (deskId.includes("standup")) setStandupOpen(true);
    else if (deskId.includes("kanban") || deskId.includes("board")) setKanbanOpen(true);
  };

  // Pre-calculated isometric 3D desk slots matching claw3d-hero.png
  const deskSlots: [number, number, number][] = [
    [-5, 0.75, -2],
    [-5, 0.75, 1],
    [-5, 0.75, 4],
    [5, 0.75, -2],
    [5, 0.75, 1],
    [5, 0.75, 4],
    [-1.5, 0.75, -6.5],
    [1.5, 0.75, -6.5],
    [-2, 0.75, 5.5],
    [2, 0.75, 5.5],
  ];

  const workingCount = workforce.filter((m) => m.status === "active" || m.status === "working").length;
  const idleCount = workforce.length - workingCount;

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#06090d] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Banner Header - LUKE HEADQUARTERS Style */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-[#0d131f]/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(217,119,6,0.15)]">
        <span className="font-mono text-sm font-bold text-amber-400 tracking-widest uppercase flex items-center gap-2">
          <span>🏢</span> COMPANY HEADQUARTERS
        </span>

        {/* Member Avatar Pill Chips */}
        <div className="hidden md:flex items-center space-x-2 border-l border-amber-500/20 pl-4">
          {workforce.slice(0, 6).map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs font-semibold hover:border-amber-400 transition"
            >
              <span className={`w-2 h-2 rounded-full ${m.status === "working" || m.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-slate-200">{m.name.split(" ")[0]}</span>
              <span className="text-[10px] text-slate-400">{m.type === "human" ? "👤" : "🤖"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Interactive Station Triggers */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-[#090d16]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={() => setAtmOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0d3034] hover:bg-[#15464c] border border-[#7dfff0]/30 text-[#7dfff0] rounded-lg text-xs font-bold transition"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>ATM Ledger</span>
        </button>

        <button
          onClick={() => setGithubOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>PR Review</span>
        </button>

        <button
          onClick={() => setStandupOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Standup Room</span>
        </button>

        <button
          onClick={() => setKanbanOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-bold transition"
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Task Board</span>
        </button>
      </div>

      {/* Selected Member Overlay HUD */}
      {selectedMember && (
        <div className="absolute bottom-16 right-4 z-20 bg-[#090d16]/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl w-80 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">
                {selectedMember.type === "human" ? "👤" : "🤖"}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{selectedMember.name}</h4>
                <p className="text-xs text-cyan-400 capitalize">
                  {selectedMember.type} • {selectedMember.title || selectedMember.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Department:</span>
              <span className="font-medium text-slate-100">{selectedMember.department}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedMember.status}
              </span>
            </div>
            {selectedMember.type === "human" ? (
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span className="font-bold text-amber-400">
                  ${((selectedMember.hourlyCostCents || 5000) / 100).toFixed(2)}/hr
                </span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>Monthly Budget:</span>
                <span className="font-bold text-amber-400">
                  ${((selectedMember.monthlyCostCents || 0) / 100).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Status Rail Matching claw3d-hero.png */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between bg-[#080d16]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONNECTED</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">{workingCount} working</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{idleCount} idle</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> quiet
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[11px] text-slate-500">
          <span>drag : scroll</span>
          <span>•</span>
          <span>space+drag</span>
          <span>•</span>
          <span>dbl-click</span>
        </div>
      </div>

      {/* Orthographic / Isometric 3D R3F Canvas */}
      <Canvas>
        {/* Isometric Orthographic Camera Matching claw3d-hero.png */}
        <OrthographicCamera
          makeDefault
          position={[15, 15, 15]}
          zoom={42}
          near={-50}
          far={200}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />

        {/* Isometric Office Lighting */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[20, 30, 10]} intensity={1.4} castShadow />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#fef3c7" />

        {/* Furniture, Flooring & Stations */}
        <OfficeEnvironment onDeskClick={handleDeskClick} />

        {/* Rendering Team Members with Dark Floating Nameplates */}
        {workforce.map((member, index) => {
          const pos = deskSlots[index % deskSlots.length];
          const isSelected = selectedMemberId === member.id || selectedMember?.id === member.id;
          return (
            <WorkforceAvatar3D
              key={member.id}
              member={member}
              position={pos}
              isSelected={isSelected}
              onSelect={handleSelect}
            />
          );
        })}
      </Canvas>

      {/* Interactive Immersive Station Modals */}
      <AtmImmersiveScreen isOpen={atmOpen} onClose={() => setAtmOpen(false)} />
      <GithubImmersiveScreen isOpen={githubOpen} onClose={() => setGithubOpen(false)} />
      <StandupImmersiveScreen isOpen={standupOpen} onClose={() => setStandupOpen(false)} />
      <KanbanImmersiveScreen
        isOpen={kanbanOpen}
        onClose={() => {
          setKanbanOpen(false);
          setKanbanCreateMode(false);
        }}
        companyId={companyId}
        initialCreateMode={kanbanCreateMode}
      />
    </div>
  );
};
