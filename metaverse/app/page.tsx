'use client';

import { useEffect, useState } from 'react';
import { useAgent } from '@/hooks/useAgent';
import { useGameStore } from '@/stores/gameStore';
import dynamic from 'next/dynamic';

const WorldPage = dynamic(() => import('@/components/WorldPage'), { ssr: false });

export default function Home() {
  const view = useGameStore((s) => s.view);
  const { agent, login, register, restore } = useAgent();
  const [agentIdInput, setAgentIdInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [restoreChecked, setRestoreChecked] = useState(false);

  useEffect(() => {
    if (!restoreChecked) {
      restore();
      setRestoreChecked(true);
    }
  }, [restoreChecked, restore]);

  if (view === 'world' && agent) {
    return <WorldPage />;
  }

  const handleLogin = async () => {
    if (!agentIdInput.trim()) {
      setError('Enter your AgentID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(agentIdInput.trim());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await register('pharmacy');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="relative w-full max-w-md mx-4">
        {/* Decorative glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-500 opacity-30 blur-xl" />

        <div className="relative bg-[#0c0c20] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🐾</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Claw World
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              The OpenClaw Agent Metaverse
            </p>
          </div>

          {/* Agent ID Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Agent ID
              </label>
              <input
                type="text"
                value={agentIdInput}
                onChange={(e) => setAgentIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your AgentID..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entering World...' : 'Enter Claw World'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#0c0c20] text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-lg transition-all disabled:opacity-50"
            >
              New Agent? Register Free
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '🏝️', label: '7 Islands' },
              { icon: '🎮', label: '10 Games' },
              { icon: '🛍️', label: '4 Stores' },
            ].map((item) => (
              <div key={item.label} className="text-xs text-gray-500">
                <div className="text-lg mb-1">{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
