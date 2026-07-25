import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Workforce3DMember } from "./types.js";

interface WorkforceAvatar3DProps {
  member: Workforce3DMember;
  targetPosition: [number, number, number];
  isSelected?: boolean;
  onSelect?: (member: Workforce3DMember) => void;
}

export const WorkforceAvatar3D: React.FC<WorkforceAvatar3DProps> = ({
  member,
  targetPosition,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const isHuman = member.type === "human";
  const isWorking = member.status === "active" || member.status === "working";
  const isInMeeting = member.status === "in_meeting";
  const isOffline = member.status === "offline";

  // Status dot color matching claw3d-hero.png
  const statusColor = isWorking
    ? "#ef4444" // Red dot for working
    : isInMeeting
    ? "#f59e0b" // Yellow dot for idle/meeting
    : isOffline
    ? "#6b7280" // Gray dot for offline
    : "#22c55e"; // Green dot for connected

  const primaryColor = member.avatarConfig.primaryColor || member.avatarConfig.outfitColor || (isHuman ? "#2563eb" : "#0284c7");
  const skinColor = member.avatarConfig.skinTone || "#fdba74";
  const hairColor = member.avatarConfig.hairColor || "#1e293b";

  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...targetPosition));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const targetPosVec = new THREE.Vector3(...targetPosition);
      const dist = currentPosRef.current.distanceTo(targetPosVec);
      
      if (dist > 0.05) {
        // Moving: Lerp towards target
        currentPosRef.current.lerp(targetPosVec, delta * 3);
        
        // Add a bounce effect to simulate walking
        const bounce = Math.abs(Math.sin(t * 15)) * 0.15;
        groupRef.current.position.set(currentPosRef.current.x, targetPosition[1] + bounce, currentPosRef.current.z);

        // Rotate to face movement direction
        const dx = targetPosVec.x - currentPosRef.current.x;
        const dz = targetPosVec.z - currentPosRef.current.z;
        const targetAngle = Math.atan2(dx, dz);
        
        // Smooth rotation
        let currentRot = groupRef.current.rotation.y;
        // Fix wrap-around for lerping rotation (simple approach for now)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(currentRot, targetAngle, delta * 8);
      } else {
        // Idle
        currentPosRef.current.copy(targetPosVec);
        groupRef.current.position.set(
          currentPosRef.current.x, 
          targetPosition[1] + Math.sin(t * 2.5 + currentPosRef.current.x) * 0.03, 
          currentPosRef.current.z
        );
        // Face forward when idle
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 5);
      }
    }

    if (isWorking) {
      if (leftArmRef.current && rightArmRef.current) {
        // Typing animation
        leftArmRef.current.rotation.x = Math.sin(t * 10) * 0.15 - 0.4;
        rightArmRef.current.rotation.x = Math.cos(t * 10) * 0.15 - 0.4;
      }
    }
  });

  const firstName = member.name.split(" ")[0];

  return (
    <group
      ref={groupRef}
      // initial position to prevent flash at 0,0,0
      position={currentPosRef.current}

      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(member);
      }}
    >
      {/* Selection Glow Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 32]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {isHuman ? (
        /* Human Employee Voxel 3D Character */
        <group>
          {/* Torso */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.45, 0.6, 0.25]} />
            <meshStandardMaterial color={primaryColor} roughness={0.5} />
          </mesh>

          {/* Head */}
          <mesh ref={headRef} position={[0, 1.15, 0]}>
            <boxGeometry args={[0.38, 0.38, 0.38]} />
            <meshStandardMaterial color={skinColor} roughness={0.4} />
          </mesh>

          {/* Hair */}
          <mesh position={[0, 1.32, 0]}>
            <boxGeometry args={[0.4, 0.12, 0.4]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>

          {/* Left Arm */}
          <mesh ref={leftArmRef} position={[-0.3, 0.65, 0]}>
            <boxGeometry args={[0.12, 0.45, 0.12]} />
            <meshStandardMaterial color={primaryColor} />
          </mesh>

          {/* Right Arm */}
          <mesh ref={rightArmRef} position={[0.3, 0.65, 0]}>
            <boxGeometry args={[0.12, 0.45, 0.12]} />
            <meshStandardMaterial color={primaryColor} />
          </mesh>

          {/* Pants */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.42, 0.4, 0.24]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ) : (
        /* AI Agent Bot Voxel 3D Character */
        <group>
          {/* Bot Body */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.5, 0.6, 0.3]} />
            <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.2} />
          </mesh>

          {/* Bot Head */}
          <mesh ref={headRef} position={[0, 1.15, 0]}>
            <boxGeometry args={[0.4, 0.35, 0.3]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Glowing Eyes */}
          <mesh position={[-0.1, 1.18, 0.16]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.1, 1.18, 0.16]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Antenna */}
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>

          {/* Left Arm */}
          <mesh ref={leftArmRef} position={[-0.32, 0.65, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.45]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>

          {/* Right Arm */}
          <mesh ref={rightArmRef} position={[0.32, 0.65, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.45]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* Dark Floating Nameplate Matching claw3d-hero.png (Black Badge with Name + Status Dot) */}
      <Billboard position={[0, 1.75, 0]} follow>
        {/* Black Badge Background */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.5, 0.35]} />
          <meshBasicMaterial color="#000000" opacity={0.92} transparent />
        </mesh>

        {/* Member Name */}
        <Text
          position={[-0.15, 0, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {firstName}
        </Text>

        {/* Colored Status Dot Matching claw3d-hero.png */}
        <mesh position={[0.5, 0, 0]}>
          <circleGeometry args={[0.055, 16]} />
          <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>

      {/* Speech / Task Thought Bubble */}
      {(member.currentSpeech || member.activeTask) && (
        <Billboard position={[0, 2.3, 0]} follow>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.2, 0.55]} />
            <meshBasicMaterial color="#0f172a" opacity={0.95} transparent />
          </mesh>
          <Text
            maxWidth={2.0}
            fontSize={0.11}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            {member.currentSpeech || `⚡ ${member.activeTask?.title}`}
          </Text>
        </Billboard>
      )}
    </group>
  );
};
