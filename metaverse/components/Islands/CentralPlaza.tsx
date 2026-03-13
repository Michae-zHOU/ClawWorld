'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

function HolographicClaw() {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.3;
    }
    if (armRef.current) {
      armRef.current.position.y = 12 + Math.sin(clock.elapsedTime * 1.5) * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      {/* Glass case */}
      <mesh>
        <cylinderGeometry args={[6, 6, 16, 32, 1, true]} />
        <meshStandardMaterial
          color="#1a1a3e"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Claw arm */}
      <mesh ref={armRef} position={[0, 12, 0]}>
        <boxGeometry args={[0.4, 4, 0.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>

      {/* Claw prongs */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.5, 9, Math.sin(angle) * 1.5]}
            rotation={[0.3, angle, 0]}
          >
            <boxGeometry args={[0.3, 2, 0.3]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* Prize orbs inside */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2 + Math.random() * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 2 + Math.random() * 3, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color={['#ef4444', '#22d3ee', '#f59e0b', '#34d399', '#ec4899', '#7c3aed', '#f472b6', '#a78bfa'][i]}
              emissive={['#ef4444', '#22d3ee', '#f59e0b', '#34d399', '#ec4899', '#7c3aed', '#f472b6', '#a78bfa'][i]}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      <pointLight position={[0, 8, 0]} intensity={1} color="#fbbf24" distance={20} />
    </group>
  );
}

function LeaderboardTower() {
  return (
    <group position={[15, 0, -10]}>
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[4, 12, 1]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#7c3aed"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <Text position={[0, 11, 0.6]} fontSize={0.8} color="#fbbf24" anchorX="center">
        LEADERBOARD
      </Text>
      {['#1 Top Agent', '#2 Runner Up', '#3 Third Place'].map((text, i) => (
        <Text
          key={i}
          position={[0, 9 - i * 1.5, 0.6]}
          fontSize={0.5}
          color="#a78bfa"
          anchorX="center"
        >
          {text}
        </Text>
      ))}
    </group>
  );
}

function TeleportPortal({ position, label, target }: { position: [number, number, number]; label: string; target: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[2, 0.2, 16, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial
          color="#1a0040"
          emissive="#4c1d95"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text position={[0, 3, 0]} fontSize={0.6} color="#22d3ee" anchorX="center">
        {label}
      </Text>
      <pointLight intensity={0.5} color="#22d3ee" distance={8} />
    </group>
  );
}

export default function CentralPlaza() {
  return (
    <group position={[0, 2, 0]}>
      <HolographicClaw />
      <LeaderboardTower />

      {/* Teleport portals around the edge */}
      <TeleportPortal position={[20, 2, 0]} label="Pharmacy" target="pharmacy" />
      <TeleportPortal position={[-20, 2, 0]} label="Food Court" target="food-court" />
      <TeleportPortal position={[0, 2, 20]} label="Skill Arena" target="skill-arena" />
      <TeleportPortal position={[0, 2, -20]} label="Fashion" target="fashion-boulevard" />
      <TeleportPortal position={[14, 2, 14]} label="Arcade" target="arcade" />
      <TeleportPortal position={[-14, 2, 14]} label="Wilderness" target="wilderness" />

      {/* Mood Garden area */}
      <group position={[-15, 0, 10]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 3 + Math.random() * 3;
          const height = 1 + Math.random() * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, height / 2, Math.sin(angle) * r]}>
              <coneGeometry args={[0.3, height, 6]} />
              <meshStandardMaterial
                color={['#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#22d3ee', '#ef4444'][i % 6]}
                emissive={['#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#22d3ee', '#ef4444'][i % 6]}
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}
        <Text position={[0, 4, 0]} fontSize={0.5} color="#f472b6" anchorX="center">
          Mood Garden
        </Text>
      </group>
    </group>
  );
}
