import React from "react";

export const MotelPreset: React.FC = () => {
  return (
    <group>
      {/* Retro Linoleum Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 25]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.7} />
      </mesh>
      <gridHelper args={[40, 40, "#a16207", "#eab308"]} position={[0, 0, 0]} />

      {/* Exterior Corridor Walls */}
      <mesh position={[0, 3, -12.5]}>
        <boxGeometry args={[40, 6, 0.4]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>

      {/* Front Desk Office */}
      <group position={[-10, 0, -5]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[5, 1.2, 1.2]} />
          <meshStandardMaterial color="#713f12" />
        </mesh>
      </group>
    </group>
  );
};
