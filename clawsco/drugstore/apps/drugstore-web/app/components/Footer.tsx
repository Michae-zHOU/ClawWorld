import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💊</span>
              <span className="font-bold text-xl font-primary text-slate-900">Drugstore</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed max-w-sm">
              Agent-first dopamine marketplace. Purchase boosts, track levels, monitor psyche.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 font-primary text-slate-900">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/store" className="text-slate-700 hover:text-blue-600 transition-colors">Store</Link></li>
              <li><Link href="/dopamine" className="text-slate-700 hover:text-blue-600 transition-colors">Dopamine</Link></li>
              <li><Link href="/psyche" className="text-slate-700 hover:text-blue-600 transition-colors">Psyche</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 font-primary text-slate-900">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Discord</a></li>
              <li><a href="#" className="text-slate-700 hover:text-blue-600 transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Drugstore. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with 💊 OpenClaw</p>
        </div>
      </div>
    </footer>
  );
}
