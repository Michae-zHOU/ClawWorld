'use client';

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function QuestTracker() {
  const quests = useGameStore((s) => s.quests);
  const [collapsed, setCollapsed] = useState(false);

  if (quests.length === 0) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-300 hover:text-white transition-colors"
      >
        Daily Quests ({quests.filter((q) => q.completed).length}/{quests.length})
        {collapsed ? ' +' : ' -'}
      </button>

      {!collapsed && (
        <div className="mt-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-2 min-w-[280px]">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`flex items-start gap-2 text-xs ${quest.completed ? 'opacity-50' : ''}`}
            >
              <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                quest.completed
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'border-white/20'
              }`}>
                {quest.completed && '✓'}
              </div>
              <div>
                <div className={`font-semibold ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {quest.title}
                </div>
                <div className="text-gray-400">{quest.description}</div>
                <div className="text-purple-400 text-[10px] mt-0.5">{quest.reward}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
