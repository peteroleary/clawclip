import React from "react";

export const BoardroomPreset: React.FC = () => {
  return (
    <group>
      {/* Executive Carpet Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      <gridHelper args={[10, 10, "#38bdf8", "#0369a1"]} position={[0, 0, 0]} />

      {/* Glass Walls */}
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Conference Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[4.5, 0.1, 2.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.2} />
        </mesh>
        {/* Executive Chairs */}
        {[-1.5, 0, 1.5].map((x, idx) => (
          <React.Fragment key={idx}>
            <mesh position={[x, 0.45, -1.4]}>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[x, 0.45, 1.4]}>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    </group>
  );
};
