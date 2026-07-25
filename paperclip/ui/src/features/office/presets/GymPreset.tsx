import React from "react";

export const GymPreset: React.FC = () => {
  const machines = [-8, -4, 0, 4, 8];

  return (
    <group>
      {/* Rubber Gym Mat Flooring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[28, 20]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>
      <gridHelper args={[28, 28, "#e11d48", "#27272a"]} position={[0, 0, 0]} />

      {/* Gym Walls */}
      <mesh position={[0, 4, -10]}>
        <boxGeometry args={[28, 8, 0.4]} />
        <meshStandardMaterial color="#09090b" />
      </mesh>

      {/* Treadmills & Power Racks */}
      {machines.map((x, idx) => (
        <group key={idx} position={[x, 0, -3]}>
          {/* Treadmill */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.2, 0.3, 2.5]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.8, -1.0]}>
            <boxGeometry args={[1.0, 1.2, 0.1]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
