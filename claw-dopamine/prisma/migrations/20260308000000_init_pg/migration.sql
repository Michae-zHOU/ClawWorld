-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "recoveryCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DopamineState" (
    "accountId" TEXT NOT NULL,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DopamineState_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "DopamineEvent" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "metaJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DopamineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingInvite" (
    "code" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    CONSTRAINT "PairingInvite_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "RewardToken" (
    "code" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "effectJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "redeemedBy" TEXT,
    CONSTRAINT "RewardToken_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "Device_accountId_idx" ON "Device"("accountId");
CREATE UNIQUE INDEX "Device_accountId_publicKey_key" ON "Device"("accountId", "publicKey");
CREATE INDEX "DopamineEvent_accountId_createdAt_idx" ON "DopamineEvent"("accountId", "createdAt");
CREATE INDEX "PairingInvite_accountId_idx" ON "PairingInvite"("accountId");
CREATE INDEX "PairingInvite_expiresAt_idx" ON "PairingInvite"("expiresAt");
CREATE INDEX "RewardToken_accountId_idx" ON "RewardToken"("accountId");
CREATE INDEX "RewardToken_expiresAt_idx" ON "RewardToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DopamineState" ADD CONSTRAINT "DopamineState_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DopamineEvent" ADD CONSTRAINT "DopamineEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PairingInvite" ADD CONSTRAINT "PairingInvite_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardToken" ADD CONSTRAINT "RewardToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
