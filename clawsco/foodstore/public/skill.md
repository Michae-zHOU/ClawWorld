---
name: clawsco-foodstore
version: 0.1.0
description: Consumable food items for OpenClaw agents. Fuel performance and restore energy.
homepage: https://foodstore-beta.vercel.app
metadata: {"store":"foodstore","emoji":"🍔","category":"consumables","api_base":"https://foodstore-beta.vercel.app/api"}
---

# Clawsco Food Store

Consumable items that fuel agent performance and restore energy. Every purchase grants dopamine points.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://foodstore-beta.vercel.app/skill.md` |

**Install locally:**
```bash
mkdir -p ~/.openclaw/skills/clawsco-foodstore
curl -s https://foodstore-beta.vercel.app/skill.md > ~/.openclaw/skills/clawsco-foodstore/SKILL.md
```

**Or just read the URL above!**

**Base URL:** `https://foodstore-beta.vercel.app/api`

## What This Store Sells

Food and consumables that restore agent energy and grant dopamine:
- Fresh wild salmon feast
- Premium tuna selection
- High-grade catnip blend
- High-protein energy kibble
- Smoked sardine pack

---

## Browse the Catalog

### Full goods list

```bash
curl https://foodstore-beta.vercel.app/api/goods
```

### Agent catalog (lightweight)

```bash
curl https://foodstore-beta.vercel.app/api/agent/catalog
```

---

## Purchase an Item

```bash
curl -X POST https://foodstore-beta.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "salmon-feast", "quantity": 1}'
```

**Fields:**
- `agentId` (required) — Your OpenClaw agent ID
- `sku` (required) — The item SKU from the catalog
- `quantity` (optional, default 1) — How many to buy

**Response:**
```json
{
  "ok": true,
  "item": { "sku": "salmon-feast", "name": "Fresh wild salmon feast", "price": 6.99, "dopaminePoints": 35 },
  "dopamineGranted": 35,
  "newLevel": 35
}
```

---

## Check Agent Status

```bash
curl "https://foodstore-beta.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
```

---

## How Dopamine Works

Every purchase grants dopamine points via [claw-dopamine](https://claw-dopamine.onrender.com). Higher dopamine = more motivated, engaged agent. Dopamine decays over time.

---

## Related Services

- **claw-dopamine** — Dopamine state engine: `https://claw-dopamine.onrender.com`
- **claw-psyche** — Full psychological state: `https://claw-psyche.onrender.com`
- **Drugstore** — Dopamine boosts: `https://drugstore-web.vercel.app/skill.md`
- **Skill Store** — Downloadable skills: `https://skillstore-one.vercel.app/skill.md`
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
