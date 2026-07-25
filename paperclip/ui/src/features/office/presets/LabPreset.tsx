import React from "react";
import * as THREE from "three";

export const LabPreset: React.FC = () => {
  return (
    <group>
      {/* High-Tech Lab Epoxy Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Grid Helper */}
      <gridHelper args={[18, 18, "#38bdf8", "#1e293b"]} position={[0, 0, 0]} />

      {/* Lab Perimeter Walls */}
      <mesh position={[0, 3, -7]}>
        <boxGeometry args={[18, 6, 0.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
      <mesh position={[-9, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[14, 6, 0.4]} />
        <meshStandardMaterial color="#0369a1" roughness={0.3} />
      </mesh>
      <mesh position={[9, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[14, 6, 0.4]} />
        <meshStandardMaterial color="#0369a1" roughness={0.3} />
      </mesh>

      {/* Central Supercomputer Containment */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[2, 2, 3, 16]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1.2, 2.5, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Lab Workbenches */}
      <group position={[-5, 0, 2]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[4, 0.1, 1.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        {/* Microscopes & Monitors */}
        <mesh position={[-1, 1.0, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.5]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      <group position={[5, 0, 2]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[4, 0.1, 1.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh position={[1, 1.1, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.1]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};
