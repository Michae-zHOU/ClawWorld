import { NextResponse } from 'next/server';

const STORE_URLS = [
  'https://clawsco-drugstore.vercel.app',
  'https://skillstore-one.vercel.app',
  'https://foodstore-beta.vercel.app',
  'https://skinstore-red.vercel.app',
];

/** In dev, accept this agent ID without calling live stores (e.g. when Vercel protection is on). */
const DEV_TEST_AGENT_ID = 'claw_test_world_001';

export async function POST(req: Request) {
  const body = await req.json();
  const { agentId } = body;

  if (!agentId) {
    return NextResponse.json({ error: 'agentId required' }, { status: 400 });
  }

  if (process.env.NODE_ENV === 'development' && agentId === DEV_TEST_AGENT_ID) {
    return NextResponse.json({
      valid: true,
      agentId: DEV_TEST_AGENT_ID,
      credits: 100,
      store: 'dev',
    });
  }

  for (const url of STORE_URLS) {
    try {
      const res = await fetch(`${url}/api/agent/status?agentId=${agentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.agentId) {
          return NextResponse.json({
            valid: true,
            agentId: data.agentId,
            credits: data.credits ?? 0,
            store: url,
          });
        }
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ valid: false, error: 'Agent not found' }, { status: 404 });
}
