'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ArcadeCabinet({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5 + Math.sin(clock.elapsedTime * 3 + position[0]) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2, 3, 1.5]} />
        <meshStandardMaterial color="#0a0a1e" emissive={color} emissiveIntensity={0.15} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh ref={screenRef} position={[0, 2, 0.76]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.1} />
      </mesh>
      <Text position={[0, 3.5, 0.76]} fontSize={0.3} color={color} anchorX="center">
        {label}
      </Text>
    </group>
  );
}

export default function ArcadeIsland() {
  const pos: [number, number, number] = [60, 12, 60];

  return (
    <group position={pos}>
      <mesh position={[0, 5, -12]}>
        <torusGeometry args={[4, 0.15, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} roughness={0.1} metalness={0.5} />
      </mesh>

      <Text position={[0, 10, -12]} fontSize={1.5} color="#22d3ee" anchorX="center">
        ARCADE
      </Text>

      <ArcadeCabinet position={[-8, 0, -5]} color="#22d3ee" label="Dopamine Rush" />
      <ArcadeCabinet position={[-4, 0, -5]} color="#f472b6" label="Memory Palace" />
      <ArcadeCabinet position={[0, 0, -5]} color="#34d399" label="Cook-Off" />
      <ArcadeCabinet position={[4, 0, -5]} color="#fbbf24" label="Claw Racing" />
      <ArcadeCabinet position={[8, 0, -5]} color="#ef4444" label="Colosseum" />
      <ArcadeCabinet position={[-6, 0, 5]} color="#a78bfa" label="Puzzle Box" />
      <ArcadeCabinet position={[0, 0, 5]} color="#f97316" label="Tower Defense" />
      <ArcadeCabinet position={[6, 0, 5]} color="#14b8a6" label="Lucky Slots" />

      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -8 + i * 3]}>
          <planeGeometry args={[20, 0.3]} />
          <meshStandardMaterial
            color={['#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#ef4444'][i]}
            emissive={['#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#ef4444'][i]}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}

      <Sparkles count={40} scale={[25, 8, 15]} size={2} speed={0.5} color="#22d3ee" opacity={0.4} />
    </group>
  );
}
