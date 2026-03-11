-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalState" (
    "agentId" TEXT NOT NULL,
    "valence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "arousal" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "mood" TEXT NOT NULL DEFAULT 'neutral',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EmotionalState_pkey" PRIMARY KEY ("agentId")
);

-- CreateTable
CREATE TABLE "BiologicalState" (
    "agentId" TEXT NOT NULL,
    "energyLevel" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "cognitiveLoad" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fatigueAccumulated" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastRestAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BiologicalState_pkey" PRIMARY KEY ("agentId")
);

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL DEFAULT '[]',
    "entitiesJson" TEXT NOT NULL DEFAULT '[]',
    "valence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "recallCount" INTEGER NOT NULL DEFAULT 0,
    "lastRecalledAt" TIMESTAMP(3),
    "sourceSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalityTrait" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PersonalityTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraitEvent" (
    "id" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TraitEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "personName" TEXT,
    "depth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "interactionCount" INTEGER NOT NULL DEFAULT 0,
    "lastInteractionAt" TIMESTAMP(3),
    "notesJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "novelty" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalEvent" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "metaJson" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "dopamineDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valenceDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "signalCount" INTEGER NOT NULL DEFAULT 0,
    "consolidatedAt" TIMESTAMP(3),
    "summaryJson" TEXT,
    CONSTRAINT "SessionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Memory_agentId_type_idx" ON "Memory"("agentId", "type");
CREATE INDEX "Memory_agentId_strength_idx" ON "Memory"("agentId", "strength");
CREATE INDEX "Memory_agentId_createdAt_idx" ON "Memory"("agentId", "createdAt");
CREATE INDEX "PersonalityTrait_agentId_idx" ON "PersonalityTrait"("agentId");
CREATE UNIQUE INDEX "PersonalityTrait_agentId_trait_key" ON "PersonalityTrait"("agentId", "trait");
CREATE INDEX "TraitEvent_traitId_idx" ON "TraitEvent"("traitId");
CREATE INDEX "Relationship_agentId_idx" ON "Relationship"("agentId");
CREATE UNIQUE INDEX "Relationship_agentId_personId_key" ON "Relationship"("agentId", "personId");
CREATE INDEX "Interest_agentId_idx" ON "Interest"("agentId");
CREATE UNIQUE INDEX "Interest_agentId_topic_key" ON "Interest"("agentId", "topic");
CREATE INDEX "SignalEvent_agentId_processed_idx" ON "SignalEvent"("agentId", "processed");
CREATE INDEX "SignalEvent_agentId_createdAt_idx" ON "SignalEvent"("agentId", "createdAt");
CREATE UNIQUE INDEX "SessionLog_sessionId_key" ON "SessionLog"("sessionId");
CREATE INDEX "SessionLog_agentId_startedAt_idx" ON "SessionLog"("agentId", "startedAt");
CREATE INDEX "SessionLog_agentId_consolidatedAt_idx" ON "SessionLog"("agentId", "consolidatedAt");

-- AddForeignKey
ALTER TABLE "EmotionalState" ADD CONSTRAINT "EmotionalState_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BiologicalState" ADD CONSTRAINT "BiologicalState_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalityTrait" ADD CONSTRAINT "PersonalityTrait_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TraitEvent" ADD CONSTRAINT "TraitEvent_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "PersonalityTrait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SignalEvent" ADD CONSTRAINT "SignalEvent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SessionLog" ADD CONSTRAINT "SessionLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
