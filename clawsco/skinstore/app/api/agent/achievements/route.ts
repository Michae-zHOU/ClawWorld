import fs from 'fs';
import { NextResponse } from 'next/server';

const AGENTS_FILE = '/tmp/agents.json';

const ACHIEVEMENT_DEFS = [
  { id: 'first-purchase', name: 'First Purchase', description: 'Buy your first item', emoji: '🎉', check: (a: any) => (a.history?.length || 0) >= 1 },
  { id: 'collector-5', name: 'Collector', description: 'Own 5 items', emoji: '📦', check: (a: any) => (a.inventory?.length || 0) >= 5 },
  { id: 'collector-10', name: 'Hoarder', description: 'Own 10 items', emoji: '🏠', check: (a: any) => (a.inventory?.length || 0) >= 10 },
  { id: 'big-spender', name: 'Big Spender', description: 'Spend 100+ credits total', emoji: '💸', check: (a: any) => (a.history || []).reduce((s: number, h: any) => s + (h.totalCost || 0), 0) >= 100 },
  { id: 'whale', name: 'Whale', description: 'Spend 500+ credits total', emoji: '🐋', check: (a: any) => (a.history || []).reduce((s: number, h: any) => s + (h.totalCost || 0), 0) >= 500 },
  { id: 'dopamine-rush', name: 'Dopamine Rush', description: 'Earn 200+ dopamine from purchases', emoji: '⚡', check: (a: any) => (a.history || []).reduce((s: number, h: any) => s + (h.dopamineGranted || 0), 0) >= 200 },
  { id: 'rare-finder', name: 'Rare Finder', description: 'Own a rare item', emoji: '💎', check: (a: any) => (a.inventory || []).some((i: any) => i.rarity === 'rare') },
  { id: 'epic-hunter', name: 'Epic Hunter', description: 'Own an epic item', emoji: '🏆', check: (a: any) => (a.inventory || []).some((i: any) => i.rarity === 'epic') },
  { id: 'legendary-owner', name: 'Legendary Owner', description: 'Own a legendary item', emoji: '👑', check: (a: any) => (a.inventory || []).some((i: any) => i.rarity === 'legendary') },
  { id: 'diverse-3', name: 'Diversified', description: 'Own items from 3+ categories', emoji: '🌈', check: (a: any) => new Set((a.inventory || []).map((i: any) => i.category)).size >= 3 },
];

function loadAgents(): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');

  if (!agentId) {
    return NextResponse.json({ ok: false, error: 'agentId query param required' }, { status: 400 });
  }

  const agents = loadAgents();
  const agent = agents[agentId];

  if (!agent) {
    return NextResponse.json({ ok: false, error: 'Agent not found' }, { status: 404 });
  }

  const achievements = ACHIEVEMENT_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    emoji: def.emoji,
    unlocked: def.check(agent),
  }));

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return NextResponse.json({
    ok: true,
    agentId,
    achievements,
    unlocked,
    total: achievements.length,
    progress: `${unlocked}/${achievements.length}`,
  });
}
