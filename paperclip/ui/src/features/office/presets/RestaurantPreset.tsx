import React from "react";

export const RestaurantPreset: React.FC = () => {
  const tables = [
    [-8, -4], [-8, 2],
    [-2, -4], [-2, 2],
    [4, -4], [4, 2],
    [10, -4], [10, 2],
  ];

  return (
    <group>
      {/* Warm Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>
      <gridHelper args={[30, 30, "#b45309", "#92400e"]} position={[0, 0, 0]} />

      {/* Walls */}
      <mesh position={[0, 3, -10]}>
        <boxGeometry args={[30, 6, 0.4]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 6, 0.4]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Dining Tables & Chairs */}
      {tables.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Table */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.08, 16]} />
            <meshStandardMaterial color="#92400e" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.3, 0.7]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* 4 Dining Chairs */}
          {[[-1.2, 0], [1.2, 0], [0, -1.2], [0, 1.2]].map(([cx, cz], cIdx) => (
            <group key={cIdx} position={[cx, 0, cz]}>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.5, 0.08, 0.5]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Bar Counter Area */}
      <group position={[0, 0, 7]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[16, 1.2, 1.2]} />
          <meshStandardMaterial color="#1c1917" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
