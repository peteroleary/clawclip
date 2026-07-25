import React from "react";

export const HotelPreset: React.FC = () => {
  return (
    <group>
      {/* Luxury Hotel Lobby Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 35]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.15} metalness={0.2} />
      </mesh>
      <gridHelper args={[50, 50, "#d97706", "#fde68a"]} position={[0, 0, 0]} />

      {/* Grand Lobby Walls */}
      <mesh position={[0, 5, -17.5]}>
        <boxGeometry args={[50, 10, 0.5]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Reception Concierge Desk */}
      <group position={[0, 0, -10]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[12, 1.4, 1.5]} />
          <meshStandardMaterial color="#451a03" metalness={0.4} />
        </mesh>
        {/* Brass Accents */}
        <mesh position={[0, 1.45, 0]}>
          <boxGeometry args={[12.2, 0.1, 1.6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Plush Grand Seating Lounge */}
      <group position={[-12, 0, 5]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[4, 0.4, 4]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
      </group>
      <group position={[12, 0, 5]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[4, 0.4, 4]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
      </group>
    </group>
  );
};
