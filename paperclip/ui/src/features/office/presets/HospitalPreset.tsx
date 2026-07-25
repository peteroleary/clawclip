import React from "react";

export const HospitalPreset: React.FC = () => {
  return (
    <group>
      {/* Hospital Antimicrobial Linoleum Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#f0fdf4" roughness={0.3} />
      </mesh>
      <gridHelper args={[80, 80, "#22c55e", "#bbf7d0"]} position={[0, 0, 0]} />

      {/* Main Corridor Walls */}
      <mesh position={[0, 5, -30]}>
        <boxGeometry args={[80, 10, 0.5]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      {/* Triage / Emergency Nursing Stations */}
      <group position={[0, 0, -15]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[16, 1.4, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <boxGeometry args={[16.2, 0.1, 3.2]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </group>
    </group>
  );
};
