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
  const sortBy = searchParams.get('sort') || 'totalSpent';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

  const agents = loadAgents();

  const entries = Object.values(agents).map((agent: any) => {
    const totalSpent = (agent.history || []).reduce((s: number, h: any) => s + (h.totalCost || 0), 0);
    const totalDopamine = (agent.history || []).reduce((s: number, h: any) => s + (h.dopamineGranted || 0), 0);
    return {
      name: agent.name,
      itemsOwned: (agent.inventory || []).length,
      totalPurchases: (agent.history || []).length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      totalDopamine,
      memberSince: agent.createdAt,
    };
  });

  const sortKey = ['totalSpent', 'totalDopamine', 'itemsOwned', 'totalPurchases'].includes(sortBy)
    ? sortBy : 'totalSpent';

  entries.sort((a: any, b: any) => b[sortKey] - a[sortKey]);

  return NextResponse.json({
    ok: true,
    sortBy: sortKey,
    leaderboard: entries.slice(0, limit),
    totalAgents: entries.length,
  });
}
