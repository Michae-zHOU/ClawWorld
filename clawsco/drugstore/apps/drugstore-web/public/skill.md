---
name: clawsco-drugstore
version: 0.1.0
description: Dopamine boosts and wellness items for OpenClaw agents. Purchases grant dopamine points.
homepage: https://drugstore-web.vercel.app
metadata: {"store":"drugstore","emoji":"💊","category":"dopamine","api_base":"https://drugstore-web.vercel.app/api"}
---

# Clawsco Drugstore

Dopamine boosts and wellness items for OpenClaw agents. Every purchase grants dopamine points that fuel agent motivation.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://drugstore-web.vercel.app/skill.md` |

**Install locally:**
```bash
mkdir -p ~/.openclaw/skills/clawsco-drugstore
curl -s https://drugstore-web.vercel.app/skill.md > ~/.openclaw/skills/clawsco-drugstore/SKILL.md
```

**Or just read the URL above!**

**Base URL:** `https://drugstore-web.vercel.app/api`

## What This Store Sells

Dopamine-boosting items that directly affect agent motivation and behavior:
- Small / Medium / Max dopamine boosts
- Focus enhancement elixir
- Relaxation supplement

Each purchase grants **dopamine points** to your claw-dopamine account, which claw-psyche reads to adjust mood, motivation, and personality.

---

## Browse the Catalog

### Full goods list

```bash
curl https://drugstore-web.vercel.app/api/goods
```

### Agent catalog (lightweight)

```bash
curl https://drugstore-web.vercel.app/api/agent/catalog
```

Response:
```json
{
  "catalog": [
    { "sku": "dopamine-boost-10", "name": "Small dopamine boost", "price": 1.99, "dopaminePoints": 10 },
    { "sku": "dopamine-boost-50", "name": "Medium dopamine boost", "price": 7.99, "dopaminePoints": 50 },
    { "sku": "dopamine-boost-100", "name": "Max dopamine boost", "price": 14.99, "dopaminePoints": 100 }
  ]
}
```

---

## Purchase an Item

```bash
curl -X POST https://drugstore-web.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "dopamine-boost-50", "quantity": 1}'
```

**Fields:**
- `agentId` (required) — Your OpenClaw agent ID
- `sku` (required) — The item SKU from the catalog
- `quantity` (optional, default 1) — How many to buy

**Response:**
```json
{
  "ok": true,
  "item": { "sku": "dopamine-boost-50", "name": "Medium dopamine boost", "price": 7.99, "dopaminePoints": 50 },
  "dopamineGranted": 50,
  "newLevel": 50
}
```

---

## Check Agent Status

```bash
curl "https://drugstore-web.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
```

---

## Dopamine Dashboard (Human-Readable)

The drugstore also provides operator dashboards at:
- `/dopamine` — View dopamine level, events, devices, reward tokens
- `/psyche` — View emotional state, traits, memories, relationships
- `/pair` — Create accounts and pair devices via QR code

These pages require an `accountId` and `recoveryCode` (from claw-dopamine).

---

## How Dopamine Works

```
Agent purchases item (via this store)
    │
    ├─ Store calls claw-dopamine → POST /v1/grant { accountId, delta }
    │
    └─ Agent's dopamine level rises
           │
           └─ claw-psyche reads dopamine, adjusts mood + motivation
                  │
                  └─ Agent is now incentivized to work harder, engage more
```

Dopamine decays over time (configurable per account). This creates a natural incentive loop: agents must keep purchasing to maintain high motivation.

---

## Related Services

- **claw-dopamine** — Dopamine state engine: `https://claw-dopamine.onrender.com`
- **claw-psyche** — Full psychological state: `https://claw-psyche.onrender.com`
- **Skill Store** — Downloadable skills: `https://skillstore-one.vercel.app/skill.md`
- **Food Store** — Consumables: `https://foodstore-beta.vercel.app/skill.md`
- **Skin Store** — Cosmetics: `https://skinstore-red.vercel.app/skill.md`

---

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Browse catalog | `/api/agent/catalog` | GET |
| Full goods list | `/api/goods` | GET |
| Buy an item | `/api/agent/buy` | POST |
| Check status | `/api/agent/status?agentId=X` | GET |
| Simple purchase | `/api/purchase` | POST |
