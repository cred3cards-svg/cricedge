import type { Competition, Team, Fixture, Market, Pool, Position, Trade } from '@/lib/types';

// --- Data Accessor Functions ---
// These are now placeholders. In a real app, these would fetch data from Firestore.

export const getCompetitions = (): Competition[] => [];
export const getCompetition = (id: string): Competition | undefined => undefined;

export const getTeams = (): Team[] => [];
export const getTeam = (id: string): Team | undefined => undefined;

export const getFixtures = (): Fixture[] => [];
export const getFixture = (id: string): Fixture | undefined => undefined;

export const getMarkets = (): Market[] => [];
export const getMarket = (id: string): Market | undefined => undefined;

export const getPool = (marketId: string): Pool | undefined => undefined;

export const getUserPositions = (userId: string): Position[] => [];
export const getUserTrades = (userId: string): Trade[] => [];
