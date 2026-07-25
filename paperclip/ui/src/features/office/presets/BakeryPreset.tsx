import React from "react";

export const BakeryPreset: React.FC = () => {
  return (
    <group>
      {/* Bakery Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.8} />
      </mesh>

      {/* Basic walls for now */}
      <mesh position={[0, 3, -7.5]}>
        <boxGeometry args={[15, 6, 0.4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
};
