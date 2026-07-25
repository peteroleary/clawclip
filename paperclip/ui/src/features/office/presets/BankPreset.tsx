import React from "react";
import * as THREE from "three";
import { FicusPlant, SnakePlant, FernPlant } from "./DecorativePlants";

export const BankPreset: React.FC = () => {
  return (
    <group>
      {/* High-End Bank Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
      </mesh>
      <gridHelper args={[22, 22, "#94a3b8", "#cbd5e1"]} position={[0, 0, 0]} />

      {/* Exterior Walls */}
      <mesh position={[0, 3, -8]}>
        <boxGeometry args={[22, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-11, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[11, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Security Vault (Back Left) */}
      <group position={[-6, 0, -5]}>
        {/* Vault Walls */}
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[6, 6, 5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Vault Door (Massive Steel) */}
        <mesh position={[0, 2, 2.6]}>
          <cylinderGeometry args={[1.5, 1.5, 0.4, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#cbd5e1" metalness={1.0} roughness={0.1} />
        </mesh>
        {/* Locking Mechanism details on door */}
        <mesh position={[0, 2, 2.85]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} />
        </mesh>
      </group>

      {/* Teller Counters (Back Right) */}
      <group position={[5, 0, -4]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[10, 1.4, 1.5]} />
          <meshStandardMaterial color="#334155" metalness={0.3} />
        </mesh>
        {/* Glass Partitions */}
        <mesh position={[0, 1.9, 0.6]}>
          <boxGeometry args={[10, 1.0, 0.1]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Teller Stations */}
        {[-3.5, 0, 3.5].map((x, idx) => (
          <group key={idx} position={[x, 1.1, 0]}>
            {/* Monitor */}
            <mesh position={[0, 0, -0.4]}>
              <boxGeometry args={[0.8, 0.6, 0.1]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Opening in Glass */}
            <mesh position={[0, 0.3, 0.6]}>
              <boxGeometry args={[0.8, 0.2, 0.12]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Manager's Office (Front Left) */}
      <group position={[-6, 0, 3]}>
        {/* Glass Walls */}
        <mesh position={[0, 2.5, 3]}>
          <boxGeometry args={[8, 5, 0.1]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[4, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[6, 5, 0.1]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
        </mesh>
        
        {/* Manager Desk */}
        <mesh position={[0, 0.7, -1]}>
          <boxGeometry args={[2.5, 0.1, 1.2]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Executive Chair */}
        <mesh position={[0, 0.5, -2]}>
          <boxGeometry args={[0.7, 1.2, 0.6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Guest Chairs */}
        <mesh position={[-0.8, 0.45, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.8, 0.45, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Waiting Area (Front Right) */}
      <group position={[5, 0, 3]}>
        {/* Area Rug */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>

        {/* Sofas */}
        <group position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[3, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[3, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
        <group position={[2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[3, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[3, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
        
        {/* Coffee Table */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.1, 2.5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <FicusPlant position={[-10, 0, -7]} />
      <FicusPlant position={[10, 0, -7]} />
      <FernPlant position={[-10, 0, 7]} />
      <SnakePlant position={[10, 0, 7]} />
    </group>
  );
};
