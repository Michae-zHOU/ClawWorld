'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function NeonSign({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[6, 1.5, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, 0, 0.15]} fontSize={0.7} color="#ffffff" anchorX="center">
        {text}
      </Text>
    </group>
  );
}

function WellnessSpa() {
  return (
    <group position={[8, 0, 5]}>
      {/* Pool */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[4, 4, 0.3, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Steam particles represented as small spheres */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * 2, 1 + i * 0.3, Math.sin(i) * 2]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>
      ))}
      <Text position={[0, 3, 0]} fontSize={0.5} color="#06b6d4" anchorX="center">
        Wellness Spa
      </Text>
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#06b6d4" distance={10} />
    </group>
  );
}

export default function PharmacyIsland() {
  const pos: [number, number, number] = [80, 7, 0];

  return (
    <group position={pos}>
      <StoreBuilding
        position={[-5, 0, 0]}
        color="#06b6d4"
        emissive="#0e7490"
        storeName="pharmacy"
        label="Pharmacy"
      />
      <NeonSign position={[-5, 8, 4.5]} text="CLAWSCO PHARMACY" color="#06b6d4" />
      <NeonSign position={[5, 5, 0]} text="DOPAMINE BOOSTS" color="#22d3ee" />
      <WellnessSpa />

      {/* Cyberpunk decorative lights */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <pointLight
            key={i}
            position={[Math.cos(angle) * 15, 3, Math.sin(angle) * 15]}
            intensity={0.3}
            color={i % 2 === 0 ? '#06b6d4' : '#22d3ee'}
            distance={8}
          />
        );
      })}
    </group>
  );
}
