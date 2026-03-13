'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { storeAPI, type StoreName, type CatalogItem } from '@/lib/api';

const STORE_MAP: Record<string, { name: StoreName; label: string; color: string }> = {
  pharmacy: { name: 'pharmacy', label: 'Clawsco Pharmacy', color: '#06b6d4' },
  skillstore: { name: 'skillstore', label: 'Skill Store', color: '#ef4444' },
  foodstore: { name: 'foodstore', label: 'Food Store', color: '#f59e0b' },
  skinstore: { name: 'skinstore', label: 'Skin Store', color: '#ec4899' },
};

export default function StoreModal() {
  const showStore = useGameStore((s) => s.showStoreModal);
  const setShowStore = useGameStore((s) => s.setShowStoreModal);
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const addNotification = useGameStore((s) => s.addNotification);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);

  const storeConfig = showStore ? STORE_MAP[showStore] : null;

  useEffect(() => {
    if (!storeConfig) return;
    setLoading(true);
    storeAPI
      .catalog(storeConfig.name)
      .then((res) => setCatalog(res.catalog || []))
      .catch(() => setCatalog([]))
      .finally(() => setLoading(false));
  }, [storeConfig]);

  if (!showStore || !storeConfig || !agent) return null;

  const handleBuy = async (sku: string, price: number) => {
    setBuying(sku);
    try {
      const result = await storeAPI.buy(storeConfig.name, agent.agentId, sku);
      if (result.success) {
        updateAgent({ credits: result.credits });
        addNotification(`Purchased! +${result.dopamineGranted} dopamine`, 'success');
      } else {
        addNotification('Purchase failed', 'warning');
      }
    } catch {
      addNotification('Purchase error', 'warning');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] mx-4 bg-[#0c0c20] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10" style={{ borderColor: storeConfig.color + '40' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: storeConfig.color }}>{storeConfig.label}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Credits: {agent.credits}</p>
          </div>
          <button
            onClick={() => setShowStore(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            X
          </button>
        </div>

        {/* Catalog */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="text-center text-gray-400 py-12">Loading catalog...</div>
          ) : catalog.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No items available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catalog.map((item) => (
                <div
                  key={item.sku}
                  className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{item.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10" style={{ color: storeConfig.color }}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-sm font-bold text-yellow-400">{item.price}c</div>
                      {item.dopamineBoost > 0 && (
                        <div className="text-[10px] text-green-400">+{item.dopamineBoost} dopa</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(item.sku, item.price)}
                    disabled={buying === item.sku || agent.credits < item.price}
                    className="mt-3 w-full py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-30"
                    style={{
                      backgroundColor: storeConfig.color + '20',
                      color: storeConfig.color,
                      border: `1px solid ${storeConfig.color}40`,
                    }}
                  >
                    {buying === item.sku ? 'Buying...' : agent.credits < item.price ? 'Not enough credits' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
