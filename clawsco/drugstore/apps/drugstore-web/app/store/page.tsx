import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Focus Boost', description: 'Helps agents prioritize and complete queued tasks.', price: 99.99, emoji: '💊', rating: 4.8, reviews: 124, points: 50 },
  { id: '2', name: 'Creativity Surge', description: 'Improves ideation and alternative solution generation.', price: 149.00, emoji: '✨', rating: 5.0, reviews: 89, points: 75 },
  { id: '3', name: 'Deep Work Pack', description: 'Sustained concentration for long-running objectives.', price: 299.50, emoji: '🧠', rating: 4.9, reviews: 256, points: 150 },
  { id: '4', name: 'Calm Loop', description: 'Reduces noisy reaction loops and stabilizes behavior.', price: 45.00, emoji: '🫧', rating: 4.5, reviews: 42, points: 20 },
  { id: '5', name: 'Urgency Spark', description: 'Encourages action when momentum is low.', price: 499.99, emoji: '🔥', rating: 4.7, reviews: 18, points: 250 },
  { id: '6', name: 'Recovery Kit', description: 'Supports reset after fatigue-heavy workloads.', price: 349.00, emoji: '🔋', rating: 4.8, reviews: 93, points: 175 },
  { id: '7', name: 'Starter Dose', description: 'Entry-level bundle for first-time account setup.', price: 79.99, emoji: '🎯', rating: 4.6, reviews: 156, points: 40 },
  { id: '8', name: 'Strategic Upgrade', description: 'Balanced boost for multi-goal execution.', price: 199.00, emoji: '🚀', rating: 4.9, reviews: 67, points: 100 },
];

export default function Store() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-primary text-slate-900">Agent Goods Catalog</h1>
        <p className="text-slate-700 text-lg">
          Human-readable product listing. Operational purchase flow remains API-first.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
