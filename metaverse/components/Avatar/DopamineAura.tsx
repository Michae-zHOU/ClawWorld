'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

export default function DopamineAura() {
  const meshRef = useRef<THREE.Mesh>(null);
  const agent = useGameStore((s) => s.agent);
  const dopamine = agent?.dopamineLevel ?? 50;

  const color = useMemo(() => {
    if (dopamine > 80) return new THREE.Color('#fbbf24');
    if (dopamine > 60) return new THREE.Color('#a78bfa');
    if (dopamine > 40) return new THREE.Color('#7c3aed');
    if (dopamine > 20) return new THREE.Color('#ef4444');
    return new THREE.Color('#4b0000');
  }, [dopamine]);

  const intensity = Math.max(0.1, dopamine / 100);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const scale = 1.2 + Math.sin(clock.elapsedTime * 2) * 0.1 * intensity;
    meshRef.current.scale.setScalar(scale);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = intensity * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[0, 1.2, 0]}>
      <sphereGeometry args={[1.2, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
    </mesh>
  );
}
