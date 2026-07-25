import React from "react";
import { SnakePlant, FernPlant } from "./DecorativePlants";

export const SalonPreset: React.FC = () => {
  const stations = [-4, -1, 2, 5];

  return (
    <group>
      {/* Chic Marble Tile Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
      </mesh>
      <gridHelper args={[14, 14, "#ec4899", "#cbd5e1"]} position={[0, 0, 0]} />

      {/* Salon Walls */}
      <mesh position={[0, 3, -5]}>
        <boxGeometry args={[14, 6, 0.4]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>

      {/* Styling Stations with Full-Length Mirrors */}
      {stations.map((x, idx) => (
        <group key={idx} position={[x, 0, -4.5]}>
          {/* Mirror */}
          <mesh position={[0, 1.8, 0.1]}>
            <boxGeometry args={[1.2, 2.0, 0.05]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.05} />
          </mesh>
          {/* Vanity Table */}
          <mesh position={[0, 0.7, 0.4]}>
            <boxGeometry args={[1.4, 0.1, 0.6]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Styling Chair */}
          <mesh position={[0, 0.45, 1.2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      ))}

      {/* Decorative Plants */}
      <FernPlant position={[-6, 0, -4]} />
      <SnakePlant position={[6, 0, 4]} />
    </group>
  );
};
