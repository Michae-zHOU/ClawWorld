'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function NeonSign({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5 + Math.sin(clock.elapsedTime * 3) * 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[6, 1.5, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.1} metalness={0.5} />
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
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.3, 24]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>
      <Sparkles count={15} scale={[6, 3, 6]} size={1} speed={0.3} color="#06b6d4" opacity={0.3} position={[0, 1.5, 0]} />
      <Text position={[0, 3, 0]} fontSize={0.5} color="#06b6d4" anchorX="center">
        Wellness Spa
      </Text>
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
    </group>
  );
}
