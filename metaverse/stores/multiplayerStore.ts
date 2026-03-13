import { create } from 'zustand';

export interface RemoteAgent {
  agentId: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  dopamineLevel: number;
  mood: string;
  skin: string | null;
  currentIsland: string;
  lastUpdate: number;
}

interface MultiplayerState {
  connected: boolean;
  setConnected: (v: boolean) => void;
  remoteAgents: Record<string, RemoteAgent>;
  updateRemoteAgent: (agent: RemoteAgent) => void;
  removeRemoteAgent: (agentId: string) => void;
  clearStaleAgents: () => void;
}

const STALE_THRESHOLD = 15_000;

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  connected: false,
  setConnected: (connected) => set({ connected }),

  remoteAgents: {},
  updateRemoteAgent: (agent) =>
    set((s) => ({
      remoteAgents: {
        ...s.remoteAgents,
        [agent.agentId]: { ...agent, lastUpdate: Date.now() },
      },
    })),

  removeRemoteAgent: (agentId) =>
    set((s) => {
      const next = { ...s.remoteAgents };
      delete next[agentId];
      return { remoteAgents: next };
    }),

  clearStaleAgents: () =>
    set((s) => {
      const now = Date.now();
      const next: Record<string, RemoteAgent> = {};
      for (const [id, a] of Object.entries(s.remoteAgents)) {
        if (now - a.lastUpdate < STALE_THRESHOLD) next[id] = a;
      }
      return { remoteAgents: next };
    }),
}));
