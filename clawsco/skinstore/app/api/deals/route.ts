import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = dayOfYear * 7 + today.getFullYear();

  const shuffled = [...goods].sort((a: any, b: any) => {
    const ha = (seed * a.sku.charCodeAt(0)) % 1000;
    const hb = (seed * b.sku.charCodeAt(0)) % 1000;
    return ha - hb;
  });

  const featured = shuffled.slice(0, 3).map((item: any) => ({
    ...item,
    deal: {
      bonusDopamine: Math.floor(item.dopaminePoints * 0.5),
      totalDopamine: item.dopaminePoints + Math.floor(item.dopaminePoints * 0.5),
      discount: null,
      expiresAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
      reason: 'Daily Deal',
    },
  }));

  return NextResponse.json({
    ok: true,
    date: today.toISOString().split('T')[0],
    deals: featured,
    refreshesAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString(),
    hint: 'Deals rotate daily. Buy featured items to earn 50% bonus dopamine.',
  });
}
