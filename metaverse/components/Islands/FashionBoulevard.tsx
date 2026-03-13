'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function Runway() {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    if (spotRef.current) {
      spotRef.current.intensity = 1 + Math.sin(clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={[8, 0, 0]}>
      {/* Runway surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[4, 18]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#ec4899" emissiveIntensity={0.1} />
      </mesh>
      {/* Edge lights */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[2.2, 0.1, -9 + i * 2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`l${i}`} position={[-2.2, 0.1, -9 + i * 2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} />
        </mesh>
      ))}
      <spotLight
        ref={spotRef}
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={1.5}
        color="#ec4899"
        distance={20}
      />
      <Text position={[0, 5, -9]} fontSize={0.7} color="#ec4899" anchorX="center">
        CATWALK
      </Text>
    </group>
  );
}

function Mirror({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          color="#b0b0c0"
          roughness={0}
          metalness={1}
        />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[2.3, 3.3, 0.1]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function FashionBoulevard() {
  const pos: [number, number, number] = [0, 4, -80];

  return (
    <group position={pos}>
      <StoreBuilding
        position={[-8, 0, 0]}
        color="#ec4899"
        emissive="#9d174d"
        storeName="skinstore"
        label="Skin Store"
      />

      <Runway />

      {/* Fitting room mirrors */}
      <Mirror position={[-12, 2, 5]} rotation={[0, 0.3, 0]} />
      <Mirror position={[-12, 2, -5]} rotation={[0, -0.3, 0]} />

      {/* Spotlights */}
      {[[-5, 8, 5], [5, 8, 5], [-5, 8, -5], [5, 8, -5]].map((p, i) => (
        <spotLight
          key={i}
          position={p as [number, number, number]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.5}
          color="#ec4899"
          distance={15}
        />
      ))}
    </group>
  );
}
