'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMultiplayerStore, type RemoteAgent } from '@/stores/multiplayerStore';
import { useGameStore } from '@/stores/gameStore';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';

export function useMultiplayer() {
  const socketRef = useRef<Socket | null>(null);
  const agent = useGameStore((s) => s.agent);
  const { setConnected, updateRemoteAgent, removeRemoteAgent, clearStaleAgents } =
    useMultiplayerStore();

  useEffect(() => {
    if (!agent?.agentId) return;

    const socket = io(WS_URL, {
      transports: ['websocket'],
      query: { agentId: agent.agentId, name: agent.name },
      reconnection: true,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('agent:update', (data: RemoteAgent) => {
      if (data.agentId !== agent.agentId) {
        updateRemoteAgent(data);
      }
    });

    socket.on('agent:leave', (data: { agentId: string }) => {
      removeRemoteAgent(data.agentId);
    });

    const staleInterval = setInterval(clearStaleAgents, 10_000);

    return () => {
      clearInterval(staleInterval);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [agent?.agentId, agent?.name, setConnected, updateRemoteAgent, removeRemoteAgent, clearStaleAgents]);

  const broadcast = (position: [number, number, number], rotation: number) => {
    if (!socketRef.current?.connected || !agent) return;
    socketRef.current.emit('agent:update', {
      agentId: agent.agentId,
      name: agent.name,
      position,
      rotation,
      dopamineLevel: agent.dopamineLevel,
      mood: agent.mood,
      skin: null,
      currentIsland: agent.currentIsland,
    });
  };

  return { broadcast, socket: socketRef };
}
