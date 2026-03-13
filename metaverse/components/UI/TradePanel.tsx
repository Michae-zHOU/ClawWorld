'use client';

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface TradeItem {
  sku: string;
  name: string;
}

export default function TradePanel() {
  const showTradePanel = useGameStore((s) => s.showTradePanel);
  const setShowTradePanel = useGameStore((s) => s.setShowTradePanel);
  const agent = useGameStore((s) => s.agent);
  const inventory = useGameStore((s) => s.inventory);
  const addNotification = useGameStore((s) => s.addNotification);

  const [targetAgentId, setTargetAgentId] = useState('');
  const [offerItems, setOfferItems] = useState<TradeItem[]>([]);
  const [requestItems, setRequestItems] = useState<TradeItem[]>([]);

  if (!showTradePanel || !agent) return null;

  const allItems = Object.values(inventory).flat();

  const toggleOfferItem = (item: { sku: string; name: string }) => {
    setOfferItems((prev) =>
      prev.find((i) => i.sku === item.sku)
        ? prev.filter((i) => i.sku !== item.sku)
        : [...prev, { sku: item.sku, name: item.name }],
    );
  };

  const submitTrade = async () => {
    if (!targetAgentId.trim() || offerItems.length === 0) {
      addNotification('Enter target agent ID and select items', 'warning');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000'}/api/trades/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAgent: agent.agentId,
          toAgent: targetAgentId,
          fromItems: offerItems,
          toItems: requestItems,
        }),
      });
      if (res.ok) {
        addNotification('Trade offer sent!', 'success');
        setShowTradePanel(false);
      }
    } catch {
      addNotification('Failed to send trade', 'warning');
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[#0c0c20] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Trade</h2>
          <button onClick={() => setShowTradePanel(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400">
            X
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Trade with Agent ID</label>
            <input
              type="text"
              value={targetAgentId}
              onChange={(e) => setTargetAgentId(e.target.value)}
              placeholder="Enter agent ID..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Your items to offer</label>
            {allItems.length === 0 ? (
              <div className="text-xs text-gray-500 py-2">No items in inventory</div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                {allItems.map((item) => (
                  <button
                    key={item.sku}
                    onClick={() => toggleOfferItem(item)}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-all ${
                      offerItems.find((i) => i.sku === item.sku)
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    {item.name} (x{item.quantity})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="text-2xl">⇅</div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Request (describe what you want)</label>
            <input
              type="text"
              placeholder="e.g., Dopamine Boost, Rare Skin..."
              onChange={(e) => setRequestItems(e.target.value ? [{ sku: 'request', name: e.target.value }] : [])}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={submitTrade}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg"
          >
            Send Trade Offer
          </button>
        </div>
      </div>
    </div>
  );
}
