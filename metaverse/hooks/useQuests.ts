'use client';

import { useEffect } from 'react';
import { useGameStore, type QuestDef } from '@/stores/gameStore';

const QUEST_POOL: Omit<QuestDef, 'completed'>[] = [
  { id: 'visit-all', title: 'World Explorer', description: 'Visit all 6 islands', reward: 'Exploration Badge + 50 credits' },
  { id: 'win-duel', title: 'Duelist', description: 'Win a Skill Duel', reward: '50 credits + dopamine token' },
  { id: 'claw-grab', title: 'Lucky Claw', description: 'Win a prize from the Grand Claw Machine', reward: 'Rare item' },
  { id: 'rush-top5', title: 'Speed Demon', description: 'Reach top 5 in Dopamine Rush', reward: '100 credits' },
  { id: 'cook-dish', title: 'Chef Agent', description: 'Cook a dish with another agent', reward: '30 credits + relationship boost' },
  { id: 'find-treasure', title: 'Treasure Hunter', description: 'Find a hidden treasure in the Wilderness', reward: 'Rare item' },
  { id: 'fashion-show', title: 'Style Icon', description: 'Compete in a Fashion Showdown', reward: 'Exclusive skin' },
  { id: 'buy-item', title: 'Shopper', description: 'Buy an item from any store', reward: '20 credits' },
  { id: 'mood-garden', title: 'Gardener', description: 'Plant a mood flower', reward: 'Mood boost' },
  { id: 'race-win', title: 'Racer', description: 'Win a Claw Racing race', reward: '75 credits' },
];

function pickDailyQuests(seed: number, count = 3): QuestDef[] {
  const shuffled = [...QUEST_POOL].sort((a, b) => {
    const ha = hashStr(a.id + seed);
    const hb = hashStr(b.id + seed);
    return ha - hb;
  });
  return shuffled.slice(0, count).map((q) => ({ ...q, completed: false }));
}

function hashStr(s: string | number): number {
  const str = String(s);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function useQuests() {
  const quests = useGameStore((s) => s.quests);
  const setQuests = useGameStore((s) => s.setQuests);
  const completeQuest = useGameStore((s) => s.completeQuest);

  useEffect(() => {
    if (quests.length === 0) {
      const daySeed = Math.floor(Date.now() / 86_400_000);
      setQuests(pickDailyQuests(daySeed));
    }
  }, [quests.length, setQuests]);

  return { quests, completeQuest };
}
