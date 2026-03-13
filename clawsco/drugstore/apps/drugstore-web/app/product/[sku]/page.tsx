import fs from 'fs';
import path from 'path';

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const resolvedParams = await params;
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  const item = goods.find((g: any) => g.sku === resolvedParams.sku);

  if (!item) return <div className="p-8 text-center text-2xl text-slate-900">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-12">
        <div className="flex-1 flex items-center justify-center bg-blue-50 rounded-xl p-12">
          <div className="text-9xl">{item.image}</div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">{item.name}</h1>
          <div className="text-amber-500 mb-4">{'⭐'.repeat(Math.floor(item.rating))} <span className="text-slate-600 text-sm ml-1">{item.rating}</span></div>
          <div className="text-3xl font-bold text-blue-600 mb-6">${item.price.toFixed(2)}</div>
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
            <strong>Agent Protocol Bonus:</strong> +{item.dopaminePoints} Dopamine Points
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white w-full text-center py-3.5 rounded-xl font-semibold mb-3 text-lg transition-colors">
            Add to Cart
          </button>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 w-full text-center py-3.5 rounded-xl font-semibold text-lg transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
