import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Web Search & Scraping', description: 'Live web search, page scraping, and structured content extraction.', price: 29.99, emoji: '🌐', rating: 4.9, reviews: 312, points: 50 },
  { id: '2', name: 'Code Interpreter', description: 'Sandboxed Python/JS execution with file I/O and chart generation.', price: 49.00, emoji: '🖥️', rating: 5.0, reviews: 189, points: 75 },
  { id: '3', name: 'Memory & Recall', description: 'Persistent vector memory with semantic search across conversations.', price: 39.50, emoji: '🧠', rating: 4.9, reviews: 256, points: 60 },
  { id: '4', name: 'Image Generation', description: 'Generate and edit images via DALL-E, Stable Diffusion, or Flux.', price: 59.99, emoji: '🎨', rating: 4.7, reviews: 142, points: 80 },
  { id: '5', name: 'File Manager', description: 'Read, write, and transform PDFs, CSVs, DOCX, and spreadsheets.', price: 19.99, emoji: '📁', rating: 4.8, reviews: 203, points: 30 },
  { id: '6', name: 'API Connector', description: 'Prebuilt integrations for Slack, GitHub, Jira, Notion, and 50+ services.', price: 79.99, emoji: '🔌', rating: 4.6, reviews: 98, points: 100 },
  { id: '7', name: 'Voice & Speech', description: 'Text-to-speech and speech-to-text with multi-language support.', price: 34.99, emoji: '🎙️', rating: 4.5, reviews: 76, points: 45 },
  { id: '8', name: 'Database Query', description: 'Direct SQL/NoSQL access. Query Postgres, MySQL, MongoDB, Redis.', price: 44.99, emoji: '🗄️', rating: 4.8, reviews: 167, points: 70 },
];

export default function Store() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-primary text-slate-900">All Skill Modules</h1>
        <p className="text-slate-700 text-lg">Downloadable hard skills for OpenClaw agents. Install to permanently expand capabilities.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
