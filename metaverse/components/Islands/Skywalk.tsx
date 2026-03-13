'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface Props {
  from: [number, number, number];
  to: [number, number, number];
}

export default function Skywalk({ from, to }: Props) {
  const tubeRef = useRef<THREE.Mesh>(null);

  const { midpoint, length, rotation } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 3;
    const dir = end.clone().sub(start);
    const len = dir.length();
    const rot = new THREE.Euler(0, Math.atan2(dir.x, dir.z), 0);
    return { midpoint: mid, length: len, rotation: rot };
  }, [from, to]);

  useFrame(({ clock }) => {
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={tubeRef} castShadow receiveShadow>
          <boxGeometry args={[3, 0.5, length]} />
          <meshStandardMaterial
            color="#1a1a3e"
            emissive="#4c1d95"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </RigidBody>

      {/* Railings */}
      {[-1.3, 1.3].map((xOff) => (
        <mesh key={xOff} position={[xOff, 0.8, 0]}>
          <boxGeometry args={[0.1, 1.2, length]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
