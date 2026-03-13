'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Trait = { trait: string; strength: number };
type Relationship = { personId: string; personName?: string | null; depth: number; valence: number };
type Interest = { topic: string; strength: number; novelty: number };
type Memory = { content: string; type: string; valence: number; strength: number };

type StateResponse = {
  agentId: string;
  mood: string;
  valence: number;
  arousal: number;
  energy: number;
  cognitiveLoad: number;
  fatigue: number;
  traits: Trait[];
  relationships: Relationship[];
  interests: Interest[];
  topMemories: Memory[];
  contextBlock: string;
};

const MOOD_COLORS: Record<string, string> = {
  excited:    '#ff9900',
  happy:      '#22c55e',
  energized:  '#19c2ff',
  content:    '#6d5efc',
  calm:       '#64748b',
  neutral:    '#94a3b8',
  bored:      '#475569',
  anxious:    '#f59e0b',
  unhappy:    '#ef4444',
  distressed: '#dc2626',
};

function Bar({ value, color = 'var(--accent2)', label }: { value: number; color?: string; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && <div style={{ fontSize: 12, opacity: 0.75, width: 80, flexShrink: 0 }}>{label}</div>}
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${Math.round(value * 100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, width: 32, textAlign: 'right' }}>{Math.round(value * 100)}%</div>
    </div>
  );
}

