import React from "react";

export const StudioPreset: React.FC = () => {
  return (
    <group>
      {/* Matte Black Soundstage Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      <gridHelper args={[16, 16, "#38bdf8", "#1e293b"]} position={[0, 0, 0]} />

      {/* Soundproofing Walls */}
      <mesh position={[0, 3, -7]}>
        <boxGeometry args={[16, 6, 0.4]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Broadcast Anchor Desk */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[2.2, 2.5, 1.2, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
      </group>

      {/* Studio Lighting Rigs & Cameras */}
      <group position={[-4, 0, 3]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.8]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.3, 0.8]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </group>
      <group position={[4, 0, 3]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.8]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.3, 0.8]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </group>
    </group>
  );
};
