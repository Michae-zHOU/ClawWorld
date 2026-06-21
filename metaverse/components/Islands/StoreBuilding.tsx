'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

interface Props {
  position: [number, number, number];
  color: string;
  emissive: string;
  storeName: string;
  label: string;
}

export default function StoreBuilding({ position, color, emissive, storeName, label }: Props) {
  const doorRef = useRef<THREE.Mesh>(null);
  const setShowStoreModal = useGameStore((s) => s.setShowStoreModal);

  useFrame(({ clock }) => {
    if (doorRef.current) {
      (doorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1 + Math.sin(clock.elapsedTime * 2) * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 7, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} envMapIntensity={1} />
      </mesh>

      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[8.5, 0.4, 8.5]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.8} roughness={0.1} metalness={0.8} />
      </mesh>

      <mesh ref={doorRef} position={[0, 2, 4.01]}>
        <planeGeometry args={[2.5, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.85} />
      </mesh>

      <Text position={[0, 6, 4.1]} fontSize={0.7} color="#ffffff" anchorX="center" outlineWidth={0.05} outlineColor="#000000">
        {label}
      </Text>

      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 4.5, 4.01]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
