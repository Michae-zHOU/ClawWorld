'use client';

import { Sky, Stars, Environment, Float, Sparkles } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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

function VoidPlane() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.15 + Math.sin(clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
      <planeGeometry args={[800, 800, 1, 1]} />
      <meshStandardMaterial
        color="#050015"
        emissive="#1a0040"
        emissiveIntensity={0.15}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#8090cc" />
      <directionalLight
        position={[60, 100, 40]}
        intensity={1.0}
        color="#ffe8d0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.001}
      />
      <hemisphereLight args={['#7c3aed', '#050020', 0.4]} />
      <pointLight position={[0, 40, 0]} intensity={1.5} color="#7c3aed" distance={150} decay={2} />
    </>
  );
}

function WorldSparkles() {
  return (
    <>
      <Sparkles
        count={80}
        scale={[200, 60, 200]}
        size={3}
        speed={0.3}
        color="#a78bfa"
        opacity={0.4}
        position={[0, 30, 0]}
      />
      <Sparkles
        count={40}
        scale={[150, 40, 150]}
        size={2}
        speed={0.2}
        color="#22d3ee"
        opacity={0.3}
        position={[0, 20, 0]}
      />
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
        sunPosition={[100, 10, 100]}
        inclination={0.49}
        azimuth={0.25}
        mieCoefficient={0.005}
        rayleigh={0.3}
      />
      <Stars radius={300} depth={80} count={2000} factor={5} saturation={0.8} fade speed={0.5} />
      <Environment preset="night" background={false} />
      <fog attach="fog" args={['#080020', 80, 450]} />

      <DopamineAurora />
      <MoodWeather />
      <VoidPlane />
      <WorldSparkles />

      {ISLANDS.map((island) => (
        <IslandMesh key={island.id} config={island} />
      ))}

      <CentralPlaza />
      <PharmacyIsland />
      <FoodCourtIsland />
      <SkillArenaIsland />
      <FashionBoulevard />
      <ArcadeIsland />
      <WildernessIsland />

      {SKYWALKS.map((sw) => (
        <Skywalk
          key={`${sw.from}-${sw.to}`}
          from={islandMap[sw.from]}
          to={islandMap[sw.to]}
        />
      ))}

      <AgentAvatar />
      <RemoteAgents />
    </>
  );
}
