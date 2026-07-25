import React from "react";
import * as THREE from "three";
import { useOfficeStore } from "../../store/officeStore";

interface OfficeEnvironmentProps {
  onDeskClick?: (deskId: string) => void;
}

const ClassroomLayout: React.FC<{ onDeskClick?: (deskId: string) => void }> = ({ onDeskClick }) => {
  // Pre-configured office desks layout grid for Classroom
  const desks = [
    { id: "desk-1", pos: [-4, 0, -3] as [number, number, number], label: "Eng Desk 1" },
    { id: "desk-2", pos: [-4, 0, 0] as [number, number, number], label: "Eng Desk 2" },
    { id: "desk-3", pos: [-4, 0, 3] as [number, number, number], label: "Eng Desk 3" },
    { id: "desk-4", pos: [4, 0, -3] as [number, number, number], label: "AI Desk 1" },
    { id: "desk-5", pos: [4, 0, 0] as [number, number, number], label: "AI Desk 2" },
    { id: "desk-6", pos: [4, 0, 3] as [number, number, number], label: "AI Desk 3" },
  ];

  return (
    <group>
      {/* Zone Floor Markers */}
      {/* Human Open Office Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.005, 0]}>
        <planeGeometry args={[7, 12]} />
        <meshBasicMaterial color="#1e3a8a" opacity={0.3} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* AI Bot Swarm Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0.005, 0]}>
        <planeGeometry args={[7, 12]} />
        <meshBasicMaterial color="#0284c7" opacity={0.3} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Standup & Review Room Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -7]}>
        <planeGeometry args={[10, 5]} />
        <meshBasicMaterial color="#065f46" opacity={0.35} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Standup Room Whiteboard */}
      <group position={[0, 2, -9.7]}>
        <mesh>
          <boxGeometry args={[5, 2.5, 0.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0.06]}>
          <boxGeometry args={[4.8, 0.25, 0.02]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* Coffee & Jukebox Lounge Area */}
      <group position={[0, 0, 7]}>
        <mesh position={[-2, 0.6, 0]}>
          <boxGeometry args={[1.5, 1.2, 0.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-2, 1.4, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.4]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[2, 1, 0]}>
          <boxGeometry args={[1, 2, 0.8]} />
          <meshStandardMaterial color="#9333ea" metalness={0.7} />
        </mesh>
      </group>

      {/* Render Desks & Monitors */}
      {desks.map((desk) => (
        <group
          key={desk.id}
          position={desk.pos}
          onClick={(e) => {
            e.stopPropagation();
            onDeskClick?.(desk.id);
          }}
        >
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.8, 0.1, 1.0]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
          <mesh position={[-0.8, 0.35, -0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.8, 0.35, -0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[-0.8, 0.35, 0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.8, 0.35, 0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 1.15, -0.2]}>
            <boxGeometry args={[0.8, 0.5, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 1.15, -0.17]}>
            <planeGeometry args={[0.74, 0.44]} />
            <meshBasicMaterial color="#3b82f6" opacity={0.8} transparent />
          </mesh>
          <mesh position={[0, 0.85, -0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.45, 0.5]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.8, 0.7]}>
            <boxGeometry args={[0.5, 0.6, 0.1]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const OfficeLayout: React.FC<{ onDeskClick?: (deskId: string) => void }> = ({ onDeskClick }) => {
  return (
    <group>
      {/* Executive Desk Area */}
      <group position={[0, 0, -4]}>
        {/* Desk Zones */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshBasicMaterial color="#0f766e" opacity={0.2} transparent side={THREE.DoubleSide} />
        </mesh>
        
        {/* L-Shaped Executive Desk */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[2.8, 0.1, 1.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        <mesh position={[-1.0, 0.75, 0.8]}>
          <boxGeometry args={[0.8, 0.1, 1.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        {/* Base */}
        <mesh position={[-1.3, 0.375, 0]}>
          <boxGeometry args={[0.2, 0.75, 1.0]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[1.3, 0.375, 0]}>
          <boxGeometry args={[0.2, 0.75, 1.0]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Executive Chair */}
        <mesh position={[0, 0.5, -0.8]}>
          <boxGeometry args={[0.7, 0.15, 0.6]} />
          <meshStandardMaterial color="#171717" />
        </mesh>
        <mesh position={[0, 1.1, -1.0]}>
          <boxGeometry args={[0.7, 1.0, 0.15]} />
          <meshStandardMaterial color="#171717" />
        </mesh>

        {/* Guest Chairs */}
        <mesh position={[-0.8, 0.45, 1.2]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-0.8, 0.8, 1.4]}>
          <boxGeometry args={[0.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.8, 0.45, 1.2]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.8, 0.8, 1.4]}>
          <boxGeometry args={[0.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Mac/PC Monitor */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.0, 0.6, 0.05]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 1.2, 0.03]}>
          <planeGeometry args={[0.95, 0.55]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0, 0.9, -0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Conference Area */}
      <group position={[-6, 0, 2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[6, 8]} />
          <meshBasicMaterial color="#047857" opacity={0.2} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.5, 0.05, 4]} />
          <meshStandardMaterial color="#e2e8f0" opacity={0.6} transparent metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.7]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {[
          [-1.5, -1], [-1.5, 0], [-1.5, 1],
          [1.5, -1], [1.5, 0], [1.5, 1]
        ].map((pos, idx) => (
          <group key={idx} position={[pos[0], 0, pos[1]]} rotation={[0, pos[0] > 0 ? -Math.PI/2 : Math.PI/2, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.8, -0.2]}>
              <boxGeometry args={[0.5, 0.6, 0.1]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lounge Area */}
      <group position={[6, 0, 4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#be123c" opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sofa 1 */}
        <group position={[-1.5, 0, 0]} rotation={[0, Math.PI/2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[2.5, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Sofa 2 */}
        <group position={[1.5, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[2.5, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Coffee Table */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* Tall Bookshelf */}
      <group position={[11, 0, -5]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.6, 3, 3]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.31, 1.5, 0]}>
          <boxGeometry args={[0.02, 2.8, 2.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Potted Plants */}
      <group position={[-11, 0, -9]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.6]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>
      <group position={[11, 0, 9]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.6]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onDeskClick }) => {
  const activeFacility = useOfficeStore((state) => state.activeFacility);
  const widthMeters = activeFacility?.widthMeters || 24;
  const depthMeters = activeFacility?.depthMeters || 20;

  return (
    <group>
      {/* Office Tile Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[widthMeters, depthMeters]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Floor Grid Lines */}
      <gridHelper args={[Math.max(widthMeters, depthMeters), Math.max(widthMeters, depthMeters), "#475569", "#334155"]} position={[0, 0, 0]} />

      {/* Office Walls */}
      <mesh position={[0, 3, -depthMeters / 2]}>
        <boxGeometry args={[widthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-widthMeters / 2, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[widthMeters / 2, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {activeFacility?.type === "Classroom" && <ClassroomLayout onDeskClick={onDeskClick} />}
      {activeFacility?.type === "Office" && <OfficeLayout onDeskClick={onDeskClick} />}
    </group>
  );
};
