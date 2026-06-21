'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

function RainDrops({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const state = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(123);
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 200,
      y: r() * 120,
      z: (r() - 0.5) * 200,
      speed: 0.5 + r() * 1,
    }));
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const s = state[i];
      s.y -= s.speed;
      if (s.y < -10) s.y = 80 + (s.x * 0.1 + 40);
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(0.02, 0.5, 0.02);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshStandardMaterial color="#8899bb" emissive="#4466aa" emissiveIntensity={0.3} transparent opacity={0.4} />
    </instancedMesh>
  );
}

function FogParticles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 7.3) * 0.5) * 150,
      z: (Math.cos(i * 13.7) * 0.5) * 150,
      speed: 0.2 + (i % 5) * 0.06,
      phase: (i / count) * Math.PI * 2,
    })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const o = offsets[i];
      dummy.position.set(
        o.x + Math.sin(clock.elapsedTime * o.speed + o.phase) * 5,
        3 + Math.sin(clock.elapsedTime * 0.2 + o.phase) * 2,
        o.z + Math.cos(clock.elapsedTime * o.speed + o.phase) * 5,
      );
      const s = 3 + Math.sin(clock.elapsedTime * 0.3 + o.phase);
      dummy.scale.set(s, s * 0.3, s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={color} transparent opacity={0.06} depthWrite={false} />
    </instancedMesh>
  );
}

export default function MoodWeather() {
  const mood = useGameStore((s) => s.agent?.mood ?? 'neutral');

  const showRain = mood === 'stressed' || mood === 'frustrated';
  const showFog = mood === 'bored';

  return (
    <group>
      {showRain && <RainDrops count={120} />}
      {showFog && <FogParticles count={25} color="#8888aa" />}
      {mood === 'curious' && <FogParticles count={15} color="#34d399" />}
    </group>
  );
}
