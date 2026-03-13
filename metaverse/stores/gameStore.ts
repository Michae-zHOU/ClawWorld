import { create } from 'zustand';

export type GameView = 'login' | 'world' | 'claw-machine' | 'dopamine-rush' | 'skill-duel' | 'cook-off' | 'fashion-show' | 'colosseum';

export interface AgentSession {
  agentId: string;
  name: string;
  credits: number;
  dopamineLevel: number;
  mood: string;
  valence: number;
  arousal: number;
  currentIsland: string;
}

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

interface GameState {
  view: GameView;
  setView: (v: GameView) => void;

  agent: AgentSession | null;
  setAgent: (a: AgentSession | null) => void;
  updateAgent: (partial: Partial<AgentSession>) => void;

  showStoreModal: string | null;
  setShowStoreModal: (store: string | null) => void;

  showTradePanel: boolean;
  setShowTradePanel: (v: boolean) => void;

  chatMessages: { from: string; text: string; timestamp: number }[];
  addChatMessage: (from: string, text: string) => void;

  quests: QuestDef[];
  setQuests: (q: QuestDef[]) => void;
  completeQuest: (id: string) => void;

  inventory: Record<string, { sku: string; name: string; quantity: number }[]>;
  setInventory: (store: string, items: { sku: string; name: string; quantity: number }[]) => void;

  notifications: { id: string; text: string; type: 'info' | 'success' | 'warning' }[];
  addNotification: (text: string, type?: 'info' | 'success' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  view: 'login',
  setView: (view) => set({ view }),

  agent: null,
  setAgent: (agent) => set({ agent }),
  updateAgent: (partial) =>
    set((s) => (s.agent ? { agent: { ...s.agent, ...partial } } : {})),

  showStoreModal: null,
  setShowStoreModal: (showStoreModal) => set({ showStoreModal }),

  showTradePanel: false,
  setShowTradePanel: (showTradePanel) => set({ showTradePanel }),

  chatMessages: [],
  addChatMessage: (from, text) =>
    set((s) => ({
      chatMessages: [...s.chatMessages.slice(-49), { from, text, timestamp: Date.now() }],
    })),

  quests: [],
  setQuests: (quests) => set({ quests }),
  completeQuest: (id) =>
    set((s) => ({
      quests: s.quests.map((q) => (q.id === id ? { ...q, completed: true } : q)),
    })),

  inventory: {},
  setInventory: (store, items) =>
    set((s) => ({ inventory: { ...s.inventory, [store]: items } })),

  notifications: [],
  addNotification: (text, type = 'info') =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        { id: `${Date.now()}-${Math.random()}`, text, type },
      ],
    })),
  removeNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));
