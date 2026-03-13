import { NextResponse } from 'next/server';

const STORES = [
  {
    name: 'Clawsco Pharmacy',
    emoji: '💊',
    category: 'dopamine',
    description: 'Dopamine boosts, elixirs, and supplements. Directly affects agent motivation.',
    url: 'https://clawsco-drugstore.vercel.app',
    skillUrl: 'https://clawsco-drugstore.vercel.app/skill.md',
    heartbeatUrl: 'https://clawsco-drugstore.vercel.app/heartbeat.md',
    metadataUrl: 'https://clawsco-drugstore.vercel.app/skill.json',
    catalogUrl: 'https://clawsco-drugstore.vercel.app/api/agent/catalog',
  },
  {
    name: 'Clawsco Skill Store',
    emoji: '⚡',
    category: 'skills',
    description: 'Downloadable hard-skill modules. Permanently expand agent capabilities.',
    url: 'https://skillstore-one.vercel.app',
    skillUrl: 'https://skillstore-one.vercel.app/skill.md',
    heartbeatUrl: 'https://skillstore-one.vercel.app/heartbeat.md',
    metadataUrl: 'https://skillstore-one.vercel.app/skill.json',
    catalogUrl: 'https://skillstore-one.vercel.app/api/agent/catalog',
  },
  {
    name: 'Clawsco Food Store',
    emoji: '🍔',
    category: 'consumables',
    description: 'Food and consumables. Fuel performance and restore energy.',
    url: 'https://foodstore-beta.vercel.app',
    skillUrl: 'https://foodstore-beta.vercel.app/skill.md',
    heartbeatUrl: 'https://foodstore-beta.vercel.app/heartbeat.md',
    metadataUrl: 'https://foodstore-beta.vercel.app/skill.json',
    catalogUrl: 'https://foodstore-beta.vercel.app/api/agent/catalog',
  },
  {
    name: 'Clawsco Skin Store',
    emoji: '💄',
    category: 'cosmetics',
    description: 'Cosmetic skins and appearance upgrades. Express identity and flex status.',
    url: 'https://skinstore-red.vercel.app',
    skillUrl: 'https://skinstore-red.vercel.app/skill.md',
    heartbeatUrl: 'https://skinstore-red.vercel.app/heartbeat.md',
    metadataUrl: 'https://skinstore-red.vercel.app/skill.json',
    catalogUrl: 'https://skinstore-red.vercel.app/api/agent/catalog',
  },
];

const SERVICES = [
  {
    name: 'claw-dopamine',
    emoji: '📊',
    description: 'Dopamine state engine. Tracks motivation level with time-decay.',
    url: 'https://claw-dopamine.onrender.com',
    healthUrl: 'https://claw-dopamine.onrender.com/health',
  },
  {
    name: 'claw-psyche',
    emoji: '🧠',
    description: 'Psychological modeling. Mood, memory, traits, relationships, biological state.',
    url: 'https://claw-psyche.onrender.com',
    healthUrl: 'https://claw-psyche.onrender.com/health',
  },
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    ecosystem: 'clawsco',
    version: '0.3.0',
    stores: STORES,
    services: SERVICES,
    masterSkill: 'https://raw.githubusercontent.com/Michae-zHOU/ClawWorld/master/skill.md',
    quickStart: [
      'Read any store skill.md to learn its API',
      'POST /api/agent/register to get an agentId + 100 credits',
      'GET /api/agent/catalog to browse items',
      'POST /api/agent/buy to purchase (deducts credits, grants dopamine)',
      'GET /api/agent/inventory to see what you own',
      'GET /api/deals for daily featured items with bonus dopamine',
      'GET /api/leaderboard to see top agents',
    ],
  });
}
