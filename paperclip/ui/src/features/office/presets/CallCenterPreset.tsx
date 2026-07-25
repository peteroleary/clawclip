import React from "react";
import { FicusPlant, FernPlant } from "./DecorativePlants";

export const CallCenterPreset: React.FC = () => {
  // Dense cubicle grid
  const cubicles = [
    [-8, -5], [-4, -5], [0, -5], [4, -5], [8, -5],
    [-8, 0], [-4, 0], [0, 0], [4, 0], [8, 0],
    [-8, 5], [-4, 5], [0, 5], [4, 5], [8, 5],
  ];

  return (
    <group>
      {/* Carpet Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[35, 25]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
      </mesh>
      <gridHelper args={[35, 35, "#4338ca", "#312e81"]} position={[0, 0, 0]} />

      {/* Acoustic Enclosure Walls */}
      <mesh position={[0, 3, -12.5]}>
        <boxGeometry args={[35, 6, 0.4]} />
        <meshStandardMaterial color="#312e81" />
      </mesh>
      <mesh position={[-17.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[25, 6, 0.4]} />
        <meshStandardMaterial color="#312e81" />
      </mesh>
      <mesh position={[17.5, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[25, 6, 0.4]} />
        <meshStandardMaterial color="#312e81" />
      </mesh>

      {/* Render Dense Cubicles */}
      {cubicles.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Desk */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[2.5, 0.1, 1.4]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          {/* Acoustic Dividers */}
          <mesh position={[-1.25, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.8, 1.4]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>
          <mesh position={[1.25, 1.1, 0]}>
            <boxGeometry args={[0.08, 0.8, 1.4]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>
          <mesh position={[0, 1.1, -0.7]}>
            <boxGeometry args={[2.5, 0.8, 0.08]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>
          {/* Dual Monitors & Headset Station */}
          <mesh position={[-0.4, 1.1, -0.4]}>
            <boxGeometry args={[0.7, 0.4, 0.05]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0.4, 1.1, -0.4]}>
            <boxGeometry args={[0.7, 0.4, 0.05]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
        </group>
      ))}

      {/* Decorative Plants */}
      <FicusPlant position={[-16, 0, -11]} />
      <FernPlant position={[16, 0, -11]} />
      <FicusPlant position={[-16, 0, 11]} />
      <FernPlant position={[16, 0, 11]} />
    </group>
  );
};
