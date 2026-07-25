import React from "react";
import * as THREE from "three";
import { FicusPlant, SnakePlant, FernPlant } from "./DecorativePlants";
import { useOfficeStore } from "../../../store/officeStore";

interface OfficePresetProps {
  onDeskClick?: (deskId: string) => void;
}

export const OfficePreset: React.FC<OfficePresetProps> = ({ onDeskClick }) => {
  const activeFacility = useOfficeStore((state) => state.activeFacility);
  // Default to 24x20 if metadata is missing, but office uses metadata
  const widthMeters = activeFacility?.widthMeters || 24;
  const depthMeters = activeFacility?.depthMeters || 20;

  return (
    <group>
      {/* Office Tile Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[widthMeters, depthMeters]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Floor Grid Lines */}
      <gridHelper args={[Math.max(widthMeters, depthMeters), Math.max(widthMeters, depthMeters), "#475569", "#334155"]} position={[0, 0, 0]} />

      {/* Office Walls */}
      <mesh position={[0, 3, -depthMeters / 2]}>
        <boxGeometry args={[widthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-widthMeters / 2, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[widthMeters / 2, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[depthMeters, 6, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Executive Desk Area */}
      <group position={[0, 0, -4]}>
        {/* Desk Zones */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshBasicMaterial color="#0f766e" opacity={0.2} transparent side={THREE.DoubleSide} />
        </mesh>
        
        {/* L-Shaped Executive Desk */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[2.8, 0.1, 1.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        <mesh position={[-1.0, 0.75, 0.8]}>
          <boxGeometry args={[0.8, 0.1, 1.2]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        {/* Base */}
        <mesh position={[-1.3, 0.375, 0]}>
          <boxGeometry args={[0.2, 0.75, 1.0]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[1.3, 0.375, 0]}>
          <boxGeometry args={[0.2, 0.75, 1.0]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Executive Chair */}
        <mesh position={[0, 0.5, -0.8]}>
          <boxGeometry args={[0.7, 0.15, 0.6]} />
          <meshStandardMaterial color="#171717" />
        </mesh>
        <mesh position={[0, 1.1, -1.0]}>
          <boxGeometry args={[0.7, 1.0, 0.15]} />
          <meshStandardMaterial color="#171717" />
        </mesh>

        {/* Guest Chairs */}
        <mesh position={[-0.8, 0.45, 1.2]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[-0.8, 0.8, 1.4]}>
          <boxGeometry args={[0.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.8, 0.45, 1.2]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.8, 0.8, 1.4]}>
          <boxGeometry args={[0.5, 0.6, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Mac/PC Monitor */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.0, 0.6, 0.05]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 1.2, 0.03]}>
          <planeGeometry args={[0.95, 0.55]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0, 0.9, -0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Conference Area */}
      <group position={[-6, 0, 2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[6, 8]} />
          <meshBasicMaterial color="#047857" opacity={0.2} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.5, 0.05, 4]} />
          <meshStandardMaterial color="#e2e8f0" opacity={0.6} transparent metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.7]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {[
          [-1.5, -1], [-1.5, 0], [-1.5, 1],
          [1.5, -1], [1.5, 0], [1.5, 1]
        ].map((pos, idx) => (
          <group key={idx} position={[pos[0], 0, pos[1]]} rotation={[0, pos[0] > 0 ? -Math.PI/2 : Math.PI/2, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.8, -0.2]}>
              <boxGeometry args={[0.5, 0.6, 0.1]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Lounge Area */}
      <group position={[6, 0, 4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#be123c" opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sofa 1 */}
        <group position={[-1.5, 0, 0]} rotation={[0, Math.PI/2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[2.5, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Sofa 2 */}
        <group position={[1.5, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.7, -0.3]}>
            <boxGeometry args={[2.5, 0.6, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[1.15, 0.5, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Coffee Table */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      {/* Tall Bookshelf */}
      <group position={[11, 0, -5]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.6, 3, 3]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.31, 1.5, 0]}>
          <boxGeometry args={[0.02, 2.8, 2.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Decorative Plants */}
      <FicusPlant position={[-11.5, 0, -9]} />
      <SnakePlant position={[11.5, 0, 9]} />
      <FernPlant position={[-11.5, 0, 9]} />
    </group>
  );
};
