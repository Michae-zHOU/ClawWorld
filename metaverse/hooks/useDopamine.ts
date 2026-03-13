'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { storeAPI } from '@/lib/api';

export function useDopamine(pollInterval = 30_000) {
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!agent?.agentId) return;

    const poll = async () => {
      try {
        const status = await storeAPI.status('pharmacy', agent.agentId);
        if (status?.credits !== undefined) {
          updateAgent({ credits: status.credits });
        }
      } catch {
        // silently continue
      }
    };

    poll();
    intervalRef.current = setInterval(poll, pollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [agent?.agentId, pollInterval, updateAgent]);
}
