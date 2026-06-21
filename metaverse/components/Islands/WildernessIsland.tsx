'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const FIREFLY_COUNT = 10;
const TREE_COUNT = 25;

function Trees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopy1Ref = useRef<THREE.InstancedMesh>(null);
  const canopy2Ref = useRef<THREE.InstancedMesh>(null);

  const treeData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(42);
    const trunks: THREE.Matrix4[] = [];
    const caps1: THREE.Matrix4[] = [];
    const caps2: THREE.Matrix4[] = [];

    for (let i = 0; i < TREE_COUNT; i++) {
      const angle = r() * Math.PI * 2;
      const dist = 3 + r() * 18;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const h = 3 + r() * 4;

      dummy.position.set(x, h * 0.3, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      trunks.push(dummy.matrix.clone());

      dummy.position.set(x, h * 0.7, z);
      dummy.scale.set(h * 0.3, h * 0.5, h * 0.3);
      dummy.updateMatrix();
      caps1.push(dummy.matrix.clone());

      dummy.position.set(x, h * 0.85, z);
      dummy.scale.set(h * 0.2, h * 0.3, h * 0.2);
      dummy.updateMatrix();
      caps2.push(dummy.matrix.clone());
    }
    return { trunks, caps1, caps2 };
  }, []);

  return (
    <>
      <instancedMesh args={[undefined, undefined, TREE_COUNT]} castShadow
        onUpdate={(self) => { treeData.trunks.forEach((m, i) => self.setMatrixAt(i, m)); self.instanceMatrix.needsUpdate = true; }}>
        <cylinderGeometry args={[0.15, 0.25, 2, 6]} />
        <meshStandardMaterial color="#4a2f0a" roughness={0.9} />
      </instancedMesh>
      <instancedMesh args={[undefined, undefined, TREE_COUNT]} castShadow
        onUpdate={(self) => { treeData.caps1.forEach((m, i) => self.setMatrixAt(i, m)); self.instanceMatrix.needsUpdate = true; }}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#059669" roughness={0.7} emissive="#034525" emissiveIntensity={0.15} />
      </instancedMesh>
      <instancedMesh args={[undefined, undefined, TREE_COUNT]} castShadow
        onUpdate={(self) => { treeData.caps2.forEach((m, i) => self.setMatrixAt(i, m)); self.instanceMatrix.needsUpdate = true; }}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#065f46" roughness={0.7} emissive="#022c20" emissiveIntensity={0.15} />
      </instancedMesh>
    </>
  );
}

function Fireflies() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const config = useMemo(() => {
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(99);
    return Array.from({ length: FIREFLY_COUNT }, (_, i) => {
      const angle = (i / FIREFLY_COUNT) * Math.PI * 2;
      const dist = 5 + r() * 12;
      return {
        x: Math.cos(angle) * dist,
        y: 2 + r() * 3,
        z: Math.sin(angle) * dist,
        speed: 0.5 + r() * 0.5,
        radius: 1 + r() * 2,
        offset: r() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const c = config[i];
      const t = clock.elapsedTime * c.speed + c.offset;
      dummy.position.set(
        c.x + Math.sin(t) * c.radius,
        c.y + Math.sin(t * 1.5) * 0.5,
        c.z + Math.cos(t) * c.radius,
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FIREFLY_COUNT]}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={4} />
    </instancedMesh>
  );
}

export default function WildernessIsland() {
  const pos: [number, number, number] = [-60, 0, 60];

  return (
    <group position={pos}>
      <Trees />
      <Fireflies />
      <Sparkles count={30} scale={[35, 10, 35]} size={1.5} speed={0.3} color="#34d399" opacity={0.4} />

      {[[10, 0, 8], [-12, 0, -5], [5, 0, -15]].map((p, i) => (
        <Float key={i} speed={1.5} floatIntensity={0.1}>
          <group position={p as [number, number, number]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.5]} />
              <meshStandardMaterial color="#b45309" emissive="#fbbf24" emissiveIntensity={0.8} roughness={0.6} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[0.85, 0.15, 0.55]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
          </group>
        </Float>
      ))}

      <group position={[0, 0, 15]}>
        <Float speed={1} floatIntensity={0.2}>
          <mesh position={[0, 3, 0]}>
            <torusGeometry args={[2.5, 0.15, 8, 24]} />
            <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={3} roughness={0.1} metalness={0.5} />
          </mesh>
        </Float>
        <mesh position={[0, 3, 0]}>
          <circleGeometry args={[2.3, 24]} />
          <meshStandardMaterial
            color="#002010"
            emissive="#065f46"
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Sparkles count={20} scale={[5, 5, 2]} size={2} speed={0.6} color="#34d399" opacity={0.5} position={[0, 3, 0]} />
        <Text position={[0, 6, 0]} fontSize={0.5} color="#34d399" anchorX="center">
          Secret Vault
        </Text>
      </group>
    </group>
  );
}
