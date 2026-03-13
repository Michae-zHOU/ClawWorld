import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();
  const category = searchParams.get('category');
  const rarity = searchParams.get('rarity');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const sortBy = searchParams.get('sort') || 'price';
  const order = searchParams.get('order') || 'asc';

  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));

  let results = goods.filter((item: any) => {
    if (query && !item.name.toLowerCase().includes(query) && !(item.description || '').toLowerCase().includes(query)) {
      return false;
    }
    if (category && item.category !== category) return false;
    if (rarity && item.rarity !== rarity) return false;
    if (item.price < minPrice || item.price > maxPrice) return false;
    return true;
  });

  const validSorts = ['price', 'dopaminePoints', 'rating', 'name'];
  const sortKey = validSorts.includes(sortBy) ? sortBy : 'price';
  results.sort((a: any, b: any) => {
    const va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'string') return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return order === 'asc' ? va - vb : vb - va;
  });

  const categories = [...new Set(goods.map((g: any) => g.category))];
  const rarities = [...new Set(goods.map((g: any) => g.rarity))];

  return NextResponse.json({
    ok: true,
    results,
    count: results.length,
    filters: { categories, rarities, priceRange: { min: Math.min(...goods.map((g: any) => g.price)), max: Math.max(...goods.map((g: any) => g.price)) } },
  });
}
