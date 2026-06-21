'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { IslandConfig } from '@/lib/world-config';

interface Props {
  config: IslandConfig;
}

export default function IslandMesh({ config }: Props) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + Math.sin(clock.elapsedTime * 0.8 + config.position[0] * 0.1) * 0.3;
    }
  });

  return (
    <group position={config.position}>
      <RigidBody type="fixed" colliders="trimesh">
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[config.radius, config.radius * 1.1, 4, 24]} />
          <meshStandardMaterial
            color={config.color}
            roughness={0.5}
            metalness={0.3}
            envMapIntensity={0.8}
          />
        </mesh>
      </RigidBody>

      <mesh position={[0, -4, 0]} castShadow>
        <coneGeometry args={[config.radius * 0.8, 8, 12]} />
        <meshStandardMaterial color="#1a0a30" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh
        ref={glowRef}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[config.radius - 0.3, config.radius + 0.3, 48]} />
        <meshStandardMaterial
          color={config.emissive}
          emissive={config.emissive}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3} floatingRange={[0, 0.5]}>
        <Text
          position={[0, 8, 0]}
          fontSize={2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#000000"
        >
          {config.name}
        </Text>
      </Float>
    </group>
  );
}
