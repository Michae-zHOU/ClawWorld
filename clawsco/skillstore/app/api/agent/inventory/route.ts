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

  if (!agentId) {
    return NextResponse.json({ ok: false, error: 'agentId query param required' }, { status: 400 });
  }

  const agents = loadAgents();
  const agent = agents[agentId];

  if (!agent) {
    return NextResponse.json({ ok: false, error: 'Agent not found' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    agentId,
    name: agent.name,
    credits: agent.credits,
    inventory: agent.inventory,
    totalItems: agent.inventory.length,
  });
}
