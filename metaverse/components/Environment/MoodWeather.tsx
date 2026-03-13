'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

function RainDrops({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const speeds = useMemo(() => Array.from({ length: count }, () => 0.5 + Math.random() * 1), [count]);

  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 200,
        ref.current.userData[`y${i}`] ?? 80,
        (Math.random() - 0.5) * 200,
      );
      const y = (ref.current.userData[`y${i}`] ?? 80 + Math.random() * 40) - speeds[i];
      ref.current.userData[`y${i}`] = y < -10 ? 80 + Math.random() * 40 : y;
      dummy.position.y = ref.current.userData[`y${i}`];
      dummy.scale.set(0.02, 0.5, 0.02);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshBasicMaterial color="#6680aa" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function FogParticles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 150, z: (Math.random() - 0.5) * 150, speed: 0.2 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2 })),
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
      <meshBasicMaterial color={color} transparent opacity={0.05} />
    </instancedMesh>
  );
}

export default function MoodWeather() {
  const mood = useGameStore((s) => s.agent?.mood ?? 'neutral');

  const showRain = mood === 'stressed' || mood === 'frustrated';
  const showFog = mood === 'bored';
  const fogColor = mood === 'curious' ? '#34d399' : '#8888aa';

  return (
    <group>
      {showRain && <RainDrops count={300} />}
      {showFog && <FogParticles count={40} color={fogColor} />}
      {mood === 'curious' && <FogParticles count={20} color="#34d399" />}
    </group>
  );
}
