import React from "react";

export const WarehousePreset: React.FC = () => {
  const rackRows = [-20, -10, 0, 10, 20];

  return (
    <group>
      {/* Heavy Industrial Concrete Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <gridHelper args={[60, 60, "#fbbf24", "#475569"]} position={[0, 0, 0]} />

      {/* Warehouse High-Bay Perimeter Walls */}
      <mesh position={[0, 6, -20]}>
        <boxGeometry args={[60, 12, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-30, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[40, 12, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[30, 6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[40, 12, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Industrial Pallet Racks & Cargo Crates */}
      {rackRows.map((x, idx) => (
        <group key={idx} position={[x, 0, -5]}>
          {/* Steel Frame */}
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[3, 6, 15]} />
            <meshStandardMaterial color="#d97706" wireframe />
          </mesh>
          {/* Shelves & Wooden Crates */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2.6, 1.2, 14]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[2.6, 1.2, 14]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
        </group>
      ))}

      {/* Forklift Ramp / Staging Zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 12]}>
        <planeGeometry args={[50, 8]} />
        <meshBasicMaterial color="#eab308" opacity={0.25} transparent />
      </mesh>
    </group>
  );
};
