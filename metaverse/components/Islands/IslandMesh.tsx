'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { IslandConfig } from '@/lib/world-config';

interface Props {
  config: IslandConfig;
}

export default function IslandMesh({ config }: Props) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.position.y = -2 + Math.sin(clock.elapsedTime * 0.3 + config.position[0] * 0.1) * 0.5;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group position={config.position}>
      {/* Main platform */}
      <RigidBody type="fixed" colliders="trimesh">
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[config.radius, config.radius * 1.1, 4, 32]} />
          <meshStandardMaterial
            color={config.color}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      </RigidBody>

      {/* Underside rocky look */}
      <mesh position={[0, -4, 0]} castShadow>
        <coneGeometry args={[config.radius * 0.8, 8, 16]} />
        <meshStandardMaterial
          color="#2a1a40"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Glowing ring */}
      <mesh ref={glowRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.radius - 0.5, config.radius + 0.5, 64]} />
        <meshStandardMaterial
          color={config.emissive}
          emissive={config.emissive}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Island name label */}
      <Text
        position={[0, 8, 0]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {config.name}
      </Text>

      {/* Edge glow particles */}
      <pointLight
        position={[0, 2, 0]}
        intensity={0.5}
        color={config.emissive}
        distance={config.radius * 2}
      />
    </group>
  );
}
