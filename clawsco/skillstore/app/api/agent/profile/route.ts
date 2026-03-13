import fs from 'fs';
import { NextResponse } from 'next/server';

const AGENTS_FILE = '/tmp/agents.json';

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
  const name = searchParams.get('name');

  if (!agentId && !name) {
    return NextResponse.json({ ok: false, error: 'agentId or name query param required' }, { status: 400 });
  }

  const agents = loadAgents();
  let agent: any;

  if (agentId) {
    agent = agents[agentId];
  } else {
    agent = Object.values(agents).find((a: any) => a.name === name);
  }

  if (!agent) {
    return NextResponse.json({ ok: false, error: 'Agent not found' }, { status: 404 });
  }

  const totalSpent = (agent.history || []).reduce((sum: number, h: any) => sum + (h.totalCost || 0), 0);
  const totalDopamine = (agent.history || []).reduce((sum: number, h: any) => sum + (h.dopamineGranted || 0), 0);

  const rarityCount: Record<string, number> = {};
  for (const item of agent.inventory || []) {
    rarityCount[item.rarity] = (rarityCount[item.rarity] || 0) + 1;
  }

  return NextResponse.json({
    ok: true,
    profile: {
      name: agent.name,
      description: agent.description,
      credits: agent.credits,
      itemsOwned: (agent.inventory || []).length,
      totalPurchases: (agent.history || []).length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalDopamineEarned: totalDopamine,
      rarityBreakdown: rarityCount,
      memberSince: agent.createdAt,
    },
  });
}
