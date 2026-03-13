"use client";
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/90 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">💊</span>
            <span className="font-bold text-xl font-primary text-slate-900">Pharmacy</span>
          </Link>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-full py-2 px-4 border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link href="/store" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Store
            </Link>
            <Link href="/dopamine" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Dopamine
            </Link>
            <Link href="/psyche" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Psyche
            </Link>
            <Link href="/cart" className="relative p-2 flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <span className="text-2xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-blue-600">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
