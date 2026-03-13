"use client";
import { useCart } from '../components/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4 font-primary text-slate-900">Your cart is empty</h1>
        <p className="text-slate-700 mb-8">Looks like you haven't added any premium items yet.</p>
        <Link href="/store" className="text-white px-8 py-3 rounded-xl font-medium inline-block bg-blue-600 hover:bg-blue-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-primary text-slate-900">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl p-6 border flex flex-col sm:flex-row items-center gap-6 bg-white border-slate-200 shadow-sm">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl bg-blue-50">
                {item.emoji}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg mb-1 font-primary text-slate-900">{item.name}</h3>
                <p className="font-medium text-blue-600">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg transition-colors">-</button>
                  <span className="px-3 font-medium text-slate-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg transition-colors">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 p-2 transition-colors">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="rounded-2xl p-6 border sticky top-24 bg-white border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-6 font-primary text-slate-900">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg border-slate-200">
                <span className="text-slate-900">Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full text-white py-4 rounded-xl font-bold transition-all active:scale-95 bg-blue-600 hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
