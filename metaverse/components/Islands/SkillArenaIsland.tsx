'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function TrainingDummy({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.7, 1.8, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#6b3410" />
      </mesh>
      <mesh position={[-0.7, 1.8, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#6b3410" />
      </mesh>
      {/* Post */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#4a2f0a" />
      </mesh>
    </group>
  );
}

function DuelArena() {
  return (
    <group position={[8, 0, 5]}>
      {/* Arena ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[5, 6, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#1a0505" roughness={0.5} />
      </mesh>
      <Text position={[0, 5, 0]} fontSize={0.8} color="#ef4444" anchorX="center">
        DUEL ARENA
      </Text>
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#ef4444" distance={15} />
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

      {/* Training dummies */}
      <TrainingDummy position={[-5, 0, 8]} />
      <TrainingDummy position={[-3, 0, 10]} />
      <TrainingDummy position={[-7, 0, 10]} />

      {/* Industrial lights */}
      {[[-10, 8, 0], [10, 8, 0], [0, 8, 10], [0, 8, -10]].map((p, i) => (
        <pointLight
          key={i}
          position={p as [number, number, number]}
          intensity={0.4}
          color="#f97316"
          distance={15}
        />
      ))}
    </group>
  );
}
