'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function TrainingDummy({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime + position[0]) * 0.3;
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </mesh>
      <mesh position={[0.7, 1.8, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#6b3410" />
      </mesh>
      <mesh position={[-0.7, 1.8, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#6b3410" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#4a2f0a" />
      </mesh>
    </group>
  );
}

function DuelArena() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.sin(clock.elapsedTime * 2) * 0.4;
    }
  });

  return (
    <group position={[8, 0, 5]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[5, 6, 24]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[5, 24]} />
        <meshStandardMaterial color="#1a0505" roughness={0.4} metalness={0.3} />
      </mesh>
      <Sparkles count={20} scale={[12, 4, 12]} size={1.5} speed={0.5} color="#ef4444" opacity={0.4} />
      <Text position={[0, 5, 0]} fontSize={0.8} color="#ef4444" anchorX="center">
        DUEL ARENA
      </Text>
    </group>
  );
}

export default function SkillArenaIsland() {
  const pos: [number, number, number] = [0, 10, 80];

  return (
    <group position={pos}>
      <StoreBuilding
        position={[-8, 0, -5]}
        color="#ef4444"
        emissive="#991b1b"
        storeName="skillstore"
        label="Skill Store"
      />
      <DuelArena />
      <TrainingDummy position={[-5, 0, 8]} />
      <TrainingDummy position={[-3, 0, 10]} />
      <TrainingDummy position={[-7, 0, 10]} />
    </group>
  );
}
