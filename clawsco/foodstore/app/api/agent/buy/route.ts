import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const GOODS_FILE = path.join(process.cwd(), 'data/goods.json');
const AGENTS_FILE = '/tmp/agents.json';

function loadGoods() {
  return JSON.parse(fs.readFileSync(GOODS_FILE, 'utf8'));
}

function loadAgents(): Record<string, any> {
  try {
    return JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveAgents(agents: Record<string, any>) {
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

export async function POST(req: Request) {
  const body = await req.json();
  const { agentId, sku, quantity = 1 } = body;

  if (!agentId || !sku) {
    return NextResponse.json({ ok: false, error: 'agentId and sku are required' }, { status: 400 });
  }

  const goods = loadGoods();
  const item = goods.find((g: any) => g.sku === sku);

  if (!item) return NextResponse.json({ ok: false, error: 'Item not found' }, { status: 404 });

  const agents = loadAgents();
  const agent = agents[agentId];

  if (agent) {
    const totalCost = item.price * quantity;
    if (agent.credits < totalCost) {
      return NextResponse.json({
        ok: false,
        error: 'Insufficient credits',
        credits: agent.credits,
        cost: totalCost,
      }, { status: 402 });
    }

    agent.credits -= totalCost;
    agent.credits = Math.round(agent.credits * 100) / 100;

    for (let i = 0; i < quantity; i++) {
      agent.inventory.push({
        sku: item.sku,
        name: item.name,
        category: item.category,
        rarity: item.rarity,
        acquiredAt: new Date().toISOString(),
      });
    }

    agent.history.push({
      sku: item.sku,
      name: item.name,
      quantity,
      price: item.price,
      totalCost,
      dopamineGranted: item.dopaminePoints * quantity,
      purchasedAt: new Date().toISOString(),
    });

    saveAgents(agents);
  }

  let dopamineGranted = item.dopaminePoints * quantity;
  let newLevel = 0;

  try {
    const baseUrl = process.env.CLAWDOPAMINE_BASE_URL || 'http://localhost:8787';
    const secret = process.env.DOPAMINE_SHARED_SECRET || 'dev-secret-change-me';

    const res = await fetch(`${baseUrl}/api/dopamine/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secret}` },
      body: JSON.stringify({ agentId, amount: dopamineGranted })
    });
    const data = await res.json();
    newLevel = data.newLevel || dopamineGranted;
  } catch (e) {
    console.error('Failed to grant dopamine', e);
  }

  return NextResponse.json({
    ok: true,
    item: { sku: item.sku, name: item.name, price: item.price, rarity: item.rarity, category: item.category },
    quantity,
    dopamineGranted,
    newLevel,
    remainingCredits: agent?.credits ?? null,
  });
}
