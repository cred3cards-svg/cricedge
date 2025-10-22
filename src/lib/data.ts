import type { Competition, Team, Fixture, Market, Pool, Position, Trade } from '@/lib/types';
import { getOdds } from './odds-api';

// --- Data Accessor Functions ---
// These are now placeholders. In a real app, these would fetch data from Firestore.

export const getCompetitions = (): Competition[] => [];
export const getCompetition = (id: string): Competition | undefined => undefined;

export const getTeams = (): Team[] => [];
export const getTeam = (id: string): Team | undefined => undefined;

export const getFixtures = async (): Promise<Fixture[]> => {
    // This is a temporary mapping from the new API to the old type.
    // In a real app, you'd likely want to adjust your types to match the API.
    const odds = await getOdds();
    const fixtures: Fixture[] = odds.map(o => ({
        id: o.id,
        competitionId: o.sport_key,
        homeTeamId: o.home_team,
        awayTeamId: o.away_team,
        startTimeUtc: new Date(o.commence_time).getTime(),
        status: 'SCHEDULED',
    }));
    return fixtures;
};
export const getFixture = async (id: string): Promise<Fixture | undefined> => {
    const fixtures = await getFixtures();
    return fixtures.find(f => f.id === id);
};

export const getMarkets = (): Market[] => [];
export const getMarket = (id: string): Market | undefined => undefined;

export const getPool = (marketId: string): Pool | undefined => undefined;

export const getUserPositions = (userId: string): Position[] => [];
export const getUserTrades = (userId: string): Trade[] => [];
