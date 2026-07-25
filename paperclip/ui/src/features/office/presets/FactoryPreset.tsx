import React from "react";

export const FactoryPreset: React.FC = () => {
  return (
    <group>
      {/* Factory Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* Basic walls for now */}
      <mesh position={[0, 4, -10]}>
        <boxGeometry args={[30, 8, 0.4]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
};
