import React from "react";
import { FicusPlant, SnakePlant } from "./DecorativePlants";

export const ClinicPreset: React.FC = () => {
  return (
    <group>
      {/* Sterile Clinical Vinyl Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#ccfbf1" roughness={0.3} />
      </mesh>
      <gridHelper args={[22, 22, "#14b8a6", "#99f6e4"]} position={[0, 0, 0]} />

      {/* Walls */}
      <mesh position={[0, 3, -8]}>
        <boxGeometry args={[22, 6, 0.4]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      <mesh position={[-11, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16, 6, 0.4]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      <mesh position={[11, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16, 6, 0.4]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>

      {/* Examination Beds */}
      <group position={[-5, 0, -2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.5, 3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.8, -1.2]}>
          <boxGeometry args={[1.3, 0.15, 0.5]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>

      <group position={[5, 0, -2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.5, 3]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.8, -1.2]}>
          <boxGeometry args={[1.3, 0.15, 0.5]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <SnakePlant position={[-10, 0, -7]} />
      <FicusPlant position={[10, 0, -7]} />
    </group>
  );
};
