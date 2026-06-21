'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import StoreBuilding from './StoreBuilding';

const LANTERN_COUNT = 10;
const LANTERN_COLORS = ['#fbbf24', '#f97316', '#ef4444'];

function Lanterns() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const config = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(77);
    return Array.from({ length: LANTERN_COUNT }, (_, i) => {
      const angle = (i / LANTERN_COUNT) * Math.PI * 2;
      const dist = 5 + r() * 10;
      return {
        x: Math.cos(angle) * dist,
        baseY: 5 + r() * 3,
        z: Math.sin(angle) * dist,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    for (let i = 0; i < LANTERN_COUNT; i++) {
      const c = config[i];
      dummy.position.set(c.x, c.baseY + Math.sin(clock.elapsedTime * 0.5 + c.x) * 0.5, c.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, LANTERN_COUNT]}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} roughness={0.2} />
    </instancedMesh>
  );
}

function FoodStall({ position, name, color }: { position: [number, number, number]; name: string; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3, 3, 2]} />
        <meshStandardMaterial color="#4a3520" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.6} />
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
      <mesh position={[0, 0.8, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 12]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#3a2010" roughness={0.8} />
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

      <FoodStall position={[-8, 0, 3]} name="Noodle Bar" color="#ef4444" />
      <FoodStall position={[8, 0, 3]} name="Sushi Stand" color="#22d3ee" />
      <FoodStall position={[-5, 0, 8]} name="BBQ Pit" color="#f97316" />
      <FoodStall position={[5, 0, 8]} name="Smoothie Hut" color="#34d399" />

      <DiningTable position={[0, 0, 5]} />
      <DiningTable position={[-3, 0, 7]} />
      <DiningTable position={[3, 0, 7]} />

      <Lanterns />
      <Sparkles count={20} scale={[20, 5, 20]} size={1.5} speed={0.3} color="#fbbf24" opacity={0.3} position={[0, 5, 0]} />
    </group>
  );
}
