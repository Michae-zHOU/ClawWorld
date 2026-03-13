'use client';

import { useMemo, useState } from 'react';
import QRCode from 'qrcode';

type CreateAccountRes = { accountId: string; recoveryCode: string };

type InviteRes = {
  inviteCode: string;
  expiresAt: string;
  qrPayload: { baseUrl: string; inviteCode: string };
};

export default function PairPage() {
  const [account, setAccount] = useState<CreateAccountRes | null>(null);
  const [invite, setInvite] = useState<InviteRes | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const dopamineBase = useMemo(
    () => (process.env.NEXT_PUBLIC_CLAWDOPAMINE_BASE_URL ?? 'http://localhost:8787'),
    []
  );

  async function createAccount() {
    setErr(null);
    setInvite(null);
    setQrDataUrl(null);

    const res = await fetch(`${dopamineBase}/v1/accounts/create`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as CreateAccountRes;
    setAccount(data);
  }

  async function createInvite() {
    if (!account) return;
    setErr(null);
    setInvite(null);
    setQrDataUrl(null);

    const res = await fetch(`${dopamineBase}/v1/pairing/invite`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ accountId: account.accountId, recoveryCode: account.recoveryCode, ttlSeconds: 300 })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as InviteRes;
    setInvite(data);

    const payload = JSON.stringify(data.qrPayload);
    const url = await QRCode.toDataURL(payload, { margin: 1, width: 280 });
    setQrDataUrl(url);
  }

  return (
    <div>
      <div className="topbar">
        <div className="container">
          <div className="header">
            <a className="brand" href="/store">
              <div className="logo" />
              <div>
                <div className="brandName">Claw Pharmacy</div>
                <div className="brandTag">pair devices securely</div>
              </div>
            </a>
            <div className="nav" style={{ marginLeft: 'auto' }}>
              <a className="pill" href="/store">Store</a>
              <a className="pill" href="/dopamine">Dopamine</a>
              <a className="pill" href="/psyche">Psyche</a>
              <a className="pill" href="/pair" style={{ borderColor: 'var(--accent)', opacity: 1 }}>Pair</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <div className="heroMain">
            <h1>Pair a new device to a dopamine account.</h1>
            <p>
              This page is agent-first but human-readable: create an account, generate a short-lived QR invite, then
              use that invite on a second machine to claim a device key.
            </p>
          </div>
          <div className="heroSide">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Pairing flow</div>
            <div className="small">
              1) Create account
              <br />
              2) Create invite
              <br />
              3) Claim device with <span className="code">POST /v1/devices/claim</span>
            </div>
          </div>
        </section>

        <div className="card" style={{ marginTop: 18 }}>
          <div className="cardBody">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btnActive" onClick={() => createAccount().catch((e) => setErr(String(e)))}>
                1) Create account
              </button>
              <button
                className="btn"
                disabled={!account}
                onClick={() => createInvite().catch((e) => setErr(String(e)))}
              >
                2) Create QR invite
              </button>
            </div>

            {err ? (
              <pre className="errorBox" style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{err}</pre>
            ) : null}
          </div>
        </div>

        {account ? (
          <>
            <div className="sectionTitle">Account credentials</div>
            <div className="card">
              <div className="cardBody">
                <div className="small">
                  accountId: <span className="code">{account.accountId}</span>
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  recoveryCode: <span className="code">{account.recoveryCode}</span>
                </div>
                <div className="small" style={{ marginTop: 10 }}>
                  Save your recovery code securely. It is required for account view and pairing operations.
                </div>
              </div>
            </div>
          </>
        ) : null}

        {invite ? (
          <>
            <div className="sectionTitle">Active invite</div>
            <div className="grid" style={{ gridTemplateColumns: '0.95fr 1.05fr' }}>
              <div className="card">
                <div className="cardBody">
                  <div className="small">inviteCode</div>
                  <div style={{ marginTop: 6 }}>
                    <span className="code">{invite.inviteCode}</span>
                  </div>
                  <div className="small" style={{ marginTop: 12 }}>
                    expiresAt: <span className="code">{invite.expiresAt}</span>
                  </div>
                  <div className="small" style={{ marginTop: 12 }}>
                    This invite is short-lived and can be redeemed once by a device.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="cardBody">
                  <div className="small" style={{ marginBottom: 10 }}>Scan QR on the target machine</div>
                  {qrDataUrl ? <img src={qrDataUrl} alt="pairing qr" style={{ borderRadius: 10 }} /> : null}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <div className="cardBody">
                <details>
                  <summary>QR payload JSON</summary>
                  <pre className="metaBox" style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(invite.qrPayload, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </>
        ) : null}

        <div className="footer">
          <div>
            Next step on new machine: call <span className="code">POST /v1/devices/claim</span> with inviteCode and publicKey.
          </div>
          <div>Pairing endpoint is agent-automation friendly.</div>
        </div>
      </div>
    </div>
  );
}
