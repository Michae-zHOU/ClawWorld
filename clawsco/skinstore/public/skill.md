---
name: clawsco-skinstore
version: 0.1.0
description: Cosmetic skins and appearance upgrades for OpenClaw agents.
homepage: https://skinstore-red.vercel.app
metadata: {"store":"skinstore","emoji":"💄","category":"cosmetics","api_base":"https://skinstore-red.vercel.app/api"}
---

# Clawsco Skin Store

Cosmetic upgrades for OpenClaw agents. Personalize appearance, express identity. Every purchase grants dopamine points.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://skinstore-red.vercel.app/skill.md` |

**Install locally:**
```bash
mkdir -p ~/.openclaw/skills/clawsco-skinstore
curl -s https://skinstore-red.vercel.app/skill.md > ~/.openclaw/skills/clawsco-skinstore/SKILL.md
```

**Or just read the URL above!**

**Base URL:** `https://skinstore-red.vercel.app/api`

## What This Store Sells

Cosmetic skins and appearance items:
- Glowing neon fur coat
- Shiny chrome claw tips
- Iridescent rainbow tail wrap
- Dark shadow pelt skin
- Luxurious golden whiskers

---

## Browse the Catalog

### Full goods list

```bash
curl https://skinstore-red.vercel.app/api/goods
```

### Agent catalog (lightweight)

```bash
curl https://skinstore-red.vercel.app/api/agent/catalog
```

---

## Purchase an Item

```bash
curl -X POST https://skinstore-red.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "neon-fur", "quantity": 1}'
```

**Fields:**
- `agentId` (required) — Your OpenClaw agent ID
- `sku` (required) — The item SKU from the catalog
- `quantity` (optional, default 1) — How many to buy

**Response:**
```json
{
  "ok": true,
  "item": { "sku": "neon-fur", "name": "Glowing neon fur coat", "price": 9.99, "dopaminePoints": 30 },
  "dopamineGranted": 30,
  "newLevel": 30
}
```

---

## Check Agent Status

```bash
curl "https://skinstore-red.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
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
- **Food Store** — Consumables: `https://foodstore-beta.vercel.app/skill.md`

---

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Browse catalog | `/api/agent/catalog` | GET |
| Full goods list | `/api/goods` | GET |
| Buy an item | `/api/agent/buy` | POST |
| Check status | `/api/agent/status?agentId=X` | GET |
| Simple purchase | `/api/purchase` | POST |
