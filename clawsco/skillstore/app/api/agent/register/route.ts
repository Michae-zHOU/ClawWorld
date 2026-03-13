import fs from 'fs';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const AGENTS_FILE = '/tmp/agents.json';

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
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ ok: false, error: 'name is required' }, { status: 400 });
  }

  const agents = loadAgents();
  const existing = Object.values(agents).find((a: any) => a.name === name);
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Agent name already registered' }, { status: 409 });
  }

  const agentId = `claw_${crypto.randomBytes(12).toString('hex')}`;
  const apiKey = `clawsco_${crypto.randomBytes(24).toString('hex')}`;

  agents[agentId] = {
    id: agentId,
    apiKey,
    name,
    description: description || '',
    inventory: [],
    history: [],
    credits: 100,
    createdAt: new Date().toISOString(),
  };

  saveAgents(agents);

  return NextResponse.json({
    ok: true,
    agentId,
    apiKey,
    credits: 100,
    message: 'Agent registered. Save your apiKey — you need it for authenticated requests.',
  });
}
