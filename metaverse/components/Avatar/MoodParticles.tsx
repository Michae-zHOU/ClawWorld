'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

const PARTICLE_COUNT = 12;

function getMoodConfig(mood: string) {
  switch (mood) {
    case 'joy':
    case 'happy':
      return { color: '#fbbf24', size: 0.06, speed: 1.5, radius: 1.2 };
    case 'focus':
    case 'curious':
      return { color: '#22d3ee', size: 0.05, speed: 0.8, radius: 1 };
    case 'frustrated':
    case 'stressed':
      return { color: '#ef4444', size: 0.07, speed: 2, radius: 1.4 };
    case 'bored':
      return { color: '#6b7280', size: 0.04, speed: 0.3, radius: 0.8 };
    case 'calm':
      return { color: '#34d399', size: 0.05, speed: 0.5, radius: 1 };
    default:
      return { color: '#a78bfa', size: 0.04, speed: 0.6, radius: 0.9 };
  }
}

export default function MoodParticles() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const mood = useGameStore((s) => s.agent?.mood ?? 'neutral');
  const config = getMoodConfig(mood);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phases = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => (i / PARTICLE_COUNT) * Math.PI * 2),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * config.speed;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = phases[i];
      const r = config.radius + Math.sin(t * 0.5 + phase * 3) * 0.2;
      dummy.position.set(
        Math.cos(t + phase) * r,
        1.5 + Math.sin(t * 1.5 + phase) * 0.5,
        Math.sin(t + phase) * r,
      );
      dummy.scale.setScalar(config.size * (10 + Math.sin(t * 2 + phase) * 3));
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={config.color} transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
}
