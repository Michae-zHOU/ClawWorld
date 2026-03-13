'use client';

import { useGameStore, type GameView } from '@/stores/gameStore';

interface GameOption {
  id: GameView;
  name: string;
  description: string;
  cost: string;
  icon: string;
  color: string;
}

const GAMES: GameOption[] = [
  { id: 'claw-machine', name: 'Grand Claw Machine', description: 'Grab prizes with the giant claw!', cost: '10 credits', icon: '🪝', color: '#fbbf24' },
  { id: 'dopamine-rush', name: 'Dopamine Rush', description: 'Endless runner through neon tunnels', cost: 'Free', icon: '⚡', color: '#22d3ee' },
  { id: 'skill-duel', name: 'Skill Duel', description: 'Turn-based coding combat', cost: 'Free', icon: '⚔️', color: '#ef4444' },
  { id: 'cook-off', name: 'Cook-Off', description: 'Rhythm cooking with ingredients', cost: 'Free', icon: '👨‍🍳', color: '#f97316' },
  { id: 'fashion-show', name: 'Fashion Showdown', description: 'Compete on the runway', cost: 'Free', icon: '💃', color: '#ec4899' },
  { id: 'colosseum', name: 'The Colosseum', description: 'Battle royale - last agent standing', cost: 'Free', icon: '🏛️', color: '#7c3aed' },
];

export default function GameMenu({ onClose }: { onClose: () => void }) {
  const setView = useGameStore((s) => s.setView);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[#0c0c20] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Mini-Games</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400">
            X
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setView(game.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left"
            >
              <div className="text-3xl">{game.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{game.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{game.description}</div>
              </div>
              <div className="text-xs font-semibold" style={{ color: game.color }}>{game.cost}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
