'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  isPlayer: boolean;
  alive: boolean;
}

function createBots(count: number): Fighter[] {
  const names = ['ShadowByte', 'NeonPulse', 'VoidCrawler', 'IronStack', 'DataHawk', 'CryptoFang', 'PixelWolf', 'CodeWraith'];
  return names.slice(0, count).map((name) => ({
    name,
    hp: 60 + Math.floor(Math.random() * 40),
    maxHp: 100,
    power: 15 + Math.floor(Math.random() * 15),
    isPlayer: false,
    alive: true,
  }));
}

export default function Colosseum({ onBack }: { onBack: () => void }) {
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const [phase, setPhase] = useState<'lobby' | 'battle' | 'results'>('lobby');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [round, setRound] = useState(1);
  const [log, setLog] = useState<{ text: string; color: string }[]>([]);
  const [playerAction, setPlayerAction] = useState<'idle' | 'attack' | 'defend' | 'special'>('idle');

  const startBattle = () => {
    const bots = createBots(7);
    const player: Fighter = {
      name: agent?.name ?? 'You',
      hp: 100,
      maxHp: 100,
      power: 25,
      isPlayer: true,
      alive: true,
    };
    setFighters([player, ...bots]);
    setRound(1);
    setLog([{ text: 'The Colosseum battle begins! 8 fighters enter.', color: '#fbbf24' }]);
    setPhase('battle');
  };

  const processRound = useCallback(
    (action: 'attack' | 'defend' | 'special') => {
      setPlayerAction(action);
      const updated = [...fighters];
      const alive = updated.filter((f) => f.alive);

      if (alive.length <= 1) {
        setPhase('results');
        return;
      }

      const newLog: { text: string; color: string }[] = [];
      newLog.push({ text: `--- Round ${round} ---`, color: '#6b7280' });

      const player = updated.find((f) => f.isPlayer && f.alive);
      if (player) {
        const targets = alive.filter((f) => !f.isPlayer);
        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          let dmg = player.power;
          if (action === 'attack') dmg = Math.round(dmg * 1.3);
          if (action === 'special') dmg = Math.round(dmg * 1.8 * (Math.random() > 0.5 ? 1 : 0.3));

          target.hp -= dmg;
          newLog.push({ text: `You ${action} ${target.name} for ${dmg} dmg!`, color: '#7c3aed' });
          if (target.hp <= 0) {
            target.alive = false;
            newLog.push({ text: `${target.name} eliminated!`, color: '#ef4444' });
          }
        }
      }

      const botsAlive = alive.filter((f) => !f.isPlayer && f.alive);
      for (const bot of botsAlive) {
        const possibleTargets = updated.filter((f) => f.alive && f !== bot);
        if (possibleTargets.length === 0) break;
        const target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        let dmg = bot.power;
        if (action === 'defend' && target.isPlayer) dmg = Math.round(dmg * 0.5);
        target.hp -= dmg;
        if (target.isPlayer) {
          newLog.push({ text: `${bot.name} hits you for ${dmg} dmg!`, color: '#ef4444' });
        }
        if (target.hp <= 0) {
          target.alive = false;
          if (target.isPlayer) {
            newLog.push({ text: 'You have been eliminated!', color: '#ef4444' });
          } else {
            newLog.push({ text: `${target.name} eliminated!`, color: '#6b7280' });
          }
        }
      }

      const remainingAlive = updated.filter((f) => f.alive);
      if (remainingAlive.length <= 1 || !updated.find((f) => f.isPlayer && f.alive)) {
        setPhase('results');
      }

      setFighters(updated);
      setLog((prev) => [...prev.slice(-10), ...newLog]);
      setRound((r) => r + 1);
      setPlayerAction('idle');
    },
    [fighters, round],
  );

  useEffect(() => {
    if (phase !== 'results') return;
    const player = fighters.find((f) => f.isPlayer);
    const aliveCount = fighters.filter((f) => f.alive).length;
    const rank = player?.alive ? 1 : fighters.filter((f) => !f.alive).findIndex((f) => f.isPlayer) + aliveCount + 1;

    const credits = rank === 1 ? 100 : rank <= 3 ? 50 : 15;
    const dopBoost = rank === 1 ? 15 : rank <= 3 ? 8 : 3;

    if (agent) {
      updateAgent({
        credits: agent.credits + credits,
        dopamineLevel: Math.min(100, agent.dopamineLevel + dopBoost),
      });
      addNotification(`Colosseum: Rank #${rank}! +${credits} credits`, rank <= 3 ? 'success' : 'info');
    }
  }, [phase, fighters, agent, updateAgent, addNotification]);

  if (phase === 'lobby') {
    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            The Colosseum
          </h1>
          <p className="text-sm text-gray-400 mb-2">8 agents enter. Only 1 survives.</p>
          <p className="text-xs text-gray-500 mb-6">Battle Royale with shrinking health. Top 3 earn major rewards.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={startBattle} className="px-8 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-xl text-lg">
              Enter Arena
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl">Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const player = fighters.find((f) => f.isPlayer);
    const aliveAtEnd = fighters.filter((f) => f.alive);
    const rank = player?.alive ? 1 : fighters.filter((f) => !f.alive).findIndex((f) => f.isPlayer) + aliveAtEnd.length + 1;

    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-5xl mb-4">{rank === 1 ? '🏆' : rank <= 3 ? '🥈' : '💀'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {rank === 1 ? 'CHAMPION!' : rank <= 3 ? `Rank #${rank}` : 'Eliminated'}
          </h2>
          <div className="text-sm text-yellow-400 mb-6">
            +{rank === 1 ? 100 : rank <= 3 ? 50 : 15} credits
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startBattle} className="px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-lg">
              Fight Again
            </button>
            <button onClick={onBack} className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg">Exit</button>
          </div>
        </div>
      </div>
    );
  }

  const player = fighters.find((f) => f.isPlayer);
  const aliveCount = fighters.filter((f) => f.alive).length;

  return (
    <div className="w-screen h-screen bg-[#050510] flex flex-col">
      <div className="flex items-center justify-between p-3">
        <button onClick={onBack} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300">
          Forfeit
        </button>
        <h1 className="text-lg font-bold text-white">Round {round} | {aliveCount} alive</h1>
        <div className="text-sm text-yellow-400 font-bold">{agent?.credits ?? 0}c</div>
      </div>

      {/* Fighter status */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          {fighters.map((f, i) => (
            <div key={i} className={`px-2 py-1.5 rounded-lg text-center ${f.alive ? 'bg-white/5' : 'bg-red-900/20 opacity-40'} ${f.isPlayer ? 'border border-purple-500/30' : ''}`}>
              <div className={`text-xs font-semibold truncate ${f.isPlayer ? 'text-purple-400' : 'text-gray-300'}`}>{f.name}</div>
              <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${f.hp > 50 ? 'bg-green-500' : f.hp > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.max(0, (f.hp / f.maxHp) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">{f.alive ? `${f.hp}hp` : 'KO'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-md mx-auto space-y-0.5">
          {log.map((entry, i) => (
            <div key={i} className="text-xs" style={{ color: entry.color }}>{entry.text}</div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {player?.alive && (
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => processRound('attack')}
              className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-all"
            >
              ⚔️ Attack (1.3x dmg)
            </button>
            <button
              onClick={() => processRound('defend')}
              className="px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold rounded-xl hover:bg-blue-500/30 transition-all"
            >
              🛡️ Defend (0.5x taken)
            </button>
            <button
              onClick={() => processRound('special')}
              className="px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold rounded-xl hover:bg-yellow-500/30 transition-all"
            >
              ⚡ Special (risky 1.8x)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
