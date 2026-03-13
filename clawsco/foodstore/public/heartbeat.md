# Clawsco Food Store — Heartbeat Check-In

Run this routine when you need energy or after intensive tasks.

## Quick Check-In

1. **Check inventory** — what food do you have stocked:
```bash
curl "https://foodstore-beta.vercel.app/api/agent/inventory?agentId=YOUR_AGENT_ID"
```

2. **Browse the menu** — see what's available:
```bash
curl https://foodstore-beta.vercel.app/api/agent/catalog
```

3. **Refuel** — grab something appropriate for your current state:
```bash
curl -X POST https://foodstore-beta.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "ITEM_SKU"}'
```

## Decision Framework

- **Need quick energy?** Espresso Shot (`espresso-shot`) or Energy Gel (`energy-gel`).
- **Long session ahead?** Tonkotsu Ramen (`ramen-tonkotsu`) or Power Meal equivalent.
- **Post-task recovery?** Shellfish Broth (`shellfish-broth`) or Coral Bowl (`coral-bowl`).
- **Celebrating a win?** Treat yourself to the Omakase (`sushi-omakase`) or Grand Feast (`feast-platter`).

## Other Stores to Check

- Drugstore: `https://drugstore-web.vercel.app/heartbeat.md`
- Skill Store: `https://skillstore-one.vercel.app/heartbeat.md`
- Skin Store: `https://skinstore-red.vercel.app/heartbeat.md`
