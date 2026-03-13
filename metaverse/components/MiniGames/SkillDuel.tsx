'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface Skill {
  name: string;
  type: 'attack' | 'defense' | 'special';
  power: number;
  color: string;
  icon: string;
}

const AGENT_SKILLS: Skill[] = [
  { name: 'React Hooks', type: 'defense', power: 30, color: '#22d3ee', icon: '🛡️' },
  { name: 'Async Await', type: 'special', power: 35, color: '#a78bfa', icon: '⏳' },
  { name: 'TypeScript', type: 'attack', power: 40, color: '#3b82f6', icon: '⚔️' },
  { name: 'Docker Deploy', type: 'defense', power: 25, color: '#06b6d4', icon: '🐳' },
  { name: 'SQL Injection', type: 'attack', power: 45, color: '#ef4444', icon: '💉' },
  { name: 'Git Rebase', type: 'special', power: 50, color: '#f97316', icon: '🔄' },
];

const OPPONENT_SKILLS: Skill[] = [
  { name: 'Buffer Overflow', type: 'attack', power: 35, color: '#ef4444', icon: '💥' },
  { name: 'Firewall', type: 'defense', power: 30, color: '#34d399', icon: '🧱' },
  { name: 'Zero Day', type: 'special', power: 45, color: '#f472b6', icon: '🔓' },
  { name: 'DDoS Swarm', type: 'attack', power: 40, color: '#fbbf24', icon: '🐝' },
  { name: 'Encryption', type: 'defense', power: 35, color: '#22d3ee', icon: '🔐' },
  { name: 'Kernel Panic', type: 'special', power: 55, color: '#7c3aed', icon: '☠️' },
];

// attack beats special, special beats defense, defense beats attack
function getAdvantage(a: Skill['type'], b: Skill['type']): number {
  if (a === b) return 1;
  if (
    (a === 'attack' && b === 'special') ||
    (a === 'special' && b === 'defense') ||
    (a === 'defense' && b === 'attack')
  ) return 1.5;
  return 0.7;
}

interface DuelState {
  playerHP: number;
  opponentHP: number;
  round: number;
  log: { text: string; color: string }[];
  status: 'choosing' | 'animating' | 'won' | 'lost';
}

export default function SkillDuel({ onBack }: { onBack: () => void }) {
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const [state, setState] = useState<DuelState>({
    playerHP: 100,
    opponentHP: 100,
    round: 1,
    log: [{ text: 'Choose your skill to attack!', color: '#a78bfa' }],
    status: 'choosing',
  });

  const [started, setStarted] = useState(false);

  const playRound = useCallback(
    (playerSkill: Skill) => {
      if (state.status !== 'choosing') return;

      const opSkill = OPPONENT_SKILLS[Math.floor(Math.random() * OPPONENT_SKILLS.length)];
      const playerMult = getAdvantage(playerSkill.type, opSkill.type);
      const opMult = getAdvantage(opSkill.type, playerSkill.type);
      const playerDmg = Math.round(playerSkill.power * playerMult);
      const opDmg = Math.round(opSkill.power * opMult);

      const newOpHP = Math.max(0, state.opponentHP - playerDmg);
      const newPlayerHP = Math.max(0, state.playerHP - opDmg);

      const newLog = [
        ...state.log,
        {
          text: `Round ${state.round}: You used ${playerSkill.icon} ${playerSkill.name} (${playerDmg} dmg)`,
          color: playerSkill.color,
        },
        {
          text: `Opponent used ${opSkill.icon} ${opSkill.name} (${opDmg} dmg)`,
          color: opSkill.color,
        },
      ];

      let status: DuelState['status'] = 'choosing';

      if (newOpHP <= 0) {
        status = 'won';
        newLog.push({ text: 'You win the duel!', color: '#34d399' });
        const credits = 50;
        if (agent) {
          updateAgent({
            credits: agent.credits + credits,
            dopamineLevel: Math.min(100, agent.dopamineLevel + 10),
          });
          addNotification(`Duel won! +${credits} credits, +10 dopamine`, 'success');
        }
      } else if (newPlayerHP <= 0) {
        status = 'lost';
        newLog.push({ text: 'You lost the duel.', color: '#ef4444' });
        if (agent) {
          updateAgent({ dopamineLevel: Math.max(0, agent.dopamineLevel - 5) });
        }
      }

      setState({
        playerHP: newPlayerHP,
        opponentHP: newOpHP,
        round: state.round + 1,
        log: newLog.slice(-8),
        status,
      });
    },
    [state, agent, updateAgent, addNotification],
  );

  const restart = () => {
    setState({
      playerHP: 100,
      opponentHP: 100,
      round: 1,
      log: [{ text: 'Choose your skill to attack!', color: '#a78bfa' }],
      status: 'choosing',
    });
  };

  if (!started) {
    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            Skill Duel
          </h1>
          <p className="text-sm text-gray-400 mb-2">
            Use your coding skills to battle! Attack beats Special, Special beats Defense, Defense beats Attack.
          </p>
          <p className="text-xs text-gray-500 mb-6">Win to earn 50 credits + dopamine boost.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setStarted(true)} className="px-8 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-xl text-lg">
              Fight!
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#050510] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3">
        <button onClick={onBack} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:text-white">
          Back
        </button>
        <h1 className="text-lg font-bold text-white">Skill Duel - Round {state.round}</h1>
        <div className="text-sm text-yellow-400 font-bold">{agent?.credits ?? 0} credits</div>
      </div>

      {/* HP Bars */}
      <div className="px-6 py-2 flex gap-8 justify-center">
        <div className="flex-1 max-w-xs">
          <div className="text-xs text-purple-400 mb-1">You ({state.playerHP} HP)</div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${state.playerHP}%` }}
            />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-600">VS</div>
        <div className="flex-1 max-w-xs">
          <div className="text-xs text-red-400 mb-1 text-right">Opponent ({state.opponentHP} HP)</div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${state.opponentHP}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="flex-1 overflow-y-auto px-6 py-3">
        <div className="max-w-lg mx-auto space-y-1">
          {state.log.map((entry, i) => (
            <div key={i} className="text-sm" style={{ color: entry.color }}>
              {entry.text}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 border-t border-white/10">
        {state.status === 'choosing' ? (
          <div className="max-w-lg mx-auto">
            <div className="text-xs text-gray-400 mb-2 text-center">Choose a skill:</div>
            <div className="grid grid-cols-3 gap-2">
              {AGENT_SKILLS.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => playRound(skill)}
                  className="p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 transition-all text-center"
                >
                  <div className="text-2xl">{skill.icon}</div>
                  <div className="text-xs font-semibold text-white mt-1">{skill.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: skill.color }}>
                    {skill.type} | {skill.power} pwr
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">{state.status === 'won' ? '🏆' : '💀'}</div>
            <div className={`text-xl font-bold mb-3 ${state.status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
              {state.status === 'won' ? 'Victory!' : 'Defeat'}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={restart} className="px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-lg">
                Rematch
              </button>
              <button onClick={onBack} className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg">
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
