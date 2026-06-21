'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

function Runway() {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    if (spotRef.current) spotRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 2) * 1;
  });

  return (
    <group position={[8, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[4, 18]} />
        <meshStandardMaterial color="#0a0a15" emissive="#ec4899" emissiveIntensity={0.2} roughness={0.1} metalness={0.8} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[2.2, 0.1, -9 + i * 2]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={3} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`l${i}`} position={[-2.2, 0.1, -9 + i * 2]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={3} />
        </mesh>
      ))}
      <spotLight
        ref={spotRef}
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#ec4899"
        distance={25}
        castShadow
      />
      <Sparkles count={20} scale={[6, 3, 18]} size={1} speed={0.4} color="#ec4899" opacity={0.4} />
      <Text position={[0, 5, -9]} fontSize={0.7} color="#ec4899" anchorX="center">
        CATWALK
      </Text>
    </group>
  );
}

function Mirror({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#c0c0d0" roughness={0} metalness={1} envMapIntensity={2} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[2.3, 3.3, 0.1]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
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
      <Mirror position={[-12, 2, 5]} rotation={[0, 0.3, 0]} />
      <Mirror position={[-12, 2, -5]} rotation={[0, -0.3, 0]} />
    </group>
  );
}
