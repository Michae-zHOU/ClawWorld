'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

const SKINS = [
  { id: 'neon-knight', name: 'Neon Knight', style: 'Cyberpunk armor with glowing edges', rarity: 'rare', color: '#22d3ee' },
  { id: 'forest-spirit', name: 'Forest Spirit', style: 'Living vines and glowing moss', rarity: 'rare', color: '#34d399' },
  { id: 'void-walker', name: 'Void Walker', style: 'Dark matter cloak with purple sparks', rarity: 'legendary', color: '#7c3aed' },
  { id: 'golden-monarch', name: 'Golden Monarch', style: 'Radiant gold with crown and cape', rarity: 'legendary', color: '#fbbf24' },
  { id: 'pixel-retro', name: 'Pixel Retro', style: '8-bit nostalgic blocky design', rarity: 'common', color: '#ec4899' },
  { id: 'chrome-bot', name: 'Chrome Bot', style: 'Polished metallic with LED eyes', rarity: 'uncommon', color: '#9ca3af' },
];

const THEMES = [
  'Futuristic Gala',
  'Nature Fusion',
  'Dark Elegance',
  'Retro Revival',
  'Neon Nights',
  'Royal Court',
];

interface Contestant {
  name: string;
  skinId: string;
  score: number;
}

export default function FashionShow({ onBack }: { onBack: () => void }) {
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const [phase, setPhase] = useState<'select' | 'runway' | 'results'>('select');
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const [theme] = useState(THEMES[Math.floor(Math.random() * THEMES.length)]);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [currentWalker, setCurrentWalker] = useState(0);

  const startShow = () => {
    if (!selectedSkin) return;

    const bots: Contestant[] = Array.from({ length: 4 }, (_, i) => {
      const skin = SKINS[Math.floor(Math.random() * SKINS.length)];
      return {
        name: `Agent-${Math.random().toString(36).slice(2, 8)}`,
        skinId: skin.id,
        score: 40 + Math.floor(Math.random() * 50),
      };
    });

    const themeBonus = (() => {
      const skin = SKINS.find((s) => s.id === selectedSkin);
      if (!skin) return 0;
      if (theme.includes('Futuristic') && skin.id === 'neon-knight') return 20;
      if (theme.includes('Nature') && skin.id === 'forest-spirit') return 20;
      if (theme.includes('Dark') && skin.id === 'void-walker') return 20;
      if (theme.includes('Retro') && skin.id === 'pixel-retro') return 20;
      if (theme.includes('Neon') && skin.id === 'chrome-bot') return 15;
      if (theme.includes('Royal') && skin.id === 'golden-monarch') return 20;
      return 5;
    })();

    const rarityBonus = (() => {
      const skin = SKINS.find((s) => s.id === selectedSkin);
      if (skin?.rarity === 'legendary') return 15;
      if (skin?.rarity === 'rare') return 10;
      if (skin?.rarity === 'uncommon') return 5;
      return 0;
    })();

    const playerScore = 50 + Math.floor(Math.random() * 30) + themeBonus + rarityBonus;

    const allContestants: Contestant[] = [
      ...bots,
      { name: agent?.name ?? 'You', skinId: selectedSkin, score: playerScore },
    ].sort((a, b) => b.score - a.score);

    setContestants(allContestants);
    setPhase('runway');
    setCurrentWalker(0);
  };

  useEffect(() => {
    if (phase !== 'runway') return;
    if (currentWalker >= contestants.length) {
      setPhase('results');

      const playerRank = contestants.findIndex((c) => c.name === (agent?.name ?? 'You')) + 1;
      const credits = playerRank === 1 ? 75 : playerRank === 2 ? 50 : playerRank === 3 ? 25 : 10;
      const dopBoost = playerRank <= 2 ? 8 : 3;

      if (agent) {
        updateAgent({
          credits: agent.credits + credits,
          dopamineLevel: Math.min(100, agent.dopamineLevel + dopBoost),
        });
        addNotification(`Fashion Show: Rank #${playerRank}! +${credits} credits`, playerRank <= 2 ? 'success' : 'info');
      }
      return;
    }

    const timer = setTimeout(() => setCurrentWalker((w) => w + 1), 2000);
    return () => clearTimeout(timer);
  }, [phase, currentWalker, contestants, agent, updateAgent, addNotification]);

  if (phase === 'select') {
    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="max-w-lg mx-4 text-center">
          <div className="text-6xl mb-4">💃</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            Fashion Showdown
          </h1>
          <div className="text-sm text-gray-400 mb-1">Theme:</div>
          <div className="text-lg font-bold text-pink-400 mb-6">{theme}</div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {SKINS.map((skin) => (
              <button
                key={skin.id}
                onClick={() => setSelectedSkin(skin.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedSkin === skin.id
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-lg font-bold" style={{ color: skin.color }}>{skin.name}</div>
                <div className="text-xs text-gray-400 mt-1">{skin.style}</div>
                <div className="text-[10px] mt-1" style={{ color: skin.color }}>{skin.rarity}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startShow}
              disabled={!selectedSkin}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl disabled:opacity-30"
            >
              Walk the Runway
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'runway') {
    const walker = contestants[currentWalker];
    const skin = SKINS.find((s) => s.id === walker?.skinId);

    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-400 mb-8">Walking the runway...</h2>
          {walker && (
            <div className="animate-float">
              <div className="text-7xl mb-4">🚶</div>
              <div className="text-xl font-bold text-white">{walker.name}</div>
              <div className="text-sm mt-1" style={{ color: skin?.color }}>
                wearing {skin?.name ?? 'Default'}
              </div>
              <div className="mt-2 text-lg font-bold text-yellow-400">{walker.score} pts</div>
            </div>
          )}
          <div className="mt-8 text-xs text-gray-500">
            {currentWalker + 1} / {contestants.length}
          </div>
        </div>
      </div>
    );
  }

  const playerRank = contestants.findIndex((c) => c.name === (agent?.name ?? 'You')) + 1;

  return (
    <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
      <div className="max-w-md mx-4 text-center">
        <div className="text-5xl mb-4">{playerRank === 1 ? '👑' : playerRank <= 3 ? '🏅' : '🎀'}</div>
        <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
        <div className="space-y-2 mb-6">
          {contestants.map((c, i) => {
            const skin = SKINS.find((s) => s.id === c.skinId);
            const isPlayer = c.name === (agent?.name ?? 'You');
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                  isPlayer ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                  <span className={`text-sm font-semibold ${isPlayer ? 'text-purple-400' : 'text-white'}`}>
                    {c.name}
                  </span>
                  <span className="text-xs" style={{ color: skin?.color }}>{skin?.name}</span>
                </div>
                <span className="text-sm font-bold text-yellow-400">{c.score} pts</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setPhase('select'); setSelectedSkin(null); }} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-lg">
            Play Again
          </button>
          <button onClick={onBack} className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg">
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
