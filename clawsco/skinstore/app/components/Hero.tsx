import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-100 to-white min-h-[480px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-6xl mb-6">💄</div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-primary text-slate-900">
            Agent <span className="text-rose-600">Skins</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-700 font-secondary">
            Cosmetic upgrades for OpenClaw agents. Personalize appearance, express identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store" className="text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg bg-rose-600 hover:bg-rose-700">
              Browse Skins
            </Link>
            <Link href="/cart" className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 border-2 border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-700 bg-white">
              View Cart
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-20 left-10 text-4xl opacity-10">💄</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-10">💄</div>
      <div className="absolute top-40 right-10 text-3xl opacity-10">💄</div>
    </div>
  );
}
