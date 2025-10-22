export type User = {
  uid: string;
  email: string;
  handle: string;
  role: "user" | "admin";
  kycStatus: "none" | "basic";
  createdAt: number; // timestamp
};

export type Wallet = {
  uid: string;
  balanceDemo: number;
  lockedDemo: number;
  updatedAt: number; // timestamp
};

export type Competition = {
  id: string;
  name: string;
  region: string;
  level: "club" | "international";
  isActive: boolean;
};

export type Team = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logoId: string;
};

export type Fixture = {
  id: string;
  betfairEventId?: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  startTimeUtc: number; // timestamp
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "ABANDONED";
  rawBetfair?: object;
};

export type Market = {
  id: string;
  fixtureId: string;
  type: "MATCH_WINNER";
  state: "DRAFT" | "OPEN" | "LOCKED" | "RESOLVED" | "VOID";
  feeBps: number;
  createdBy: string; // uid
  publishedAt?: number; // timestamp
  resolution?: "YES" | "NO" | "VOID"; // YES means home team won
  resolvedAt?: number; // timestamp
};

export type Pool = {
  marketId: string;
  xYes: number; // shares backing home team
  yNo: number; // shares backing away team
  k: number;
  lastPriceYes: number;
  lastPriceNo: number;
  liquiditySeed: number;
  updatedAt: number; // timestamp
  volume24h: number;
};

export type Trade = {
  tradeId: string;
  uid: string;
  marketId: string;
  side: "YES" | "NO";
  amount: number; // in demo credits
  shares: number;
  avgPrice: number;
  fee: number;
  clientTxnId: string;
  createdAt: number; // timestamp
};

export type Position = {
  uid: string;
  marketId: string;
  yesShares: number;
  noShares: number;
  avgPriceYes: number;
  avgPriceNo: number;
  realizedPnl: number;
  unrealizedPnl: number;
  updatedAt: number; // timestamp
};

export type Settlement = {
  marketId: string;
  outcome: "YES" | "NO" | "VOID";
  proofUrl?: string;
  notes?: string;
  resolvedAt: number; // timestamp
};

export type AuditLog = {
  logId: string;
  actorType: "ADMIN" | "SYSTEM" | "USER";
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  payload: object;
  createdAt: number; // timestamp
};
