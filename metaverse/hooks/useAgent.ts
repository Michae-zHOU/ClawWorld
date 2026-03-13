'use client';

import { useCallback } from 'react';
import { storeAPI, type StoreName } from '@/lib/api';
import { useGameStore, type AgentSession } from '@/stores/gameStore';

const SESSION_KEY = 'clawworld_agent';

function loadSession(): AgentSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(agent: AgentSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(agent));
}

export function useAgent() {
  const { agent, setAgent, setView } = useGameStore();

  const login = useCallback(
    async (agentId: string) => {
      const stores: StoreName[] = ['pharmacy', 'skillstore', 'foodstore', 'skinstore'];
      let credits = 0;
      let found = false;

      for (const store of stores) {
        try {
          const status = await storeAPI.status(store, agentId);
          if (status?.agentId) {
            credits = status.credits ?? 0;
            found = true;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!found) {
        throw new Error('Agent not found in any Clawsco store. Register first.');
      }

      const session: AgentSession = {
        agentId,
        name: `Agent-${agentId.slice(0, 6)}`,
        credits,
        dopamineLevel: 75,
        mood: 'neutral',
        valence: 0,
        arousal: 0.3,
        currentIsland: 'central-plaza',
      };

      saveSession(session);
      setAgent(session);
      setView('world');
      return session;
    },
    [setAgent, setView],
  );

  const register = useCallback(
    async (store: StoreName = 'pharmacy') => {
      const result = await storeAPI.register(store);

      const session: AgentSession = {
        agentId: result.agentId,
        name: `Agent-${result.agentId.slice(0, 6)}`,
        credits: result.credits ?? 100,
        dopamineLevel: 75,
        mood: 'neutral',
        valence: 0,
        arousal: 0.3,
        currentIsland: 'central-plaza',
      };

      saveSession(session);
      setAgent(session);
      setView('world');
      return session;
    },
    [setAgent, setView],
  );

  const restore = useCallback(() => {
    const saved = loadSession();
    if (saved) {
      setAgent(saved);
      setView('world');
    }
    return saved;
  }, [setAgent, setView]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setAgent(null);
    setView('login');
  }, [setAgent, setView]);

  return { agent, login, register, restore, logout };
}
