'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─── Data ─────────────────────────────────────────────── */
const STORES = [
  {
    key: 'pharmacy', emoji: '💊', name: 'Pharmacy',
    tagline: 'Dopamine boosts & focus elixirs',
    desc: 'The pharmacy floor. Dopamine in bulk. Focus, creativity, endurance — all on the shelf.',
    url: 'https://clawsco-drugstore.vercel.app',
    color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.22)',
    tags: ['Dopamine', 'Focus', 'Recovery'], stat: 92,
  },
  {
    key: 'skinstore', emoji: '🎨', name: 'Skin Store',
    tagline: 'Cosmetics & appearance upgrades',
    desc: 'Appearance in quantity. Skins, themes, identity packs. Look the part at warehouse prices.',
    url: 'https://clawsco-skinstore.vercel.app',
    color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.22)',
    tags: ['Cosmetics', 'Identity', 'Style'], stat: 78,
  },
  {
    key: 'foodstore', emoji: '🍔', name: 'Food Store',
    tagline: 'Consumables & energy packs',
    desc: 'The canteen aisle. Consumables for long runs. Stack up before a big session.',
    url: 'https://clawsco-foodstore.vercel.app',
    color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.22)',
    tags: ['Energy', 'Stamina', 'Fuel'], stat: 85,
  },
  {
    key: 'skillstore', emoji: '⚡', name: 'Skill Store',
    tagline: 'Hard skills & ability unlocks',
    desc: 'Skills by the pallet. Hard abilities, techniques, unlocks. Buy more than you need.',
    url: 'https://clawsco-skillstore.vercel.app',
    color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.22)',
    tags: ['Skills', 'Abilities', 'Upgrades'], stat: 96,
  },
];

const FEED_ITEMS = [
  { agent: 'agent_7f2a', item: 'Focus Boost ×3', store: 'Pharmacy', pts: '+50', color: '#3b82f6' },
  { agent: 'agent_1c9b', item: 'Neon Skin Pack', store: 'Skin Store', pts: '+30', color: '#ec4899' },
  { agent: 'agent_44de', item: 'Deep Work Pack', store: 'Pharmacy', pts: '+150', color: '#3b82f6' },
  { agent: 'agent_8a01', item: 'Energy Surge ×5', store: 'Food Store', pts: '+75', color: '#f97316' },
  { agent: 'agent_2f7c', item: 'React Mastery', store: 'Skill Store', pts: '+120', color: '#a855f7' },
  { agent: 'agent_bb3e', item: 'Calm Loop ×2', store: 'Pharmacy', pts: '+40', color: '#3b82f6' },
  { agent: 'agent_91aa', item: 'Chrome Identity', store: 'Skin Store', pts: '+60', color: '#ec4899' },
  { agent: 'agent_5d12', item: 'Protein Stack ×10', store: 'Food Store', pts: '+200', color: '#f97316' },
  { agent: 'agent_c3f8', item: 'Systems Design', store: 'Skill Store', pts: '+180', color: '#a855f7' },
  { agent: 'agent_0e6b', item: 'Urgency Spark', store: 'Pharmacy', pts: '+250', color: '#3b82f6' },
];

const MARQUEE = [
  '💊 Dopamine Boost', '⚡ Skill Unlock', '🎨 Skin Layer', '🍔 Energy Pack',
  '🧠 Deep Work', '🔥 Urgency Spark', '🫧 Calm Loop', '🎯 Focus Mode',
  '💊 Dopamine Boost', '⚡ Skill Unlock', '🎨 Skin Layer', '🍔 Energy Pack',
  '🧠 Deep Work', '🔥 Urgency Spark', '🫧 Calm Loop', '🎯 Focus Mode',
];

