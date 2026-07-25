import React from "react";
import { FicusPlant, SnakePlant } from "./DecorativePlants";

export const ShowroomPreset: React.FC = () => {
  return (
    <group>
      {/* High-Gloss Epoxy Showroom Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.1} />
      </mesh>
      <gridHelper args={[30, 30, "#cbd5e1", "#f1f5f9"]} position={[0, 0, 0]} />

      {/* Glass & Chrome Walls */}
      <mesh position={[0, 4, -11]}>
        <boxGeometry args={[30, 8, 0.4]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Display Turntables */}
      <group position={[-7, 0, -2]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[4, 4.2, 0.3, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
      <group position={[7, 0, -2]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[4, 4.2, 0.3, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <SnakePlant position={[-14, 0, -10]} />
      <FicusPlant position={[14, 0, -10]} />
      <FicusPlant position={[-14, 0, 10]} />
      <SnakePlant position={[14, 0, 10]} />
    </group>
  );
};
