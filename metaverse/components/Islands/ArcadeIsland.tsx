'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

function ArcadeCabinet({
  position,
  color,
  label,
  gameId,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  gameId: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const setView = useGameStore((s) => s.setView);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Cabinet body */}
      <mesh ref={ref} position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 3, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 2, 0.76]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <Text position={[0, 3.5, 0.76]} fontSize={0.3} color={color} anchorX="center">
        {label}
      </Text>
      <pointLight position={[0, 2, 1]} intensity={0.3} color={color} distance={5} />
    </group>
  );
}

function NeonArch({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[4, 0.15, 8, 32, Math.PI]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export default function ArcadeIsland() {
  const pos: [number, number, number] = [60, 12, 60];

  return (
    <group position={pos}>
      {/* Entrance arch */}
      <NeonArch position={[0, 5, -12]} color="#22d3ee" />

      <Text position={[0, 10, -12]} fontSize={1.5} color="#22d3ee" anchorX="center">
        ARCADE
      </Text>

      {/* Game cabinets */}
      <ArcadeCabinet position={[-8, 0, -5]} color="#22d3ee" label="Dopamine Rush" gameId="dopamine-rush" />
      <ArcadeCabinet position={[-4, 0, -5]} color="#f472b6" label="Memory Palace" gameId="memory-palace" />
      <ArcadeCabinet position={[0, 0, -5]} color="#34d399" label="Cook-Off" gameId="cook-off" />
      <ArcadeCabinet position={[4, 0, -5]} color="#fbbf24" label="Claw Racing" gameId="claw-racing" />
      <ArcadeCabinet position={[8, 0, -5]} color="#ef4444" label="Colosseum" gameId="colosseum" />

      {/* More cabinets on the other side */}
      <ArcadeCabinet position={[-6, 0, 5]} color="#a78bfa" label="Puzzle Box" gameId="puzzle" />
      <ArcadeCabinet position={[0, 0, 5]} color="#f97316" label="Tower Defense" gameId="tower" />
      <ArcadeCabinet position={[6, 0, 5]} color="#14b8a6" label="Lucky Slots" gameId="slots" />

      {/* Neon floor strips */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -8 + i * 3]}>
          <planeGeometry args={[20, 0.3]} />
          <meshStandardMaterial
            color={['#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#ef4444'][i]}
            emissive={['#22d3ee', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#ef4444'][i]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Ambient arcade lighting */}
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#22d3ee" distance={20} />
      <pointLight position={[-8, 4, 0]} intensity={0.3} color="#f472b6" distance={10} />
      <pointLight position={[8, 4, 0]} intensity={0.3} color="#34d399" distance={10} />
    </group>
  );
}