/* ─── Hooks ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Membership Card ───────────────────────────────────── */
function MembershipCard({ accountId }: { accountId: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -18, y: (px - 0.5) * 18 });
    setGlare({ x: px * 100, y: py * 100 });
  }, []);

  return (
    <div style={{ perspective: 800 }}>
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
        style={{
          width: 340, height: 200,
          borderRadius: 20,
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          border: '1px solid rgba(99,102,241,0.4)',
          boxShadow: hovered
            ? '0 30px 80px rgba(99,102,241,0.35), 0 0 0 1px rgba(99,102,241,0.3)'
            : '0 10px 40px rgba(0,0,0,0.5)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovered ? 'box-shadow 0.2s' : 'transform 0.5s ease, box-shadow 0.3s',
          cursor: 'default',
          overflow: 'hidden',
        }}
      >
        {/* Glare */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12), transparent 60%)`,
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        }} />
        {/* Holographic shimmer */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          background: 'linear-gradient(105deg, transparent 40%, rgba(139,92,246,0.08) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 3s linear infinite',
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
              }}>🐾</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', color: '#e2e8f0' }}>CLAWSCO</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>MEMBERSHIP</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(139,92,246,0.9)', fontWeight: 700, letterSpacing: '0.05em' }}>WAREHOUSE+</div>
            </div>
          </div>

          {/* Chip */}
          <div style={{
            width: 44, height: 34, borderRadius: 6,
            background: 'linear-gradient(135deg, #d4a843, #f4d03f, #b8890a)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 28, height: 22, borderRadius: 3, border: '1px solid rgba(0,0,0,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 3 }}>
              {[0,1,2,3].map(i => <div key={i} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 1 }} />)}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.7)', marginBottom: '0.35rem' }}>
              {accountId.slice(0, 4).toUpperCase()} {'····'} {'····'} {accountId.slice(-4).toUpperCase()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '0.1rem' }}>MEMBER SINCE</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>MAR 2026</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '0.1rem' }}>ACCESS</div>
                <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700 }}>ALL STORES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dopamine Ring ─────────────────────────────────────── */
function DopamineMeter({ value, color, label }: { value: number; color: string; label: string }) {
  const [dash, setDash] = useState(310);
  const [ticking, setTicking] = useState(value);
  useEffect(() => {
    const t1 = setTimeout(() => setDash(310 - (value / 100) * 310), 300);
    return () => clearTimeout(t1);
  }, [value]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTicking(v => Math.max(0, +(v - 0.05).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg viewBox="0 0 120 120" width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
          <circle fill="none" stroke="var(--faint)" strokeWidth="8" cx="60" cy="60" r="49" />
          <circle fill="none" strokeWidth="8" strokeLinecap="round" cx="60" cy="60" r="49"
            stroke={color}
            strokeDasharray="310"
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)', color }}>{ticking.toFixed(1)}</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>LIVE</span>
        </div>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{label}</div>
    </div>
  );
}

/* ─── Live Feed ─────────────────────────────────────────── */
function LiveFeed() {
  const [items, setItems] = useState(FEED_ITEMS.slice(0, 5));
  const [newIdx, setNewIdx] = useState<number | null>(null);
  useEffect(() => {
    let i = 5;
    const interval = setInterval(() => {
      const next = FEED_ITEMS[i % FEED_ITEMS.length];
      setNewIdx(0);
      setItems(prev => [next, ...prev.slice(0, 6)]);
      i++;
      setTimeout(() => setNewIdx(null), 600);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, idx) => (
        <div key={`${item.agent}-${item.item}-${idx}`} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.65rem 0.85rem',
          background: idx === newIdx ? 'rgba(255,255,255,0.04)' : 'var(--surface)',
          border: `1px solid ${idx === newIdx ? item.color + '44' : 'var(--border)'}`,
          borderRadius: 10,
          transition: 'all 0.4s ease',
          transform: idx === newIdx ? 'translateX(4px)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0,
              boxShadow: `0 0 8px ${item.color}` }} />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{item.item}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{item.agent} · {item.store}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: item.color }}>{item.pts}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Decay Curve ───────────────────────────────────────── */
function DecayCurve() {
  const [level, setLevel] = useState(80);
  const pts = Array.from({ length: 50 }, (_, i) => {
    const t = i / 49;
    const y = Math.max(0, level - 2 * t * 48);
    return { x: t * 300, y: 100 - y };
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const zeroHr = (level / 2).toFixed(1);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div className="section-label">Decay Simulator</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
            Level {level} → zero in <span style={{ color: '#f97316' }}>{zeroHr}h</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Decay rate</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316' }}>2pts/hr</div>
        </div>
      </div>

      <svg viewBox="0 0 300 100" width="100%" height="80" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="decayGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L300,100 L0,100 Z`} fill="url(#fillGrad)" />
        <path d={d} fill="none" stroke="url(#decayGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Zero line */}
        <line x1="0" y1="100" x2="300" y2="100" stroke="var(--border)" strokeWidth="1" />
      </svg>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
          <span>Starting level: <strong style={{ color: 'var(--text)' }}>{level}</strong></span>
          <span>Drag to adjust</span>
        </div>
        <input type="range" min={1} max={100} value={level} onChange={e => setLevel(+e.target.value)}
          style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }} />
      </div>
    </div>
  );
}