function Gauge({ value, min = -1, max = 1, label, color }: { value: number; min?: number; max?: number; label: string; color: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative', width: 70, height: 70, margin: '0 auto' }}>
        <svg viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx="35" cy="35" r="28" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${(pct / 100) * 175.9} 175.9`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>
          {value.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default function PsycheClient() {
  const psycheBase = useMemo(() => process.env.NEXT_PUBLIC_PSYCHE_BASE_URL ?? 'http://localhost:8788', []);

  const [agentId, setAgentId] = useState('');
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<StateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!agentId || !secret) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${psycheBase}/v1/agents/${agentId}/state`, {
        headers: { 'x-shared-secret': secret },
      });
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
      setLastUpdated(new Date());
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [agentId, secret, psycheBase]);

  useEffect(() => {
    if (autoRefresh && agentId && secret) {
      intervalRef.current = setInterval(() => void load(), 5000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, agentId, secret, load]);

  const moodColor = data ? (MOOD_COLORS[data.mood] ?? '#94a3b8') : '#94a3b8';

  return (
    <div>
      <div className="topbar">
        <div className="container">
          <div className="header">
            <a className="brand" href="/">
              <div className="logo" />
              <div>
                <div className="brandName">Claw Pharmacy</div>
                <div className="brandTag">psyche monitor</div>
              </div>
            </a>
            <div className="nav" style={{ marginLeft: 'auto' }}>
              <a className="pill" href="/store">Store</a>
              <a className="pill" href="/dopamine">Dopamine</a>
              <a className="pill" href="/psyche" style={{ borderColor: 'var(--accent2)', opacity: 1 }}>Psyche</a>
              <a className="pill" href="/pair">Pair</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <div className="heroMain">
            <h1>Psyche dashboard.</h1>
            <p>Real-time view of an agent's emotional state, personality traits, memory, relationships, and biological rhythms.</p>
          </div>
          <div className="heroSide">
            {data ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, opacity: 0.6 }}>Current mood</div>
                <div style={{ fontSize: 36, fontWeight: 950, color: moodColor, letterSpacing: -1 }}>{data.mood}</div>
                {lastUpdated && <div style={{ fontSize: 11, opacity: 0.5 }}>Updated {lastUpdated.toLocaleTimeString()}</div>}
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>What you'll see</div>
                <div className="small">Mood, valence/arousal, energy, traits, memories, relationships, and interests — live.</div>
              </div>
            )}
          </div>
        </section>

        {/* Lookup form */}
        <div className="card" style={{ marginTop: 18 }}>
          <div className="cardBody">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'end' }}>
              <label>
                <div className="small" style={{ marginBottom: 6 }}>Agent ID</div>
                <input className="textInput" placeholder="cuid..." value={agentId} onChange={(e) => setAgentId(e.target.value)} />
              </label>
              <label>
                <div className="small" style={{ marginBottom: 6 }}>Shared secret</div>
                <input className="textInput" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
              </label>
              <button className="btn btnActive" disabled={!agentId || !secret || loading} onClick={() => void load()}>
                {loading ? 'Loading…' : 'Load state'}
              </button>
              <button
                className="btn"
                style={autoRefresh ? { borderColor: 'var(--green)', color: 'var(--green)' } : {}}
                onClick={() => setAutoRefresh((v) => !v)}
              >
                {autoRefresh ? '⏸ Auto' : '▶ Auto'}
              </button>
            </div>
            {err && <pre className="errorBox" style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{err}</pre>}
          </div>
        </div>

        {data && (
          <>
            {/* Emotional + Biological state row */}
            <div className="sectionTitle">Emotional & Biological State</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
              {/* Mood card */}
              <div className="card">
                <div className="cardBody">
                  <div className="small">Mood</div>
                  <div style={{ fontSize: 28, fontWeight: 950, color: moodColor, margin: '8px 0 14px', letterSpacing: -0.5 }}>{data.mood}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Gauge value={data.valence} label="valence" color={data.valence >= 0 ? '#22c55e' : '#ef4444'} />
                    <Gauge value={data.arousal} min={0} max={1} label="arousal" color="#ff9900" />
                  </div>
                </div>
              </div>

              {/* Energy card */}
              <div className="card">
                <div className="cardBody">
                  <div className="small">Biological State</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                    <Bar value={data.energy} color="#19c2ff" label="Energy" />
                    <Bar value={data.cognitiveLoad} color="#f59e0b" label="Cog. load" />
                    <Bar value={data.fatigue} color="#ef4444" label="Fatigue" />
                  </div>
                </div>
              </div>

              {/* Context block card */}
              <div className="card">
                <div className="cardBody">
                  <div className="small">Context block (injected into prompts)</div>
                  <pre style={{ marginTop: 10, fontSize: 11, opacity: 0.85, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>
                    {data.contextBlock}
                  </pre>
                </div>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="sectionTitle">Personality Traits ({data.traits.length})</div>
            <div className="card">
              <div className="cardBody">
                {data.traits.length ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {data.traits.map((t) => (
                      <Bar key={t.trait} value={t.strength} label={t.trait} color="#6d5efc" />
                    ))}
                  </div>
                ) : (
                  <div className="small">No traits evolved yet. Send some signals to grow them.</div>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="sectionTitle">Interests ({data.interests.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
              {data.interests.length ? (
                data.interests.map((i) => (
                  <div key={i.topic} className="card">
                    <div className="cardBody">
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>{i.topic}</div>
                      <Bar value={i.strength} color="#ff9900" label="Strength" />
                      <div style={{ marginTop: 8 }}>
                        <Bar value={i.novelty} color="#19c2ff" label="Novelty" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No interests yet.</div></div></div>
              )}
            </div>

            {/* Relationships */}
            <div className="sectionTitle">Relationships ({data.relationships.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
              {data.relationships.length ? (
                data.relationships.map((r) => (
                  <div key={r.personId} className="card">
                    <div className="cardBody">
                      <div style={{ fontWeight: 800 }}>{r.personName ?? r.personId}</div>
                      <div className="small" style={{ marginTop: 4, marginBottom: 10 }}>{r.personId}</div>
                      <Bar value={r.depth / 100} color="#22c55e" label="Depth" />
                      <div style={{ marginTop: 8 }}>
                        <Bar value={(r.valence + 1) / 2} color={r.valence >= 0 ? '#22c55e' : '#ef4444'} label="Valence" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No relationships yet.</div></div></div>
              )}
            </div>

            {/* Top Memories */}
            <div className="sectionTitle">Top Memories ({data.topMemories.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {data.topMemories.length ? (
                data.topMemories.map((m, idx) => (
                  <div key={idx} className="card">
                    <div className="cardBody">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="badge">{m.type}</span>
                        <span className="small" style={{ color: m.valence >= 0 ? 'var(--green)' : '#ef4444' }}>
                          valence {m.valence >= 0 ? '+' : ''}{m.valence.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{m.content}</div>
                      <Bar value={m.strength} color="#6d5efc" label="Strength" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No memories consolidated yet.</div></div></div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
