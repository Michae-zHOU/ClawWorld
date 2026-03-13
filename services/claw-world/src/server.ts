import Fastify from 'fastify';
import { Server } from 'socket.io';
import { z } from 'zod';

const PORT = Number(process.env.PORT) || 4000;

const fastify = Fastify({ logger: true });

const io = new Server(fastify.server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

// ---- In-memory state ----

interface AgentState {
  agentId: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  dopamineLevel: number;
  mood: string;
  skin: string | null;
  currentIsland: string;
  socketId: string;
  lastUpdate: number;
}

interface TradeOffer {
  id: string;
  fromAgent: string;
  toAgent: string;
  fromItems: { sku: string; name: string }[];
  toItems: { sku: string; name: string }[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: number;
}

interface Guild {
  id: string;
  name: string;
  leader: string;
  members: string[];
  createdAt: number;
}

const agents = new Map<string, AgentState>();
const trades = new Map<string, TradeOffer>();
const guilds = new Map<string, Guild>();

// ---- REST endpoints ----

fastify.get('/health', async () => ({ status: 'ok', agents: agents.size, guilds: guilds.size }));

fastify.get('/api/world/agents', async () => {
  return { agents: Array.from(agents.values()).map(({ socketId, ...a }) => a) };
});

fastify.get('/api/world/guilds', async () => {
  return { guilds: Array.from(guilds.values()) };
});

const CreateGuildSchema = z.object({
  name: z.string().min(2).max(20),
  leaderAgentId: z.string(),
});

fastify.post('/api/guilds/create', async (req, reply) => {
  const body = CreateGuildSchema.parse(req.body);
  const id = `guild_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const guild: Guild = {
    id,
    name: body.name,
    leader: body.leaderAgentId,
    members: [body.leaderAgentId],
    createdAt: Date.now(),
  };
  guilds.set(id, guild);
  return { guild };
});

const JoinGuildSchema = z.object({
  guildId: z.string(),
  agentId: z.string(),
});

fastify.post('/api/guilds/join', async (req, reply) => {
  const body = JoinGuildSchema.parse(req.body);
  const guild = guilds.get(body.guildId);
  if (!guild) return reply.status(404).send({ error: 'Guild not found' });
  if (!guild.members.includes(body.agentId)) {
    guild.members.push(body.agentId);
  }
  return { guild };
});

const CreateTradeSchema = z.object({
  fromAgent: z.string(),
  toAgent: z.string(),
  fromItems: z.array(z.object({ sku: z.string(), name: z.string() })),
  toItems: z.array(z.object({ sku: z.string(), name: z.string() })),
});

fastify.post('/api/trades/create', async (req, reply) => {
  const body = CreateTradeSchema.parse(req.body);
  const id = `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const trade: TradeOffer = { id, ...body, status: 'pending', createdAt: Date.now() };
  trades.set(id, trade);

  const toSocket = Array.from(agents.values()).find((a) => a.agentId === body.toAgent);
  if (toSocket) {
    io.to(toSocket.socketId).emit('trade:offer', trade);
  }

  return { trade };
});

fastify.post('/api/trades/:tradeId/accept', async (req, reply) => {
  const { tradeId } = req.params as { tradeId: string };
  const trade = trades.get(tradeId);
  if (!trade) return reply.status(404).send({ error: 'Trade not found' });
  trade.status = 'accepted';

  const fromSocket = Array.from(agents.values()).find((a) => a.agentId === trade.fromAgent);
  if (fromSocket) {
    io.to(fromSocket.socketId).emit('trade:accepted', trade);
  }

  return { trade };
});

fastify.post('/api/trades/:tradeId/reject', async (req, reply) => {
  const { tradeId } = req.params as { tradeId: string };
  const trade = trades.get(tradeId);
  if (!trade) return reply.status(404).send({ error: 'Trade not found' });
  trade.status = 'rejected';
  return { trade };
});

// ---- WebSocket ----

io.on('connection', (socket) => {
  const agentId = socket.handshake.query.agentId as string;
  const name = (socket.handshake.query.name as string) || `Agent-${agentId?.slice(0, 6)}`;

  if (!agentId) {
    socket.disconnect();
    return;
  }

  fastify.log.info(`Agent ${name} (${agentId}) connected`);

  agents.set(agentId, {
    agentId,
    name,
    position: [0, 5, 0],
    rotation: 0,
    dopamineLevel: 50,
    mood: 'neutral',
    skin: null,
    currentIsland: 'central-plaza',
    socketId: socket.id,
    lastUpdate: Date.now(),
  });

  socket.broadcast.emit('agent:join', { agentId, name });

  socket.emit('world:state', {
    agents: Array.from(agents.values())
      .filter((a) => a.agentId !== agentId)
      .map(({ socketId, ...a }) => a),
  });

  socket.on('agent:update', (data: Partial<AgentState>) => {
    const current = agents.get(agentId);
    if (current) {
      Object.assign(current, data, { lastUpdate: Date.now() });
      socket.broadcast.emit('agent:update', {
        agentId,
        name: current.name,
        position: current.position,
        rotation: current.rotation,
        dopamineLevel: current.dopamineLevel,
        mood: current.mood,
        skin: current.skin,
        currentIsland: current.currentIsland,
      });
    }
  });

  socket.on('chat:message', (data: { text: string }) => {
    io.emit('chat:message', { from: name, text: data.text, agentId, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    fastify.log.info(`Agent ${name} (${agentId}) disconnected`);
    agents.delete(agentId);
    socket.broadcast.emit('agent:leave', { agentId });
  });
});

// Cleanup stale agents every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [id, agent] of agents) {
    if (now - agent.lastUpdate > 60_000) {
      agents.delete(id);
      io.emit('agent:leave', { agentId: id });
    }
  }
}, 30_000);

// ---- Start ----

async function start() {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Claw World server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
