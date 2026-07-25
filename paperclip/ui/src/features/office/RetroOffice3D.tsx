import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Html } from "@react-three/drei";
import { OfficeEnvironment } from "./OfficeEnvironment.js";
import { WorkforceAvatar3D } from "./WorkforceAvatar3D.js";
import { AtmImmersiveScreen } from "./screens/AtmImmersiveScreen.js";
import { GithubImmersiveScreen } from "./screens/GithubImmersiveScreen.js";
import { StandupImmersiveScreen } from "./screens/StandupImmersiveScreen.js";
import { KanbanImmersiveScreen } from "./screens/KanbanImmersiveScreen.js";
import type { Workforce3DMember } from "./types.js";
import { MessageSquare, Volume2, Shield, Sparkles, Building2, Kanban } from "lucide-react";
import { useOfficeStore } from "../../store/officeStore.js";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CameraController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const cameraTarget = useOfficeStore((state) => state.cameraTarget);
  useFrame((state: any) => {
    if (cameraTarget && controlsRef.current) {
      const targetVec = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
      controlsRef.current.target.lerp(targetVec, 0.05);
      state.camera.position.lerp(
        new THREE.Vector3(cameraTarget.x + 15, cameraTarget.y + 15, cameraTarget.z + 15),
        0.05
      );
      controlsRef.current.update();
    }
  });
  return null;
}

function HolographicOverlay({ member, onClose }: { member: Workforce3DMember, onClose: () => void }) {
  if (!member.deskPosition) return null;
  const x = member.deskPosition.x;
  const z = member.deskPosition.zone === "Human Wing" ? -2 : 4; // Approx based on desk slot logic
  
  return (
    <Html
      position={[x, 3, z]}
      center
      className="pointer-events-auto"
    >
      <div className="bg-[#090d16]/95 backdrop-blur-xl p-4 rounded-2xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] w-80 text-slate-100 transform transition-all">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">
              {member.type === "human" ? "👤" : "🤖"}
            </span>
            <div>
              <h4 className="font-bold text-sm text-slate-100">{member.name}</h4>
              <p className="text-xs text-cyan-400 capitalize">
                {member.type} • {member.title || member.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Department:</span>
            <span className="font-medium text-slate-100">{member.department}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {member.status}
            </span>
          </div>
        </div>
      </div>
    </Html>
  );
}

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
  const selectedEntity = useOfficeStore((state) => state.selectedEntity);
  const setSelectedEntity = useOfficeStore((state) => state.setSelectedEntity);
  const setActiveDrawer = useOfficeStore((state) => state.setActiveDrawer);
  const setCameraTarget = useOfficeStore((state) => state.setCameraTarget);

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
    setSelectedEntity({ type: member.type === "human" ? "human" : "agent", id: member.id });
    if (member.deskPosition) {
      setCameraTarget({ x: member.deskPosition.x, y: 1.5, z: member.deskPosition.y });
    }
    setActiveDrawer("right", "chat");
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

  const activeMember = workforce.find((m) => m.id === selectedEntity?.id);
  const controlsRef = React.useRef<any>(null);

  const workingCount = workforce.filter((m) => m.status === "active" || m.status === "working").length;
  const idleCount = workforce.length - workingCount;

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#06090d] text-slate-100 overflow-hidden font-sans select-none">
      {/* Orthographic / Isometric 3D R3F Canvas */}
      <Canvas>
        <CameraController controlsRef={controlsRef} />
        {/* Isometric Orthographic Camera Matching claw3d-hero.png */}
        <OrthographicCamera
          makeDefault
          position={[15, 15, 15]}
          zoom={42}
          near={-50}
          far={200}
        />
        <OrbitControls
          ref={controlsRef}
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

        {/* Holographic Overlay for Selected Member */}
        {activeMember && (
          <HolographicOverlay member={activeMember} onClose={() => setSelectedEntity(null)} />
        )}

        {/* Rendering Team Members with Dark Floating Nameplates */}
        {workforce.map((member, index) => {
          const pos = deskSlots[index % deskSlots.length];
          const isSelected = selectedMemberId === member.id || selectedEntity?.id === member.id;
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
