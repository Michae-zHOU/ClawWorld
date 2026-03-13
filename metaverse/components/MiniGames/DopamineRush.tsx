'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

const LANE_POSITIONS = [-2, 0, 2];
const SPEED_INITIAL = 15;
const SPEED_INCREMENT = 0.5;

interface Obstacle {
  id: number;
  lane: number;
  z: number;
  type: 'wall' | 'orb';
}

function NeonTunnel() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 2 + i * 0.5) * 0.2;
      });
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 3, -i * 8]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[5, 0.08, 4, 4]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#22d3ee' : '#f472b6'}
            emissive={i % 2 === 0 ? '#22d3ee' : '#f472b6'}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Runner({ lane }: { lane: number }) {
  const ref = useRef<THREE.Group>(null);
  const targetX = LANE_POSITIONS[lane];

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 12 * delta);
    }
  });

  return (
    <group ref={ref} position={[targetX, 0.8, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.2} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#7c3aed" distance={4} />
    </group>
  );
}

function ObstacleObj({ obstacle, speed, onPass, onCollect, playerLane }: {
  obstacle: Obstacle;
  speed: number;
  onPass: (id: number) => void;
  onCollect: (id: number) => void;
  playerLane: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const passed = useRef(false);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.z += speed * delta;

    if (ref.current.position.z > 2 && !passed.current) {
      passed.current = true;
      if (obstacle.type === 'orb' && obstacle.lane === playerLane) {
        onCollect(obstacle.id);
      } else if (obstacle.type === 'wall' && obstacle.lane === playerLane) {
        onPass(obstacle.id);
      }
    }

    if (obstacle.type === 'orb') {
      ref.current.rotation.y += 2 * delta;
    }
  });

  if (obstacle.type === 'wall') {
    return (
      <mesh ref={ref} position={[LANE_POSITIONS[obstacle.lane], 1, obstacle.z]}>
        <boxGeometry args={[1.5, 2, 0.5]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} transparent opacity={0.8} />
      </mesh>
    );
  }

  return (
    <mesh ref={ref} position={[LANE_POSITIONS[obstacle.lane], 1, obstacle.z]}>
      <sphereGeometry args={[0.35, 12, 12]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
    </mesh>
  );
}

function Floor() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).map!.offset.y = clock.elapsedTime * 2;
    }
  });

  const texture = useRef((() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a0a20';
    ctx.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = '#1a1a4e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, i * 32);
      ctx.lineTo(64, i * 32);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 4);
    return t;
  })());

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]}>
      <planeGeometry args={[8, 120]} />
      <meshStandardMaterial map={texture.current} />
    </mesh>
  );
}

function GameScene({ lane, obstacles, speed, onHit, onCollect }: {
  lane: number;
  obstacles: Obstacle[];
  speed: number;
  onHit: (id: number) => void;
  onCollect: (id: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.2} color="#b8c0ff" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} />
      <Environment preset="night" />

      <NeonTunnel />
      <Floor />
      <Runner lane={lane} />

      {/* Lane dividers */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x, 0.01, -40]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 120]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {obstacles.map((obs) => (
        <ObstacleObj key={obs.id} obstacle={obs} speed={speed} onPass={onHit} onCollect={onCollect} playerLane={lane} />
      ))}
    </>
  );
}

export default function DopamineRush({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [lane, setLane] = useState(1);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [speed, setSpeed] = useState(SPEED_INITIAL);
  const obstacleId = useRef(0);
  const spawnInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLane(1);
    setObstacles([]);
    setSpeed(SPEED_INITIAL);
    obstacleId.current = 0;
  };

  const endGame = useCallback(() => {
    setGameState('over');
    if (spawnInterval.current) clearInterval(spawnInterval.current);
    const credits = Math.floor(score / 5);
    const dopBoost = Math.min(15, Math.floor(score / 10));
    if (agent && credits > 0) {
      updateAgent({
        credits: agent.credits + credits,
        dopamineLevel: Math.min(100, agent.dopamineLevel + dopBoost),
      });
      addNotification(`Dopamine Rush: +${credits} credits, +${dopBoost} dopamine!`, 'success');
    }
  }, [score, agent, updateAgent, addNotification]);

  const handleHit = useCallback(
    (id: number) => {
      endGame();
    },
    [endGame],
  );

  const handleCollect = useCallback((id: number) => {
    setScore((s) => s + 1);
    setObstacles((prev) => prev.filter((o) => o.id !== id));
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnInterval.current = setInterval(() => {
      const newObs: Obstacle[] = [];
      const wallLane = Math.floor(Math.random() * 3);
      newObs.push({ id: obstacleId.current++, lane: wallLane, z: -80, type: 'wall' });

      const orbLane = (wallLane + 1 + Math.floor(Math.random() * 2)) % 3;
      newObs.push({ id: obstacleId.current++, lane: orbLane, z: -80, type: 'orb' });

      setObstacles((prev) => [...prev.filter((o) => o.z < 10), ...newObs]);
      setSpeed((s) => s + SPEED_INCREMENT * 0.1);
    }, 800);

    return () => {
      if (spawnInterval.current) clearInterval(spawnInterval.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setLane((l) => Math.max(0, l - 1));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setLane((l) => Math.min(2, l + 1));
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState]);

  return (
    <div className="relative w-screen h-screen bg-[#050510]">
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 60 }}>
        <GameScene lane={lane} obstacles={obstacles} speed={speed} onHit={handleHit} onCollect={handleCollect} />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-auto">
          <button onClick={onBack} className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white">
            Back
          </button>
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
            <span className="text-2xl font-bold text-cyan-400">{score}</span>
            <span className="text-xs text-gray-400 ml-2">orbs</span>
          </div>
        </div>

        <h1 className="absolute top-14 left-1/2 -translate-x-1/2 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          Dopamine Rush
        </h1>

        {gameState === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-white mb-2">Dopamine Rush</h2>
              <p className="text-sm text-gray-400 mb-6">Collect orbs, dodge walls. A/D or Arrow keys to switch lanes.</p>
              <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-xl text-lg">
                START
              </button>
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">💥</div>
              <h2 className="text-2xl font-bold text-white mb-1">Game Over</h2>
              <div className="text-4xl font-bold text-cyan-400 mb-2">{score} orbs</div>
              <div className="text-sm text-yellow-400 mb-4">+{Math.floor(score / 5)} credits</div>
              <div className="flex gap-3">
                <button onClick={startGame} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold rounded-lg">
                  Retry
                </button>
                <button onClick={onBack} className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg">
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
            {[0, 1, 2].map((l) => (
              <button
                key={l}
                onClick={() => setLane(l)}
                className={`w-16 h-12 rounded-lg font-bold transition-all ${lane === l ? 'bg-cyan-500/30 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-500'} border`}
              >
                {['L', 'M', 'R'][l]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
