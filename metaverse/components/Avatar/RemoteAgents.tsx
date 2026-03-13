'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMultiplayerStore } from '@/stores/multiplayerStore';

function RemoteAvatar({
  name,
  position,
  rotation,
  dopamineLevel,
  mood,
}: {
  name: string;
  position: [number, number, number];
  rotation: number;
  dopamineLevel: number;
  mood: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(...position));
  const targetRot = useRef(rotation);

  targetPos.current.set(...position);
  targetRot.current = rotation;

  const auraColor = useMemo(() => {
    if (dopamineLevel > 80) return '#fbbf24';
    if (dopamineLevel > 60) return '#a78bfa';
    if (dopamineLevel > 40) return '#7c3aed';
    return '#ef4444';
  }, [dopamineLevel]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(targetPos.current, 8 * delta);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRot.current,
      8 * delta,
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.15, 2.2, 0.35]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.15, 2.2, 0.35]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>

      {/* Aura */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Name */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color="#e0e0ff"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
}

export default function RemoteAgents() {
  const agents = useMultiplayerStore((s) => s.remoteAgents);

  return (
    <>
      {Object.values(agents).map((a) => (
        <RemoteAvatar
          key={a.agentId}
          name={a.name}
          position={a.position}
          rotation={a.rotation}
          dopamineLevel={a.dopamineLevel}
          mood={a.mood}
        />
      ))}
    </>
  );
}