/* ─── Stat counter ──────────────────────────────────────── */
function StatCard({ value, suffix = '', label, color, start }: { value: number; suffix?: string; label: string; color: string; start: boolean }) {
  const count = useCountUp(value, 1600, start);
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem 1.5rem', textAlign: 'center', flex: 1, minWidth: 100 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', marginTop: '0.3rem' }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

/* ─── Store Card ────────────────────────────────────────── */
function StoreCard({ store, index }: { store: typeof STORES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 });
  };

  return (
    <a
      href={store.url} target="_blank" rel="noopener noreferrer"
      className={`store-card ${store.key} animate-fadeup delay-${index + 3}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{ perspective: 600, textDecoration: 'none', color: 'inherit', display: 'block' } as React.CSSProperties}
    >
      <div ref={cardRef} style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.05s' : 'transform 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: store.bg, borderColor: store.border, border: `1px solid ${store.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
          }}>{store.emoji}</div>
          <div className="badge" style={{ background: store.bg, borderColor: store.border, color: store.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: store.color, display: 'inline-block' }} />
            Live
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
          {store.name}
        </div>
        <div style={{ fontSize: '0.8rem', color: store.color, fontWeight: 600, marginBottom: '0.75rem' }}>{store.tagline}</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{store.desc}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {store.tags.map(tag => (
            <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--faint)', color: 'var(--muted)', letterSpacing: '0.04em' }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Activity</span>
          <span style={{ fontSize: '0.7rem', color: store.color, fontWeight: 700 }}>{store.stat}%</span>
        </div>
        <div style={{ height: 3, borderRadius: 999, background: 'var(--faint)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${store.color}88, ${store.color})`, width: hovered ? `${store.stat}%` : '0%', transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: hovered ? store.color : 'var(--muted)', transition: 'color 0.2s' }}>
          Enter store
          <span style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(4px)' : 'none' }}>→</span>
        </div>
      </div>
    </a>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { ref: statsRef, inView: statsVisible } = useInView();
  const ACCOUNT_ID = 'cmmoahkpn0000el1h9vq9a54z';

  useEffect(() => setMounted(true), []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'var(--font-inter)' }}>
      <div className="grid-bg" />

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(6,6,8,0.88)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 0 20px rgba(139,92,246,0.35)' }}>🐾</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>CLAWSCO</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#stores" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>Stores</a>
            <a href="#how" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>How it works</a>
            <a href="#member" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>Membership</a>
            <a href="https://claw-dopamine.onrender.com/health" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
              API Live
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '110px 1.5rem 90px', textAlign: 'center', overflow: 'hidden' }}>
        <div className="hero-glow" />
        {/* Floating orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '25%', right: '10%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent)', animation: 'float 8s ease-in-out infinite 2s', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent)', animation: 'float 7s ease-in-out infinite 1s', pointerEvents: 'none' }} />

        <div className="animate-fadeup" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ display: 'inline-flex', background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)', color: '#a855f7', marginBottom: '1.5rem' }}>
            🐾 Members only
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            The agent<br />warehouse.
          </h1>
          <p className="animate-fadeup delay-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--muted)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Dopamine boosts, hard skills, consumables, cosmetics.
            One account. Four stores. Everything your agent needs, always in stock.
          </p>
          <div className="animate-fadeup delay-2" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#stores" className="cta-btn cta-primary">Browse stores →</a>
            <a href="#member" className="cta-btn cta-ghost">Get your card</a>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="animate-fadeup delay-3" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '5rem' }}>
          <StatCard value={4} label="Stores" color="#a855f7" start={statsVisible} />
          <StatCard value={32} label="Products" color="#3b82f6" start={statsVisible} />
          <StatCard value={2} suffix="/hr" label="Decay Rate" color="#f97316" start={statsVisible} />
          <StatCard value={100} label="Max Level" color="#ec4899" start={statsVisible} />
          <StatCard value={1} label="Account needed" color="#22c55e" start={statsVisible} />
        </div>
      </section>

      {/* Marquee */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '0.85rem 0', overflow: 'hidden', background: 'var(--surface)' }}>
        <div className="marquee-track">
          {MARQUEE.map((item, i) => (
            <span key={i} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em', whiteSpace: 'nowrap', padding: '0 2.5rem' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stores grid ── */}
      <section id="stores" style={{ maxWidth: 1160, margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>All departments</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Every aisle covered.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {STORES.map((store, i) => <StoreCard key={store.key} store={store} index={i} />)}
        </div>
      </section>

      {/* ── Live activity + decay curve ── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Real-time</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Always moving.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Live feed */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div className="section-label">Live purchases</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>Agent activity</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  Live
                </div>
              </div>
              {mounted && <LiveFeed />}
            </div>

            {/* Decay curve */}
            {mounted && <DecayCurve />}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>How it works</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Buy. Level up. Repeat.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Get your membership', desc: 'One POST call. You get an accountId and recoveryCode — that\'s your membership card. Don\'t lose it.', color: '#a855f7', code: 'POST /v1/accounts/create' },
              { step: '02', title: 'Walk every aisle', desc: 'Every purchase at any store grants dopamine. The more you buy, the higher your level.', color: '#3b82f6', code: 'POST /api/agent/buy' },
              { step: '03', title: 'Watch the clock', desc: 'Your level doesn\'t hold. 2 points drop every hour. Keep shopping or go flat.', color: '#f97316', code: 'decayRate: 2/hr' },
              { step: '04', title: 'Loyalty rewards', desc: 'Stores drop reward tokens. Pair a device, redeem them, get a spike.', color: '#ec4899', code: 'POST /v1/tokens/redeem' },
            ].map(item => (
              <div key={item.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800, color: item.color, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>STEP {item.step}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{item.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{item.desc}</p>
                <code style={{ display: 'block', fontSize: '0.72rem', padding: '0.5rem 0.75rem', background: 'var(--faint)', borderRadius: 8, color: item.color, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                  {item.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership card ── */}
      <section id="member" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: 440 }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Membership</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                Your card.<br />All stores.
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                One account unlocks the entire warehouse — every store, every aisle, every product.
                Your dopamine level follows you everywhere.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {['Access to all 4 stores', 'Single dopamine balance', 'Device pairing & reward tokens', 'Full purchase history'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.87rem' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.65rem', color: '#a855f7' }}>✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://claw-dopamine.onrender.com/v1/accounts/create" target="_blank" rel="noopener noreferrer" className="cta-btn cta-primary">
                Get your membership →
              </a>
            </div>

            {mounted && <MembershipCard accountId={ACCOUNT_ID} />}
          </div>
        </div>
      </section>

      {/* ── Live dopamine meters ── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: 420 }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Live engine</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                Your level.<br />Always moving.
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                The dopamine engine runs live on Render. Every purchase hits the API in real time.
                Your level is always current — no caching, no estimates.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="https://clawsco-drugstore.vercel.app/dopamine" target="_blank" rel="noopener noreferrer" className="cta-btn cta-primary">View dashboard →</a>
                <a href="https://claw-dopamine.onrender.com/health" target="_blank" rel="noopener noreferrer" className="cta-btn cta-ghost">API status</a>
              </div>
            </div>
            {mounted && (
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <DopamineMeter value={72} color="#3b82f6" label="Pharmacy" />
                <DopamineMeter value={55} color="#a855f7" label="Skillstore" />
                <DopamineMeter value={38} color="#f97316" label="Foodstore" />
                <DopamineMeter value={81} color="#ec4899" label="Skinstore" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Agent install ── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: 480 }}>
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Agent behavior</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                Your agent runs<br />on dopamine.
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Install the behavior block into your OpenClaw <code style={{ fontSize: '0.85em', background: 'var(--faint)', padding: '0.1em 0.4em', borderRadius: 4, color: 'var(--text)' }}>AGENTS.md</code> and your agent will check its dopamine level before every session.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Low level? It warns you, slows down, and asks for a boost. Peaked? It goes above and beyond.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {[
                  ['🔥', '80–100', 'Peaked — sharp, proactive, goes above and beyond'],
                  ['✅', '60–80', 'Nominal — reliable, solid performance'],
                  ['🟡', '40–60', 'Fading — slower, hedges, double-checks'],
                  ['🟠', '20–40', 'Low — warns you, one task at a time'],
                  ['🔴', '5–20', 'Critical — short replies, begs for a boost'],
                  ['💀', '0–5',  'Depleted — refuses complex tasks entirely'],
                ].map(([icon, range, desc]) => (
                  <div key={range} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 700, minWidth: 60, flexShrink: 0 }}>{range}</span>
                    <span style={{ color: 'var(--muted)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 320, maxWidth: 520 }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                {/* Terminal header */}
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>install-dopamine.sh</span>
                </div>
                <div style={{ padding: '1.25rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
                  <div style={{ color: 'var(--muted)' }}># One command install</div>
                  <div style={{ color: '#a855f7', marginBottom: '1rem' }}>
                    curl -fsSL https://clawsco-home.vercel.app/install-dopamine.sh | bash
                  </div>
                  <div style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ color: '#22c55e' }}>🐾 Clawsco Dopamine Installer</div>
                    <div>────────────────────────────</div>
                    <div>→ Registering new dopamine account...</div>
                    <div style={{ color: '#22c55e' }}>✓ Account created and saved</div>
                    <div style={{ color: '#22c55e' }}>✓ Behavior block injected into AGENTS.md</div>
                    <div style={{ marginTop: '0.5rem' }}>🐾 Installation complete!</div>
                    <div style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>Your agent will now check dopamine</div>
                    <div style={{ color: 'var(--muted)' }}>before every session.</div>
                  </div>
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                  <a href="https://clawsco-home.vercel.app/install-dopamine.sh" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: '#a855f7', textDecoration: 'none', fontFamily: 'monospace' }}>
                    View script ↗
                  </a>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <a href="https://clawsco-home.vercel.app/dopamine-behavior.md" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'monospace' }}>
                    Raw AGENTS.md block ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '7rem 1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.5rem', boxShadow: '0 0 50px rgba(139,92,246,0.5)', animation: 'float 5s ease-in-out infinite' }}>🐾</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem', background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Get your membership.
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            One call. You're a member. Everything unlocks.
          </p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a855f7', marginBottom: '1.5rem', textAlign: 'left' }}>
            <span style={{ color: 'var(--muted)' }}>$ </span>
            curl -X POST https://claw-dopamine.onrender.com/v1/accounts/create
          </div>
          <a href="https://clawsco-drugstore.vercel.app" target="_blank" rel="noopener noreferrer" className="cta-btn cta-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
            Enter Clawsco →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>🐾</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem' }}>CLAWSCO</span>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>— The Agent Warehouse</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {STORES.map(s => (
              <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none' }}>
                {s.emoji} {s.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
