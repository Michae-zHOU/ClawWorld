'use client';

import { Sky, Stars, Environment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import AgentAvatar from './Avatar/AgentAvatar';
import IslandMesh from './Islands/IslandMesh';
import Skywalk from './Islands/Skywalk';
import CentralPlaza from './Islands/CentralPlaza';
import PharmacyIsland from './Islands/PharmacyIsland';
import FoodCourtIsland from './Islands/FoodCourtIsland';
import SkillArenaIsland from './Islands/SkillArenaIsland';
import FashionBoulevard from './Islands/FashionBoulevard';
import ArcadeIsland from './Islands/ArcadeIsland';
import WildernessIsland from './Islands/WildernessIsland';
import DopamineAurora from './Environment/DopamineAurora';
import MoodWeather from './Environment/MoodWeather';
import RemoteAgents from './Avatar/RemoteAgents';
import { ISLANDS, SKYWALKS } from '@/lib/world-config';
import { useGameStore } from '@/stores/gameStore';

function VoidPlane() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (mesh.current) {
      (mesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        color="#0a0020"
        emissive="#1a0040"
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Lighting() {
  const agent = useGameStore((s) => s.agent);
  const dopamine = agent?.dopamineLevel ?? 50;
  const intensity = 0.5 + (dopamine / 100) * 0.5;

  return (
    <>
      <ambientLight intensity={0.3} color="#b8c0ff" />
      <directionalLight
        position={[50, 80, 30]}
        intensity={intensity}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <pointLight position={[0, 30, 0]} intensity={0.8} color="#7c3aed" distance={100} />
    </>
  );
}

export default function World() {
  const islandMap = useMemo(() => {
    const map: Record<string, [number, number, number]> = {};
    for (const island of ISLANDS) {
      map[island.id] = island.position;
    }
    return map;
  }, []);

  return (
    <>
      <Lighting />
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.52}
        azimuth={0.25}
        mieCoefficient={0.005}
        rayleigh={0.5}
      />
      <Stars radius={200} depth={100} count={5000} factor={4} saturation={0.5} fade speed={1} />
      <Environment preset="night" />

      <DopamineAurora />
      <MoodWeather />
      <VoidPlane />

      {/* Islands */}
      {ISLANDS.map((island) => (
        <IslandMesh key={island.id} config={island} />
      ))}

      {/* Island-specific decorations */}
      <CentralPlaza />
      <PharmacyIsland />
      <FoodCourtIsland />
      <SkillArenaIsland />
      <FashionBoulevard />
      <ArcadeIsland />
      <WildernessIsland />

      {/* Skywalks */}
      {SKYWALKS.map((sw) => (
        <Skywalk
          key={`${sw.from}-${sw.to}`}
          from={islandMap[sw.from]}
          to={islandMap[sw.to]}
        />
      ))}

      {/* Player Avatar */}
      <AgentAvatar />
      <RemoteAgents />
    </>
  );
}
