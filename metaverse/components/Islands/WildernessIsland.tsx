'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Tree({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.25, height * 0.6, 6]} />
        <meshStandardMaterial color="#4a2f0a" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, height * 0.7, 0]}>
        <coneGeometry args={[height * 0.3, height * 0.5, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, height * 0.85, 0]}>
        <coneGeometry args={[height * 0.2, height * 0.3, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Firefly({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.5 + Math.random() * 0.5;
  const radius = 1 + Math.random() * 2;
  const offset = Math.random() * Math.PI * 2;

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed + offset;
      ref.current.position.x = position[0] + Math.sin(t) * radius;
      ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.5;
      ref.current.position.z = position[2] + Math.cos(t) * radius;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} />
      <pointLight intensity={0.1} color="#34d399" distance={3} />
    </mesh>
  );
}

function TreasureChest({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + Math.sin(clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.5]} />
        <meshStandardMaterial color="#b45309" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.85, 0.15, 0.55]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={0.3} color="#fbbf24" distance={4} />
    </group>
  );
}

function MysteriousPortal() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[0, 0, 15]}>
      <mesh ref={ref} position={[0, 3, 0]}>
        <torusGeometry args={[2.5, 0.15, 8, 32]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <circleGeometry args={[2.3, 32]} />
        <meshStandardMaterial
          color="#002010"
          emissive="#065f46"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text position={[0, 6, 0]} fontSize={0.5} color="#34d399" anchorX="center">
        Secret Vault
      </Text>
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#34d399" distance={10} />
    </group>
  );
}

export default function WildernessIsland() {
  const pos: [number, number, number] = [-60, 0, 60];

  const trees = useMemo(() => {
    const result: { pos: [number, number, number]; h: number; c: string }[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const r = rng(42);
    for (let i = 0; i < 30; i++) {
      const angle = r() * Math.PI * 2;
      const dist = 3 + r() * 18;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const h = 3 + r() * 4;
      const colors = ['#065f46', '#047857', '#059669', '#10b981', '#166534'];
      result.push({ pos: [x, 0, z], h, c: colors[Math.floor(r() * colors.length)] });
    }
    return result;
  }, []);

  return (
    <group position={pos}>
      {/* Forest */}
      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} height={t.h} color={t.c} />
      ))}

      {/* Fireflies */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 5 + Math.random() * 15;
        return (
          <Firefly
            key={i}
            position={[Math.cos(angle) * r, 2 + Math.random() * 3, Math.sin(angle) * r]}
          />
        );
      })}

      {/* Treasure chests */}
      <TreasureChest position={[10, 0, 8]} />
      <TreasureChest position={[-12, 0, -5]} />
      <TreasureChest position={[5, 0, -15]} />

      <MysteriousPortal />

      {/* Ambient forest light */}
      <ambientLight intensity={0.15} color="#34d399" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#065f46" distance={30} />
    </group>
  );
}
