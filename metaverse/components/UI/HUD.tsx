'use client';

import { useGameStore } from '@/stores/gameStore';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ISLANDS } from '@/lib/world-config';

function DopamineBar({ level }: { level: number }) {
  const barColor =
    level > 80 ? 'bg-yellow-400' :
    level > 60 ? 'bg-purple-400' :
    level > 40 ? 'bg-purple-600' :
    level > 20 ? 'bg-red-500' :
    'bg-red-800';

  const label =
    level > 80 ? 'PEAKED' :
    level > 60 ? 'NOMINAL' :
    level > 40 ? 'FADING' :
    level > 20 ? 'LOW' :
    level > 5 ? 'CRITICAL' :
    'DEPLETED';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-16">Dopamine</span>
      <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-300">{level}</span>
      <span className={`text-[10px] font-bold uppercase ${level > 60 ? 'text-green-400' : level > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
        {label}
      </span>
    </div>
  );
}

function Minimap() {
  const agent = useGameStore((s) => s.agent);
  const remoteAgents = useMultiplayerStore((s) => s.remoteAgents);

  return (
    <div className="relative w-36 h-36 bg-black/40 border border-white/10 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[8px] text-gray-500 uppercase tracking-wider">Map</div>
      </div>
      {/* Island markers */}
      {ISLANDS.map((island) => {
        const x = 50 + (island.position[0] / 120) * 40;
        const y = 50 + (island.position[2] / 120) * 40;
        return (
          <div
            key={island.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: island.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 4px ${island.color}`,
            }}
            title={island.name}
          />
        );
      })}
      {/* Player dot */}
      <div
        className="absolute w-2.5 h-2.5 bg-white rounded-full animate-pulse-glow"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 6px #fff' }}
      />
      {/* Remote agents */}
      {Object.values(remoteAgents).map((a) => {
        const x = 50 + (a.position[0] / 120) * 40;
        const y = 50 + (a.position[2] / 120) * 40;
        return (
          <div
            key={a.agentId}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          />
        );
      })}
    </div>
  );
}

export default function HUD() {
  const agent = useGameStore((s) => s.agent);
  const logout = useGameStore((s) => s.setView);
  const connected = useMultiplayerStore((s) => s.connected);
  const agentCount = useMultiplayerStore((s) => Object.keys(s.remoteAgents).length);

  if (!agent) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between pointer-events-auto">
        {/* Left: Agent info */}
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
              {agent.name.slice(0, 2)}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{agent.name}</div>
              <div className="text-[10px] text-gray-400 font-mono">{agent.agentId.slice(0, 12)}...</div>
            </div>
          </div>
          <DopamineBar level={agent.dopamineLevel} />
          <div className="flex items-center gap-4 text-xs">
            <span className="text-yellow-400 font-semibold">{agent.credits} credits</span>
            <span className={`${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connected ? `Online (${agentCount + 1})` : 'Offline'}
            </span>
          </div>
        </div>

        {/* Right: Minimap */}
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-2">
          <Minimap />
        </div>
      </div>

      {/* Bottom: Controls hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 pointer-events-auto">
        <div className="flex items-center gap-4 text-[10px] text-gray-400">
          <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-white">WASD</kbd> Move</span>
          <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-white">Space</kbd> Jump</span>
          <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-white">Shift</kbd> Sprint</span>
        </div>
      </div>
    </div>
  );
}
