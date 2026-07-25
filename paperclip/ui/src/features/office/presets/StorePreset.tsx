import React from "react";
import { FicusPlant, SnakePlant } from "./DecorativePlants";

export const StorePreset: React.FC = () => {
  return (
    <group>
      {/* Polished Retail Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, 0, 0]} />

      {/* Walls */}
      <mesh position={[0, 3, -7.5]}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 6, 0.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[15, 6, 0.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Checkout Counter */}
      <group position={[0, 0, 4]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[4, 1.2, 1.0]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[1.2, 1.3, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.4]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Retail Display Racks */}
      <group position={[-5, 0, -2]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[2, 2.0, 4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} />
        </mesh>
      </group>
      <group position={[5, 0, -2]}>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[2, 2.0, 4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <SnakePlant position={[-9, 0, -6.5]} />
      <FicusPlant position={[9, 0, -6.5]} />
    </group>
  );
};
