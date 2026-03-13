'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import { useState } from 'react';
import World from './World';
import HUD from './UI/HUD';
import StoreModal from './UI/StoreModal';
import QuestTracker from './UI/QuestTracker';
import Notifications from './UI/Notifications';
import ChatBox from './UI/ChatBox';
import GameMenu from './UI/GameMenu';
import TradePanel from './UI/TradePanel';
import MiniGameRouter from './MiniGames/MiniGameRouter';
import { useDopamine } from '@/hooks/useDopamine';
import { useQuests } from '@/hooks/useQuests';
import { useGameStore } from '@/stores/gameStore';

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)] z-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-float">🐾</div>
        <div className="text-xl text-purple-400 font-semibold">Loading Claw World...</div>
        <div className="mt-3 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}

export default function WorldPage() {
  useDopamine();
  useQuests();

  const view = useGameStore((s) => s.view);
  const showStoreModal = useGameStore((s) => s.showStoreModal);
  const showTradePanel = useGameStore((s) => s.showTradePanel);
  const [showGameMenu, setShowGameMenu] = useState(false);

  if (view !== 'world' && view !== 'login') {
    return <MiniGameRouter />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--background)]">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: false }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Physics gravity={[0, -20, 0]} timeStep="vary">
            <World />
          </Physics>
        </Canvas>
      </Suspense>

      <HUD />
      <QuestTracker />
      <ChatBox />
      <Notifications />
      {showStoreModal && <StoreModal />}
      {showTradePanel && <TradePanel />}
      {showGameMenu && <GameMenu onClose={() => setShowGameMenu(false)} />}

      {/* Quick action buttons */}
      <div className="absolute bottom-14 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => setShowGameMenu(true)}
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Games
        </button>
        <button
          onClick={() => useGameStore.getState().setShowStoreModal('pharmacy')}
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          Stores
        </button>
        <button
          onClick={() => useGameStore.getState().setShowTradePanel(true)}
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Trade
        </button>
      </div>
    </div>
  );
}
