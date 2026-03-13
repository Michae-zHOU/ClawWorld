'use client';

import { useMemo, useState } from 'react';
import DopamineChart from './DopamineChart';

type ViewResponse = {
  accountId: string;
  level: number;
  maxLevel: number;
  decayPerHour: number;
  devices: Array<{ id: string; label?: string | null; fingerprint: string; createdAt: string }>;
  events: Array<{ id: string; delta: number; reason?: string | null; meta?: unknown; createdAt: string }>;
  rewardTokens: Array<{
    code: string;
    delta: number;
    createdAt: string;
    expiresAt: string;
    redeemedAt?: string | null;
    redeemedBy?: string | null;
  }>;
};

export default function DopamineClient() {
  const dopamineBase = useMemo(
    () => process.env.NEXT_PUBLIC_CLAWDOPAMINE_BASE_URL ?? 'http://localhost:8787',
    []
  );

  const [accountId, setAccountId] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [data, setData] = useState<ViewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadView() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${dopamineBase}/v1/accounts/view`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accountId, recoveryCode })
      });
      if (!res.ok) throw new Error(await res.text());
      const next = (await res.json()) as ViewResponse;
      setData(next);
    } catch (e) {
      setData(null);
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const percent = data ? Math.max(0, Math.min(100, (data.level / data.maxLevel) * 100)) : 0;

  return (
    <div>
      <div className="topbar">
        <div className="container">
          <div className="header">
            <a className="brand" href="/store">
              <div className="logo" />
              <div>
                <div className="brandName">Claw Pharmacy</div>
                <div className="brandTag">view your dopamine</div>
              </div>
            </a>
            <div className="nav" style={{ marginLeft: 'auto' }}>
              <a className="pill" href="/store">Store</a>
              <a className="pill" href="/dopamine" style={{ borderColor: 'var(--accent)', opacity: 1 }}>Dopamine</a>
              <a className="pill" href="/psyche">Psyche</a>
              <a className="pill" href="/pair">Pair</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <div className="heroMain">
            <h1>Your dopamine dashboard.</h1>
            <p>
              Enter your <span className="code">accountId</span> and <span className="code">recoveryCode</span> to
              view your current dopamine level, recent activity, paired devices, and reward tokens.
            </p>
          </div>
          <div className="heroSide">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>What you’ll see</div>
            <div className="small">
              Current level, decay rate, recent grants, device fingerprints, and token redemption status.
            </div>
          </div>
        </section>

        <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', marginTop: 18 }}>
          <div className="card">
            <div className="cardBody">
              <h3 className="title">Lookup account</h3>
              <p className="desc" style={{ minHeight: 0 }}>
                You can create an account at <a href="/pair">/pair</a> if you don’t have one yet.
              </p>

              <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                <label>
                  <div className="small" style={{ marginBottom: 6 }}>accountId</div>
                  <input className="textInput" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
                </label>
                <label>
                  <div className="small" style={{ marginBottom: 6 }}>recoveryCode</div>
                  <input
                    className="textInput"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                  />
                </label>
                <button
                  className="btn btnActive"
                  type="button"
                  disabled={!accountId || !recoveryCode || loading}
                  onClick={() => void loadView()}
                >
                  {loading ? 'Loading…' : 'View dopamine'}
                </button>
              </div>

              {err ? (
                <pre className="errorBox" style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{err}</pre>
              ) : null}
            </div>
          </div>

          <div className="card">
            <div className="cardBody">
              <div className="small">Current dopamine</div>
              <div style={{ fontSize: 42, fontWeight: 950, marginTop: 4 }}>
                {data ? data.level.toFixed(1) : '—'}
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                max {data?.maxLevel ?? '—'} · decays {data?.decayPerHour ?? '—'}/hr
              </div>
              <div className="meter" style={{ marginTop: 14 }}>
                <div className="meterFill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {data ? (
          <>
            <div className="sectionTitle">Dopamine history</div>
            <div className="card" style={{ marginTop: 0 }}>
              <div className="cardBody">
                <DopamineChart
                  events={data.events}
                  maxLevel={data.maxLevel}
                  decayPerHour={data.decayPerHour}
                  currentLevel={data.level}
                />
              </div>
            </div>

            <div className="sectionTitle">Paired devices ({data.devices.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {data.devices.length ? (
                data.devices.map((device) => (
                  <div key={device.id} className="card">
                    <div className="cardBody">
                      <h3 className="title">{device.label || 'Unnamed device'}</h3>
                      <div className="small" style={{ marginTop: 8 }}>
                        Fingerprint: <span className="code">{device.fingerprint.slice(0, 18)}…</span>
                      </div>
                      <div className="small" style={{ marginTop: 8 }}>
                        Added: {new Date(device.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No paired devices yet.</div></div></div>
              )}
            </div>

            <div className="sectionTitle">Recent dopamine events ({data.events.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {data.events.length ? (
                data.events.map((event) => (
                  <div key={event.id} className="card">
                    <div className="cardBody">
                      <div className="priceRow">
                        <div className="title">{event.delta >= 0 ? '+' : ''}{event.delta.toFixed(1)}</div>
                        <div className="small">{new Date(event.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="desc" style={{ minHeight: 0 }}>{event.reason || 'No reason provided'}</div>
                      {event.meta ? (
                        <pre className="metaBox">{JSON.stringify(event.meta, null, 2)}</pre>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No dopamine events yet.</div></div></div>
              )}
            </div>

            <div className="sectionTitle">Reward tokens ({data.rewardTokens.length})</div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {data.rewardTokens.length ? (
                data.rewardTokens.map((token) => (
                  <div key={token.code} className="card">
                    <div className="cardBody">
                      <div className="priceRow">
                        <div className="title">+{token.delta.toFixed(1)} token</div>
                        <div className="badge">{token.redeemedAt ? 'Redeemed' : 'Active'}</div>
                      </div>
                      <div className="small" style={{ marginTop: 8 }}>
                        <span className="code">{token.code}</span>
                      </div>
                      <div className="small" style={{ marginTop: 8 }}>
                        Expires: {new Date(token.expiresAt).toLocaleString()}
                      </div>
                      {token.redeemedAt ? (
                        <div className="small" style={{ marginTop: 8 }}>
                          Redeemed: {new Date(token.redeemedAt).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card"><div className="cardBody"><div className="small">No reward tokens yet.</div></div></div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
