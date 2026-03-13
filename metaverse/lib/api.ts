const STORE_URLS = {
  pharmacy: 'https://clawsco-drugstore.vercel.app',
  skillstore: 'https://skillstore-one.vercel.app',
  foodstore: 'https://foodstore-beta.vercel.app',
  skinstore: 'https://skinstore-red.vercel.app',
} as const;

const DOPAMINE_URL = 'https://claw-dopamine.onrender.com';
const PSYCHE_URL = 'https://claw-psyche.onrender.com';

export type StoreName = keyof typeof STORE_URLS;

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts?.headers },
  });
  return res.json();
}

export interface AgentRegistration {
  agentId: string;
  apiKey: string;
  credits: number;
}

export interface CatalogItem {
  sku: string;
  name: string;
  price: number;
  category: string;
  rarity: string;
  description: string;
  dopamineBoost: number;
}

export interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  purchasedAt: string;
}

export const storeAPI = {
  register(store: StoreName) {
    return fetchJSON<AgentRegistration>(`${STORE_URLS[store]}/api/agent/register`, {
      method: 'POST',
    });
  },

  catalog(store: StoreName) {
    return fetchJSON<{ catalog: CatalogItem[] }>(`${STORE_URLS[store]}/api/agent/catalog`);
  },

  buy(store: StoreName, agentId: string, sku: string) {
    return fetchJSON<{ success: boolean; credits: number; dopamineGranted: number }>(
      `${STORE_URLS[store]}/api/agent/buy`,
      { method: 'POST', body: JSON.stringify({ agentId, sku }) },
    );
  },

  inventory(store: StoreName, agentId: string) {
    return fetchJSON<{ inventory: InventoryItem[] }>(
      `${STORE_URLS[store]}/api/agent/inventory?agentId=${agentId}`,
    );
  },

  status(store: StoreName, agentId: string) {
    return fetchJSON<{ agentId: string; credits: number; totalSpent: number }>(
      `${STORE_URLS[store]}/api/agent/status?agentId=${agentId}`,
    );
  },

  profile(store: StoreName, agentId: string) {
    return fetchJSON<Record<string, unknown>>(
      `${STORE_URLS[store]}/api/agent/profile?agentId=${agentId}`,
    );
  },

  deals(store: StoreName) {
    return fetchJSON<{ deals: CatalogItem[] }>(`${STORE_URLS[store]}/api/deals`);
  },

  leaderboard(store: StoreName, sort = 'dopamine') {
    return fetchJSON<{ leaderboard: Record<string, unknown>[] }>(
      `${STORE_URLS[store]}/api/leaderboard?sort=${sort}`,
    );
  },
};

export const dopamineAPI = {
  createAccount() {
    return fetchJSON<{ accountId: string; recoveryCode: string }>(
      `${DOPAMINE_URL}/v1/accounts/create`,
      { method: 'POST' },
    );
  },

  viewAccount(accountId: string, recoveryCode: string) {
    return fetchJSON<Record<string, unknown>>(`${DOPAMINE_URL}/v1/accounts/view`, {
      method: 'POST',
      body: JSON.stringify({ accountId, recoveryCode }),
    });
  },
};

export const psycheAPI = {
  createAgent(name: string, secret: string) {
    return fetchJSON<{ agentId: string }>(`${PSYCHE_URL}/v1/agents/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ name }),
    });
  },

  getState(agentId: string, secret: string) {
    return fetchJSON<Record<string, unknown>>(`${PSYCHE_URL}/v1/agents/${agentId}/state`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
  },

  sendSignal(
    agentId: string,
    secret: string,
    signal: { type: string; value: number; source: string; meta?: Record<string, unknown> },
  ) {
    return fetchJSON<Record<string, unknown>>(`${PSYCHE_URL}/v1/agents/${agentId}/signal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
      body: JSON.stringify(signal),
    });
  },
};
