import React from "react";
import * as THREE from "three";

interface OfficeEnvironmentProps {
  onDeskClick?: (deskId: string) => void;
}

export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({ onDeskClick }) => {
  // Pre-configured office desks layout grid
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
      {/* Office Tile Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Floor Grid Lines */}
      <gridHelper args={[24, 24, "#475569", "#334155"]} position={[0, 0, 0]} />

      {/* Office Walls */}
      {/* Back Wall */}
      <mesh position={[0, 3, -10]}>
        <boxGeometry args={[24, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-12, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[12, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

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

        {/* Board Header Banner */}
        <mesh position={[0, 1.1, 0.06]}>
          <boxGeometry args={[4.8, 0.25, 0.02]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* Coffee & Jukebox Lounge Area */}
      <group position={[0, 0, 7]}>
        {/* Coffee Machine Counter */}
        <mesh position={[-2, 0.6, 0]}>
          <boxGeometry args={[1.5, 1.2, 0.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-2, 1.4, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.4]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Jukebox */}
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
          {/* Desk Surface */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[1.8, 0.1, 1.0]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>

          {/* Desk Legs */}
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

          {/* Monitor Screen */}
          <mesh position={[0, 1.15, -0.2]}>
            <boxGeometry args={[0.8, 0.5, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 1.15, -0.17]}>
            <planeGeometry args={[0.74, 0.44]} />
            <meshBasicMaterial color="#3b82f6" opacity={0.8} transparent />
          </mesh>
          {/* Monitor Stand */}
          <mesh position={[0, 0.85, -0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>

          {/* Office Chair */}
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
