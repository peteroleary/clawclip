import React from "react";
import { FernPlant, FicusPlant } from "./DecorativePlants";

export const HousePreset: React.FC = () => {
  return (
    <group>
      {/* Smart Home Oak Flooring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color="#a16207" roughness={0.5} />
      </mesh>
      <gridHelper args={[18, 18, "#ca8a04", "#d97706"]} position={[0, 0, 0]} />

      {/* Living Room Walls */}
      <mesh position={[0, 3, -7.5]}>
        <boxGeometry args={[18, 6, 0.4]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>

      {/* Living Room Sofa & TV Setup */}
      <group position={[0, 0, 2]}>
        {/* Sofa */}
        <mesh position={[0, 0.35, 2]}>
          <boxGeometry args={[4, 0.7, 1.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* TV Console */}
        <mesh position={[0, 0.4, -4]}>
          <boxGeometry args={[4.5, 0.8, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.4, -4]}>
          <boxGeometry args={[3.5, 1.2, 0.1]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <FernPlant position={[-8, 0, -6.5]} />
      <FicusPlant position={[8, 0, -6.5]} />
      <FicusPlant position={[-8, 0, 6.5]} />
    </group>
  );
};
