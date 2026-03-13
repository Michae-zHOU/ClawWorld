"use client";
import { useCart } from './CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  rating: number;
  reviews: number;
  points: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji
    });
  };

  return (
    <div className="group rounded-2xl p-6 border border-slate-300 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-7xl bg-violet-100 transition-transform duration-300 group-hover:scale-105">
        {product.emoji}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg font-primary text-slate-900">{product.name}</h3>
        <span className="font-bold text-lg text-violet-600">${product.price.toFixed(2)}</span>
      </div>
      
      <p className="text-sm text-slate-700 mb-4 line-clamp-2 font-secondary">
        {product.description}
      </p>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="text-sm text-amber-500">
          {'★'.repeat(Math.floor(product.rating))}
        </div>
        <span className="text-xs text-slate-600">({product.reviews})</span>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
          +{product.points} ⚡pts
        </div>
        <button 
          onClick={handleAdd}
          className="text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md active:scale-95 bg-violet-600 hover:bg-violet-700"
        >
          Install Skill
        </button>
      </div>
    </div>
  );
}
