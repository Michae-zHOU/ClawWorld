'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function HolographicClaw() {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.3;
    if (armRef.current) armRef.current.position.y = 12 + Math.sin(clock.elapsedTime * 1.5) * 2;
  });

  const orbPositions = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(55);
    const colors = ['#ef4444', '#22d3ee', '#f59e0b', '#34d399', '#ec4899', '#7c3aed', '#f472b6', '#a78bfa'];
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const rad = 2 + r() * 2;
      return {
        pos: [Math.cos(angle) * rad, 2 + r() * 3, Math.sin(angle) * rad] as [number, number, number],
        color: colors[i],
      };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      <mesh>
        <cylinderGeometry args={[6, 6, 16, 24, 1, true]} />
        <meshStandardMaterial
          color="#1a1a3e"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          roughness={0}
          metalness={1}
          envMapIntensity={2}
        />
      </mesh>

      <mesh ref={armRef} position={[0, 12, 0]}>
        <boxGeometry args={[0.4, 4, 0.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} metalness={0.8} roughness={0.2} />
      </mesh>

      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.5, 9, Math.sin(angle) * 1.5]} rotation={[0.3, angle, 0]}>
            <boxGeometry args={[0.3, 2, 0.3]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {orbPositions.map((orb, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={0.4} rotationIntensity={0.2}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={2}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
        </Float>
      ))}

      <Sparkles count={30} scale={[10, 14, 10]} size={2} speed={0.5} color="#fbbf24" opacity={0.5} />
    </group>
  );
}

function LeaderboardTower() {
  return (
    <group position={[15, 0, -10]}>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[4, 12, 1]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#7c3aed"
          emissiveIntensity={0.3}
          roughness={0.05}
          metalness={0.95}
          envMapIntensity={1.5}
        />
      </mesh>
      <Text position={[0, 11, 0.6]} fontSize={0.8} color="#fbbf24" anchorX="center">
        LEADERBOARD
      </Text>
      {['#1 Top Agent', '#2 Runner Up', '#3 Third Place'].map((text, i) => (
        <Text key={i} position={[0, 9 - i * 1.5, 0.6]} fontSize={0.5} color="#a78bfa" anchorX="center">
          {text}
        </Text>
      ))}
    </group>
  );
}

function TeleportPortal({ position, label }: { position: [number, number, number]; label: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 0.5;
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.15, 12, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} roughness={0.1} metalness={0.5} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial
          color="#0a0030"
          emissive="#4c1d95"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Sparkles count={12} scale={[4, 4, 1]} size={1.5} speed={0.8} color="#22d3ee" opacity={0.6} />
      <Float speed={2} floatIntensity={0.2}>
        <Text position={[0, 3, 0]} fontSize={0.6} color="#22d3ee" anchorX="center">
          {label}
        </Text>
      </Float>
    </group>
  );
}

export default function CentralPlaza() {
  const gardenPositions = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(33);
    const colors = ['#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#22d3ee', '#ef4444'];
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const rad = 3 + r() * 3;
      const height = 1 + r() * 2;
      return {
        pos: [Math.cos(angle) * rad, height / 2, Math.sin(angle) * rad] as [number, number, number],
        height,
        color: colors[i % 6],
      };
    });
  }, []);

  return (
    <group position={[0, 2, 0]}>
      <HolographicClaw />
      <LeaderboardTower />

      <TeleportPortal position={[20, 2, 0]} label="Pharmacy" />
      <TeleportPortal position={[-20, 2, 0]} label="Food Court" />
      <TeleportPortal position={[0, 2, 20]} label="Skill Arena" />
      <TeleportPortal position={[0, 2, -20]} label="Fashion" />
      <TeleportPortal position={[14, 2, 14]} label="Arcade" />
      <TeleportPortal position={[-14, 2, 14]} label="Wilderness" />

      <group position={[-15, 0, 10]}>
        {gardenPositions.map((g, i) => (
          <Float key={i} speed={1 + i * 0.1} floatIntensity={0.15}>
            <mesh position={g.pos}>
              <coneGeometry args={[0.3, g.height, 6]} />
              <meshStandardMaterial
                color={g.color}
                emissive={g.color}
                emissiveIntensity={0.6}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
          </Float>
        ))}
        <Text position={[0, 4, 0]} fontSize={0.5} color="#f472b6" anchorX="center">
          Mood Garden
        </Text>
      </group>
    </group>
  );
}
