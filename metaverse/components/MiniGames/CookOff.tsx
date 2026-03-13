'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

const INGREDIENTS = [
  { name: 'Noodles', emoji: '🍜', color: '#fbbf24' },
  { name: 'Rice', emoji: '🍚', color: '#f5f5dc' },
  { name: 'Sushi', emoji: '🍣', color: '#ef4444' },
  { name: 'Curry', emoji: '🍛', color: '#f97316' },
  { name: 'Steak', emoji: '🥩', color: '#dc2626' },
  { name: 'Salad', emoji: '🥗', color: '#34d399' },
];

const RECIPES = [
  { name: 'Fusion Bowl', sequence: [0, 2, 3], reward: 30, dopamine: 8 },
  { name: 'Power Plate', sequence: [4, 5, 1], reward: 25, dopamine: 6 },
  { name: 'Energy Wrap', sequence: [1, 3, 5], reward: 20, dopamine: 5 },
  { name: 'Agent Special', sequence: [0, 4, 2], reward: 35, dopamine: 10 },
];

interface TimingRing {
  targetTime: number;
  ingredient: number;
  hit: boolean | null;
}

export default function CookOff({ onBack }: { onBack: () => void }) {
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [recipe, setRecipe] = useState(RECIPES[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [rings, setRings] = useState<TimingRing[]>([]);
  const [progress, setProgress] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const startTime = useRef(0);
  const animRef = useRef<number>(0);

  const startGame = (r: typeof RECIPES[number]) => {
    setRecipe(r);
    setCurrentStep(0);
    setTotalScore(0);
    setProgress(0);
    setGameState('playing');
    startTime.current = Date.now();

    setRings(
      r.sequence.map((ing, i) => ({
        targetTime: (i + 1) * 2000,
        ingredient: ing,
        hit: null,
      })),
    );
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      setProgress(elapsed);

      const totalDuration = (recipe.sequence.length + 1) * 2000;
      if (elapsed > totalDuration) {
        setGameState('result');
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, recipe]);

  const handleTap = useCallback(
    (ingredientIdx: number) => {
      if (gameState !== 'playing' || currentStep >= rings.length) return;

      const ring = rings[currentStep];
      if (ring.ingredient !== ingredientIdx) return;

      const elapsed = Date.now() - startTime.current;
      const diff = Math.abs(elapsed - ring.targetTime);
      const perfect = diff < 200;
      const good = diff < 500;

      const score = perfect ? 100 : good ? 60 : 20;
      setTotalScore((s) => s + score);

      setRings((prev) =>
        prev.map((r, i) => (i === currentStep ? { ...r, hit: perfect || good } : r)),
      );
      setCurrentStep((s) => s + 1);
    },
    [gameState, currentStep, rings],
  );

  useEffect(() => {
    if (gameState !== 'result') return;
    const avgScore = totalScore / recipe.sequence.length;
    const creditReward = Math.round((avgScore / 100) * recipe.reward);
    const dopReward = Math.round((avgScore / 100) * recipe.dopamine);

    if (agent && creditReward > 0) {
      updateAgent({
        credits: agent.credits + creditReward,
        dopamineLevel: Math.min(100, agent.dopamineLevel + dopReward),
      });
      addNotification(`Cooked ${recipe.name}! +${creditReward} credits`, 'success');
    }
  }, [gameState, totalScore, recipe, agent, updateAgent, addNotification]);

  if (gameState === 'menu') {
    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="max-w-lg mx-4 text-center">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Cook-Off
          </h1>
          <p className="text-sm text-gray-400 mb-6">Tap the right ingredient at the right time!</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {RECIPES.map((r) => (
              <button
                key={r.name}
                onClick={() => startGame(r)}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-500/30 transition-all text-left"
              >
                <div className="text-sm font-bold text-white">{r.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {r.sequence.map((i) => INGREDIENTS[i].emoji).join(' + ')}
                </div>
                <div className="text-xs text-yellow-400 mt-1">{r.reward} credits</div>
              </button>
            ))}
          </div>
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-white transition-colors">
            Back to World
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const avgScore = Math.round(totalScore / recipe.sequence.length);
    const grade = avgScore >= 80 ? 'S' : avgScore >= 60 ? 'A' : avgScore >= 40 ? 'B' : 'C';
    const gradeColor = avgScore >= 80 ? '#fbbf24' : avgScore >= 60 ? '#34d399' : avgScore >= 40 ? '#22d3ee' : '#6b7280';

    return (
      <div className="w-screen h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-white mb-1">{recipe.name} Complete!</h2>
          <div className="text-7xl font-black my-4" style={{ color: gradeColor }}>{grade}</div>
          <div className="text-sm text-gray-400 mb-1">Average Timing: {avgScore}%</div>
          <div className="text-sm text-yellow-400 mb-6">
            +{Math.round((avgScore / 100) * recipe.reward)} credits
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setGameState('menu')} className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg">
              Cook Again
            </button>
            <button onClick={onBack} className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg">
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentRing = currentStep < rings.length ? rings[currentStep] : null;
  const elapsed = progress;
  const ringProgress = currentRing ? Math.max(0, Math.min(1, (elapsed - (currentRing.targetTime - 1500)) / 1500)) : 0;

  return (
    <div className="w-screen h-screen bg-[#050510] flex flex-col">
      <div className="flex items-center justify-between p-3">
        <button onClick={onBack} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300">Back</button>
        <h1 className="text-lg font-bold text-white">{recipe.name}</h1>
        <div className="text-sm text-yellow-400 font-bold">Score: {totalScore}</div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-4 justify-center">
          {rings.map((ring, i) => (
            <div key={i} className={`text-center ${i === currentStep ? 'scale-125' : 'opacity-50'} transition-all`}>
              <div className="text-3xl">{INGREDIENTS[ring.ingredient].emoji}</div>
              <div className={`text-xs mt-1 ${ring.hit === true ? 'text-green-400' : ring.hit === false ? 'text-red-400' : 'text-gray-400'}`}>
                {ring.hit === true ? 'HIT!' : ring.hit === false ? 'MISS' : i === currentStep ? 'NOW!' : '...'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timing circle */}
      <div className="flex-1 flex items-center justify-center">
        {currentRing && (
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a3e" strokeWidth="3" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={INGREDIENTS[currentRing.ingredient].color}
                strokeWidth="3"
                strokeDasharray={`${ringProgress * 283} 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              {INGREDIENTS[currentRing.ingredient].emoji}
            </div>
          </div>
        )}
      </div>

      {/* Ingredient buttons */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          {INGREDIENTS.map((ing, i) => (
            <button
              key={i}
              onClick={() => handleTap(i)}
              className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-center"
            >
              <div className="text-2xl">{ing.emoji}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{ing.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
