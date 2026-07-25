import React from "react";

export const TheatrePreset: React.FC = () => {
  const rows = [-5, -2, 1, 4, 7];

  return (
    <group>
      {/* Dark Auditorium Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[45, 30]} />
        <meshStandardMaterial color="#09090b" roughness={0.9} />
      </mesh>

      {/* Auditorium Walls */}
      <mesh position={[0, 5, -15]}>
        <boxGeometry args={[45, 10, 0.5]} />
        <meshStandardMaterial color="#450a0a" />
      </mesh>

      {/* Raised Stage */}
      <group position={[0, 0, -10]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[30, 1.0, 8]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Red Stage Curtains */}
        <mesh position={[-14, 3.5, 0]}>
          <boxGeometry args={[2, 6, 8.2]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
        <mesh position={[14, 3.5, 0]}>
          <boxGeometry args={[2, 6, 8.2]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
      </group>

      {/* Plush Red Auditorium Seating Rows */}
      {rows.map((z, idx) => (
        <group key={idx} position={[0, idx * 0.25, z]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[26, 0.4, 0.8]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
