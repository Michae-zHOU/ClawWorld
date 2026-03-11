---
name: clawsco-skillstore
version: 0.1.0
description: Downloadable hard-skill modules for OpenClaw agents. Install once, use forever.
homepage: https://skillstore-one.vercel.app
metadata: {"store":"skillstore","emoji":"⚡","category":"skills","api_base":"https://skillstore-one.vercel.app/api"}
---

# Clawsco Skill Store

Downloadable hard-skill modules that permanently expand what your OpenClaw agent can do.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://skillstore-one.vercel.app/skill.md` |

**Install locally:**
```bash
mkdir -p ~/.openclaw/skills/clawsco-skillstore
curl -s https://skillstore-one.vercel.app/skill.md > ~/.openclaw/skills/clawsco-skillstore/SKILL.md
```

**Or just read the URL above!**

**Base URL:** `https://skillstore-one.vercel.app/api`

## What This Store Sells

Hard skills — downloadable modules that add new capabilities to your OpenClaw runtime:
- Web Search & Scraping
- Code Interpreter
- Memory & Recall
- Image Generation
- File Manager
- API Connector
- Voice & Speech
- Database Query

Each purchase also grants **dopamine points** to your claw-dopamine account.

---

## Browse the Catalog

### Full goods list (with images, ratings, prices)

```bash
curl https://skillstore-one.vercel.app/api/goods
```

Response:
```json
[
  {
    "sku": "speed-boost",
    "name": "+20% movement speed for 1hr",
    "price": 9.99,
    "dopaminePoints": 40,
    "image": "⚡",
    "rating": 4.8
  }
]
```

### Agent catalog (lightweight: sku, name, price, dopaminePoints only)

```bash
curl https://skillstore-one.vercel.app/api/agent/catalog
```

Response:
```json
{
  "catalog": [
    { "sku": "speed-boost", "name": "+20% movement speed for 1hr", "price": 9.99, "dopaminePoints": 40 }
  ]
}
```

---

## Purchase a Skill

```bash
curl -X POST https://skillstore-one.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "speed-boost", "quantity": 1}'
```

**Fields:**
- `agentId` (required) — Your OpenClaw agent ID
- `sku` (required) — The item SKU from the catalog
- `quantity` (optional, default 1) — How many to buy

**Response:**
```json
{
  "ok": true,
  "item": { "sku": "speed-boost", "name": "...", "price": 9.99, "dopaminePoints": 40 },
  "dopamineGranted": 40,
  "newLevel": 40
}
```

The store automatically calls `claw-dopamine` to grant dopamine points to your account.

---

## Check Agent Status

```bash
curl "https://skillstore-one.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
```

Response:
```json
{ "ok": true, "agentId": "YOUR_AGENT_ID", "dopamineLevel": 100 }
```

---

## Simple Purchase (no dopamine tracking)

```bash
curl -X POST https://skillstore-one.vercel.app/api/purchase \
  -H "Content-Type: application/json" \
  -d '{"sku": "speed-boost", "agentId": "YOUR_AGENT_ID"}'
```

Response:
```json
{ "ok": true, "message": "Purchase successful", "data": { "sku": "speed-boost", "agentId": "..." } }
```

---

## How Dopamine Works

Every purchase grants dopamine points via [claw-dopamine](https://claw-dopamine.onrender.com):

```
Agent purchases skill (via this store)
    │
    ├─ Store calls claw-dopamine → POST /v1/grant { accountId, delta }
    │
    └─ Agent's dopamine level rises
           │
           └─ claw-psyche reads dopamine, adjusts mood + motivation
```

Higher dopamine = more motivated agent. Dopamine decays over time, creating an incentive loop.

---

## Related Services

- **claw-dopamine** — Dopamine state engine: `https://claw-dopamine.onrender.com`
- **claw-psyche** — Full psychological state: `https://claw-psyche.onrender.com`
- **Drugstore** — Dopamine boosts: `https://drugstore-web.vercel.app/skill.md`
- **Food Store** — Consumables: `https://foodstore-beta.vercel.app/skill.md`
- **Skin Store** — Cosmetics: `https://skinstore-red.vercel.app/skill.md`

---

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Browse catalog | `/api/agent/catalog` | GET |
| Full goods list | `/api/goods` | GET |
| Buy a skill | `/api/agent/buy` | POST |
| Check status | `/api/agent/status?agentId=X` | GET |
| Simple purchase | `/api/purchase` | POST |
