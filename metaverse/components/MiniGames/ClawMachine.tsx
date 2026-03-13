'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

const PRIZES = [
  { name: 'Dopamine Token', color: '#fbbf24', rarity: 'common', reward: 10 },
  { name: '50 Credits', color: '#22d3ee', rarity: 'common', reward: 50 },
  { name: 'Rare Skin Fragment', color: '#ec4899', rarity: 'rare', reward: 25 },
  { name: 'Focus Elixir', color: '#34d399', rarity: 'uncommon', reward: 15 },
  { name: 'XP Boost', color: '#a78bfa', rarity: 'uncommon', reward: 20 },
  { name: 'Legendary Claw', color: '#ef4444', rarity: 'legendary', reward: 100 },
  { name: 'Energy Food Pack', color: '#f97316', rarity: 'common', reward: 10 },
  { name: 'Mystery Box', color: '#6366f1', rarity: 'rare', reward: 40 },
];

function PrizeBall({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RigidBody position={position} colliders="ball" restitution={0.5} friction={0.8}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.3} metalness={0.5} />
      </mesh>
    </RigidBody>
  );
}

function Claw({
  posX,
  posZ,
  dropping,
  onGrab,
}: {
  posX: number;
  posZ: number;
  dropping: boolean;
  onGrab: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const dropPhase = useRef(0);
  const grabbed = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, posX, 8 * delta);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, posZ, 8 * delta);

    if (dropping) {
      if (dropPhase.current < 1) {
        dropPhase.current += delta * 0.8;
        groupRef.current.position.y = 4 - dropPhase.current * 3;
      } else if (dropPhase.current < 2) {
        dropPhase.current += delta * 0.8;
        groupRef.current.position.y = 1 + (dropPhase.current - 1) * 3;
        if (!grabbed.current) {
          grabbed.current = true;
          onGrab();
        }
      }
    } else {
      groupRef.current.position.y = 4;
      dropPhase.current = 0;
      grabbed.current = false;
    }
  });

  return (
    <group ref={groupRef} position={[0, 4, 0]}>
      {/* Arm */}
      <mesh>
        <boxGeometry args={[0.15, 2, 0.15]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Prongs */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        const open = dropping && dropPhase.current < 1 ? 0.4 : 0.15;
        return (
          <mesh key={i} position={[Math.cos(angle) * open, -1.2, Math.sin(angle) * open]} rotation={[0.3 * (dropping ? 1 : 0.5), angle, 0]}>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function MachineBox() {
  return (
    <group>
      {/* Base */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[6, 1, 6]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
        </mesh>
      </RigidBody>
      {/* Walls */}
      {[
        { pos: [3, 2, 0] as [number, number, number], size: [0.2, 5, 6] as [number, number, number] },
        { pos: [-3, 2, 0] as [number, number, number], size: [0.2, 5, 6] as [number, number, number] },
        { pos: [0, 2, 3] as [number, number, number], size: [6, 5, 0.2] as [number, number, number] },
        { pos: [0, 2, -3] as [number, number, number], size: [6, 5, 0.2] as [number, number, number] },
      ].map((wall, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh position={wall.pos}>
            <boxGeometry args={wall.size} />
            <meshStandardMaterial color="#0a0a1a" transparent opacity={0.3} roughness={0} metalness={1} />
          </mesh>
        </RigidBody>
      ))}
      {/* Rail for claw */}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[6.5, 0.3, 6.5]} />
        <meshStandardMaterial color="#2a2a4e" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

function ClawScene({ clawX, clawZ, dropping, onGrab }: { clawX: number; clawZ: number; dropping: boolean; onGrab: () => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 6, 0]} intensity={0.6} color="#fbbf24" distance={12} />
      <Environment preset="night" />

      <Physics gravity={[0, -15, 0]}>
        <MachineBox />
        <Claw posX={clawX} posZ={clawZ} dropping={dropping} onGrab={onGrab} />

        {/* Prize balls */}
        {PRIZES.map((prize, i) => {
          const angle = (i / PRIZES.length) * Math.PI * 2;
          const r = 1 + Math.random() * 1;
          return (
            <PrizeBall
              key={i}
              position={[Math.cos(angle) * r, 1 + i * 0.5, Math.sin(angle) * r]}
              color={prize.color}
            />
          );
        })}
      </Physics>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        target={[0, 2, 0]}
      />
    </>
  );
}

export default function ClawMachine({ onBack }: { onBack: () => void }) {
  const [clawX, setClawX] = useState(0);
  const [clawZ, setClawZ] = useState(0);
  const [dropping, setDropping] = useState(false);
  const [result, setResult] = useState<typeof PRIZES[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const PLAY_COST = 10;

  const startGame = () => {
    if (!agent || agent.credits < PLAY_COST) {
      addNotification('Not enough credits!', 'warning');
      return;
    }
    updateAgent({ credits: agent.credits - PLAY_COST });
    setPlaying(true);
    setResult(null);
  };

  const handleDrop = () => {
    if (dropping) return;
    setDropping(true);
  };

  const handleGrab = useCallback(() => {
    const roll = Math.random();
    let prize: typeof PRIZES[number];
    if (roll < 0.05) {
      prize = PRIZES.find((p) => p.rarity === 'legendary')!;
    } else if (roll < 0.2) {
      const rares = PRIZES.filter((p) => p.rarity === 'rare');
      prize = rares[Math.floor(Math.random() * rares.length)];
    } else if (roll < 0.5) {
      const uncommons = PRIZES.filter((p) => p.rarity === 'uncommon');
      prize = uncommons[Math.floor(Math.random() * uncommons.length)];
    } else {
      const commons = PRIZES.filter((p) => p.rarity === 'common');
      prize = commons[Math.floor(Math.random() * commons.length)];
    }
    setResult(prize);
    updateAgent({ credits: (agent?.credits ?? 0) + prize.reward, dopamineLevel: Math.min(100, (agent?.dopamineLevel ?? 50) + 5) });
    addNotification(`Won: ${prize.name}! +${prize.reward} credits`, 'success');

    setTimeout(() => {
      setDropping(false);
      setPlaying(false);
    }, 2500);
  }, [agent, updateAgent, addNotification]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (dropping) return;
      const step = 0.5;
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setClawX((x) => Math.max(-2.2, x - step));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setClawX((x) => Math.min(2.2, x + step));
          break;
        case 'ArrowUp':
        case 'KeyW':
          setClawZ((z) => Math.max(-2.2, z - step));
          break;
        case 'ArrowDown':
        case 'KeyS':
          setClawZ((z) => Math.min(2.2, z + step));
          break;
        case 'Space':
          handleDrop();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing, dropping]);

  return (
    <div className="relative w-screen h-screen bg-[#050510]">
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 50 }}>
        <ClawScene clawX={clawX} clawZ={clawZ} dropping={dropping} onGrab={handleGrab} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top bar */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-auto">
          <button onClick={onBack} className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            Back to World
          </button>
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-sm">
            <span className="text-yellow-400 font-bold">{agent?.credits ?? 0}</span>
            <span className="text-gray-400 ml-1">credits</span>
          </div>
        </div>

        {/* Center title */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Grand Claw Machine
          </h1>
          <p className="text-xs text-gray-400 mt-1">{PLAY_COST} credits per play</p>
        </div>

        {/* Result popup */}
        {result && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center pointer-events-auto">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-xl font-bold text-white">{result.name}</div>
            <div className="text-sm mt-1" style={{ color: result.color }}>
              {result.rarity.toUpperCase()}
            </div>
            <div className="text-yellow-400 font-bold mt-2">+{result.reward} credits</div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
          {!playing ? (
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-400 hover:to-pink-400 text-white font-bold rounded-xl text-lg transition-all"
            >
              Play ({PLAY_COST} credits)
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <button onClick={() => !dropping && setClawZ((z) => Math.max(-2.2, z - 0.5))} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20">W</button>
                  <div />
                  <button onClick={() => !dropping && setClawX((x) => Math.max(-2.2, x - 0.5))} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20">A</button>
                  <button onClick={() => !dropping && setClawZ((z) => Math.min(2.2, z + 0.5))} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20">S</button>
                  <button onClick={() => !dropping && setClawX((x) => Math.min(2.2, x + 0.5))} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20">D</button>
                </div>
                <button
                  onClick={handleDrop}
                  disabled={dropping}
                  className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-red-500 rounded-2xl text-white font-bold text-lg disabled:opacity-50 transition-all hover:scale-105"
                >
                  DROP!
                </button>
              </div>
              <p className="text-[10px] text-gray-500">WASD to move, Space to drop</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
