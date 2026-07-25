import React from "react";

export const FicusPlant: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    {/* Tall Ceramic Pot */}
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.3, 0.25, 0.8]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.2} />
    </mesh>
    {/* Trunk */}
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.04, 0.05, 1.2]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    {/* Leaves (Layered spheres) */}
    <mesh position={[0, 1.8, 0]}>
      <sphereGeometry args={[0.6]} />
      <meshStandardMaterial color="#15803d" roughness={0.9} />
    </mesh>
    <mesh position={[0.2, 1.5, 0.2]}>
      <sphereGeometry args={[0.4]} />
      <meshStandardMaterial color="#16a34a" roughness={0.9} />
    </mesh>
    <mesh position={[-0.2, 1.6, -0.2]}>
      <sphereGeometry args={[0.45]} />
      <meshStandardMaterial color="#15803d" roughness={0.9} />
    </mesh>
  </group>
);

export const SnakePlant: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    {/* Wide Rectangular Planter */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1.2, 0.5, 0.4]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    {/* Tall rigid blades */}
    {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
      <mesh key={i} position={[x, 0.8 + (i % 2 === 0 ? 0.2 : 0), 0]} rotation={[0, 0, (i - 2) * 0.05]}>
        <boxGeometry args={[0.1, 1.2 + (i % 2 === 0 ? 0.4 : 0), 0.05]} />
        <meshStandardMaterial color="#14532d" />
      </mesh>
    ))}
  </group>
);

export const FernPlant: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    {/* Round Terracotta Pot */}
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.4, 0.2, 0.4]} />
      <meshStandardMaterial color="#b45309" roughness={0.8} />
    </mesh>
    {/* Bushy leaves */}
    <mesh position={[0, 0.6, 0]}>
      <dodecahedronGeometry args={[0.6]} />
      <meshStandardMaterial color="#22c55e" roughness={1.0} />
    </mesh>
    <mesh position={[0.3, 0.5, 0.2]}>
      <dodecahedronGeometry args={[0.4]} />
      <meshStandardMaterial color="#16a34a" roughness={1.0} />
    </mesh>
    <mesh position={[-0.2, 0.45, -0.3]}>
      <dodecahedronGeometry args={[0.45]} />
      <meshStandardMaterial color="#15803d" roughness={1.0} />
    </mesh>
  </group>
);
