import React from "react";

export const ShopPreset: React.FC = () => {
  return (
    <group>
      {/* Workshop Concrete Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[15, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <gridHelper args={[15, 15, "#94a3b8", "#64748b"]} position={[0, 0, 0]} />

      {/* Industrial Walls */}
      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[15, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-7.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[7.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Heavy Duty Tool Benches */}
      <group position={[-3, 0, -2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[4, 1.0, 1.5]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
        {/* Pegboard Tool Rack */}
        <mesh position={[0, 1.8, -0.7]}>
          <boxGeometry args={[3.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      <group position={[3, 0, -2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[4, 1.0, 1.5]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
