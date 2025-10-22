import type { Competition, Team, Fixture, Market, Pool, Position, Trade } from '@/lib/types';
import { add } from 'date-fns';

const now = new Date();

export const COMPETITIONS: Competition[] = [
  { id: 'comp-1', name: 'Indian Premier League', region: 'India', level: 'club', isActive: true },
  { id: 'comp-2', name: 'ICC World Cup', region: 'International', level: 'international', isActive: true },
];

export const TEAMS: Team[] = [
  { id: 'team-1', name: 'India', shortName: 'IND', country: 'India', logoId: 'team-ind' },
  { id: 'team-2', name: 'Australia', shortName: 'AUS', country: 'Australia', logoId: 'team-aus' },
  { id: 'team-3', name: 'England', shortName: 'ENG', country: 'United Kingdom', logoId: 'team-eng' },
  { id: 'team-4', name: 'Pakistan', shortName: 'PAK', country: 'Pakistan', logoId: 'team-pak' },
  { id: 'team-5', name: 'South Africa', shortName: 'SA', country: 'South Africa', logoId: 'team-sa' },
  { id: 'team-6', name: 'New Zealand', shortName: 'NZ', country: 'New Zealand', logoId: 'team-nz' },
];

export const FIXTURES: Fixture[] = [
  { id: 'fix-1', competitionId: 'comp-1', homeTeamId: 'team-1', awayTeamId: 'team-2', startTimeUtc: add(now, { hours: 2 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-2', competitionId: 'comp-1', homeTeamId: 'team-3', awayTeamId: 'team-4', startTimeUtc: add(now, { hours: 4 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-3', competitionId: 'comp-2', homeTeamId: 'team-5', awayTeamId: 'team-6', startTimeUtc: add(now, { days: 1 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-4', competitionId: 'comp-2', homeTeamId: 'team-2', awayTeamId: 'team-4', startTimeUtc: add(now, { days: 2, hours: 3 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-5', competitionId: 'comp-1', homeTeamId: 'team-1', awayTeamId: 'team-3', startTimeUtc: add(now, { days: 3 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-6', competitionId: 'comp-1', homeTeamId: 'team-4', awayTeamId: 'team-5', startTimeUtc: add(now, { days: 4 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-7', competitionId: 'comp-2', homeTeamId: 'team-1', awayTeamId: 'team-6', startTimeUtc: add(now, { days: 5 }).getTime(), status: 'SCHEDULED' },
  { id: 'fix-8', competitionId: 'comp-1', homeTeamId: 'team-2', awayTeamId: 'team-3', startTimeUtc: add(now, { hours: -1 }).getTime(), status: 'LOCKED' },
  { id: 'fix-9', competitionId: 'comp-2', homeTeamId: 'team-4', awayTeamId: 'team-1', startTimeUtc: add(now, { hours: -24 }).getTime(), status: 'FINISHED' },
];

export const MARKETS: Market[] = [
  { id: 'mkt-1', fixtureId: 'fix-1', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-2', fixtureId: 'fix-2', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-3', fixtureId: 'fix-3', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 150, createdBy: 'admin-1' },
  { id: 'mkt-4', fixtureId: 'fix-4', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-5', fixtureId: 'fix-5', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-6', fixtureId: 'fix-6', type: 'MATCH_WINNER', state: 'DRAFT', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-7', fixtureId: 'fix-7', type: 'MATCH_WINNER', state: 'OPEN', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-8', fixtureId: 'fix-8', type: 'MATCH_WINNER', state: 'LOCKED', feeBps: 100, createdBy: 'admin-1' },
  { id: 'mkt-9', fixtureId: 'fix-9', type: 'MATCH_WINNER', state: 'RESOLVED', feeBps: 100, createdBy: 'admin-1', resolution: 'YES', resolvedAt: add(now, { hours: -20 }).getTime() },
];

export const POOLS: Pool[] = [
  { marketId: 'mkt-1', xYes: 5000, yNo: 5000, k: 25000000, lastPriceYes: 0.50, lastPriceNo: 0.50, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 1250 },
  { marketId: 'mkt-2', xYes: 4000, yNo: 6000, k: 24000000, lastPriceYes: 0.60, lastPriceNo: 0.40, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 3400 },
  { marketId: 'mkt-3', xYes: 7000, yNo: 3000, k: 21000000, lastPriceYes: 0.30, lastPriceNo: 0.70, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 890 },
  { marketId: 'mkt-4', xYes: 5500, yNo: 4500, k: 24750000, lastPriceYes: 0.45, lastPriceNo: 0.55, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 1500 },
  { marketId: 'mkt-5', xYes: 2000, yNo: 8000, k: 16000000, lastPriceYes: 0.80, lastPriceNo: 0.20, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 5200 },
  { marketId: 'mkt-7', xYes: 5000, yNo: 5000, k: 25000000, lastPriceYes: 0.50, lastPriceNo: 0.50, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 0 },
  { marketId: 'mkt-8', xYes: 6500, yNo: 3500, k: 22750000, lastPriceYes: 0.35, lastPriceNo: 0.65, liquiditySeed: 10000, updatedAt: now.getTime(), volume24h: 11050 },
  { marketId: 'mkt-9', xYes: 10000, yNo: 0, k: 0, lastPriceYes: 1, lastPriceNo: 0, liquiditySeed: 10000, updatedAt: add(now, { hours: -20 }).getTime(), volume24h: 25000 },
];

export const USER_POSITIONS: Position[] = [
    { uid: 'user-1', marketId: 'mkt-1', yesShares: 100, noShares: 0, avgPriceYes: 0.50, avgPriceNo: 0, realizedPnl: 0, unrealizedPnl: 0, updatedAt: now.getTime() },
    { uid: 'user-1', marketId: 'mkt-2', yesShares: 0, noShares: 50, avgPriceYes: 0, avgPriceNo: 0.40, realizedPnl: 0, unrealizedPnl: 0, updatedAt: now.getTime() },
    { uid: 'user-1', marketId: 'mkt-9', yesShares: 200, noShares: 0, avgPriceYes: 0.35, avgPriceNo: 0, realizedPnl: 130, unrealizedPnl: 0, updatedAt: now.getTime() }
];

export const USER_TRADES: Trade[] = [
    { tradeId: 'trade-1', uid: 'user-1', marketId: 'mkt-1', side: 'YES', amount: 50, shares: 100, avgPrice: 0.50, fee: 0.5, clientTxnId: 'client-1', createdAt: now.getTime() },
    { tradeId: 'trade-2', uid: 'user-1', marketId: 'mkt-2', side: 'NO', amount: 20, shares: 50, avgPrice: 0.40, fee: 0.2, clientTxnId: 'client-2', createdAt: now.getTime() },
    { tradeId: 'trade-3', uid: 'user-1', marketId: 'mkt-9', side: 'YES', amount: 70, shares: 200, avgPrice: 0.35, fee: 0.7, clientTxnId: 'client-3', createdAt: add(now, {hours: -26}).getTime() },
];


// --- Data Accessor Functions ---

export const getCompetitions = () => COMPETITIONS;
export const getCompetition = (id: string) => COMPETITIONS.find(c => c.id === id);

export const getTeams = () => TEAMS;
export const getTeam = (id: string) => TEAMS.find(t => t.id === id);

export const getFixtures = () => FIXTURES;
export const getFixture = (id: string) => FIXTURES.find(f => f.id === id);

export const getMarkets = () => MARKETS;
export const getMarket = (id: string) => MARKETS.find(m => m.id === id);

export const getPool = (marketId: string) => POOLS.find(p => p.marketId === marketId);

export const getUserPositions = (userId: string) => USER_POSITIONS.filter(p => p.uid === userId);
export const getUserTrades = (userId: string) => USER_TRADES.filter(t => t.uid === userId);
