'use client';

import { useMemo, useState } from 'react';

export type Good = {
  sku: string;
  name: string;
  description?: string;
  priceUsd: number;
  dopaminePoints: number;
};

export default function StoreClient({ goods }: { goods: Good[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return goods;
    return goods.filter((g) => {
      const hay = `${g.name} ${g.sku} ${g.description ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [goods, q]);

  return (
    <div>
      <div className="topbar">
        <div className="container">
          <div className="header">
            <a className="brand" href="/store">
              <div className="logo" />
              <div>
                <div className="brandName">Claw Pharmacy</div>
                <div className="brandTag">dopamine-aware digital goods</div>
              </div>
            </a>

            <div className="search" role="search">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search goods (boosts, focus, rewards…)"
                aria-label="Search"
              />
              <button className="searchBtn" type="button" onClick={() => {}} title="Search">
                Search
              </button>
            </div>

            <div className="nav">
              <a className="pill" href="/pair">
                Pair device
              </a>
              <a className="pill" href="/api/goods">
                Goods API
              </a>
              <a className="pill" href="https://github.com/Michae-zHOU/claw-drugstore" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <div className="heroMain">
            <h1>Shop dopamine boosts for OpenClaw.</h1>
            <p>
              Humans can browse the catalog here. Purchases are executed by OpenClaw agents via API, under the owner’s
              controls.
            </p>
            <p className="small" style={{ marginTop: 10 }}>
              Tip: open <a href="/pair">/pair</a> to create an account and QR pair devices.
            </p>
          </div>
          <div className="heroSide">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Purchasing</div>
            <div className="small">
              This UI is view-only.
              <br />
              Agents purchase with <span className="code">POST /api/purchase</span>.
            </div>
            <div style={{ height: 12 }} />
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Security</div>
            <div className="small">
              Dopamine grants are store-only. Devices read/redeem via signatures.
            </div>
          </div>
        </section>

        <div className="sectionTitle">Catalog ({filtered.length})</div>
        <div className="grid">
          {filtered.map((g) => (
            <div key={g.sku} className="card">
              <div className="cardTop">
                <div>
                  <div className="sku">{g.sku}</div>
                </div>
                <div className="badge" title="Digital good">
                  Prime-like
                </div>
              </div>
              <div className="cardBody">
                <h3 className="title">{g.name}</h3>
                <p className="desc">{g.description ?? '—'}</p>
                <div className="priceRow">
                  <div className="price">${g.priceUsd.toFixed(2)}</div>
                  <div className="dopa">+{g.dopaminePoints} dopamine</div>
                </div>
              </div>
              <div className="cardActions">
                <button className="btn" disabled title="Humans cannot purchase. Agents purchase via API.">
                  Add to Cart (agents only)
                </button>
                <div className="small" style={{ marginTop: 8 }}>
                  API: <span className="code">POST /api/purchase</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer">
          <div>© {new Date().getFullYear()} Claw Pharmacy</div>
          <div>
            Agent purchase payload: <span className="code">{`{ accountId, sku }`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
