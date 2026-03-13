'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function FloatingLantern({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.5 + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      <pointLight intensity={0.3} color={color} distance={6} />
    </mesh>
  );
}

function FoodStall({ position, name, color }: { position: [number, number, number]; name: string; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 3, 2]} />
        <meshStandardMaterial color="#4a3520" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <Text position={[0, 4.5, 1.1]} fontSize={0.4} color="#fbbf24" anchorX="center">
        {name}
      </Text>
    </group>
  );
}

function DiningTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#3a2010" />
      </mesh>
    </group>
  );
}

export default function FoodCourtIsland() {
  const pos: [number, number, number] = [-80, 5, 0];

  return (
    <group position={pos}>
      <StoreBuilding
        position={[0, 0, -5]}
        color="#f59e0b"
        emissive="#b45309"
        storeName="foodstore"
        label="Food Store"
      />

      {/* Market stalls */}
      <FoodStall position={[-8, 0, 3]} name="Noodle Bar" color="#ef4444" />
      <FoodStall position={[8, 0, 3]} name="Sushi Stand" color="#22d3ee" />
      <FoodStall position={[-5, 0, 8]} name="BBQ Pit" color="#f97316" />
      <FoodStall position={[5, 0, 8]} name="Smoothie Hut" color="#34d399" />

      {/* Dining tables */}
      <DiningTable position={[0, 0, 5]} />
      <DiningTable position={[-3, 0, 7]} />
      <DiningTable position={[3, 0, 7]} />

      {/* Floating lanterns */}
      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const r = 5 + Math.random() * 10;
        return (
          <FloatingLantern
            key={i}
            position={[Math.cos(angle) * r, 5 + Math.random() * 3, Math.sin(angle) * r]}
            color={['#fbbf24', '#f97316', '#ef4444'][i % 3]}
          />
        );
      })}

      <ambientLight intensity={0.2} color="#fbbf24" />
    </group>
  );
}
