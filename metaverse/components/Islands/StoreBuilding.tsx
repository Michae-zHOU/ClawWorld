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
      const mat = doorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[8, 7, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Roof accent */}
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[8.5, 0.4, 8.5]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} />
      </mesh>

      {/* Door */}
      <mesh ref={doorRef} position={[0, 2, 4.01]}>
        <planeGeometry args={[2.5, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Store sign */}
      <Text position={[0, 6, 4.1]} fontSize={0.7} color="#ffffff" anchorX="center" outlineWidth={0.05} outlineColor="#000000">
        {label}
      </Text>

      {/* Window glow */}
      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 4.5, 4.01]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
      ))}

      <pointLight position={[0, 4, 5]} intensity={0.5} color={color} distance={10} />
    </group>
  );
}
