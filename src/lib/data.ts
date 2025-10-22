
import type { Competition, Team, Fixture, Market, Pool, Position, Trade } from '@/lib/types';
import { getOdds } from './odds-api';
import { getCountryFlag } from '@/ai/flows/get-country-flag';


// --- MOCK DATA (to be replaced with Firestore) ---

const MOCK_COMPETITIONS: Competition[] = [
    { id: 'cricket_icc_world_cup', name: 'ICC World Cup', region: 'International', level: 'international', isActive: true },
    { id: 'cricket_international_t20', name: 'T20 Internationals', region: 'International', level: 'international', isActive: true },
    { id: 'cricket_odi', name: 'One Day Internationals', region: 'International', level: 'international', isActive: true },
    { id: 'cricket_test_match', name: 'Test Matches', region: 'International', level: 'international', isActive: true },
    { id: 'cricket_icc_world_cup_womens', name: 'ICC Women\'s World Cup', region: 'International', level: 'international', isActive: true },
];

const teamNameMap: { [key: string]: { id: string, name: string, shortName: string, country: string } } = {
    "Australia": { id: "aus", name: "Australia", shortName: "AUS", country: "Australia" },
    "India": { id: "ind", name: "India", shortName: "IND", country: "India" },
    "Pakistan": { id: "pak", name: "Pakistan", shortName: "PAK", country: "Pakistan" },
    "South Africa": { id: "sa", name: "South Africa", shortName: "SA", country: "South Africa" },
    "New Zealand": { id: "nz", name: "New Zealand", shortName: "NZ", country: "New Zealand" },
    "England": { id: "eng", name: "England", shortName: "ENG", country: "England" },
    "Bangladesh": { id: "ban", name: "Bangladesh", shortName: "BAN", country: "Bangladesh" },
    "West Indies": { id: "wi", name: "West Indies", shortName: "WI", country: "West Indies" },
    "Sri Lanka": { id: "sl", name: "Sri Lanka", shortName: "SL", country: "Sri Lanka" },
};


// --- Data Accessor Functions ---

export const getCompetitions = (): Competition[] => MOCK_COMPETITIONS;
export const getCompetition = (id: string): Competition | undefined => MOCK_COMPETITIONS.find(c => c.id === id);


export const getTeams = async (): Promise<Team[]> => {
    const teams = await Promise.all(Object.values(teamNameMap).map(async (t) => {
        const flag = await getCountryFlag({ country: t.country });
        return {
            ...t,
            country: t.name,
            logoId: flag.flagDataUri,
        };
    }));
    return teams;
};

export const getTeam = async (id: string): Promise<Team | undefined> => {
    let teamInfo = Object.values(teamNameMap).find(t => t.name.toLowerCase() === id.toLowerCase() || t.id.toLowerCase() === id.toLowerCase());

    if (!teamInfo) {
        teamInfo = { id: id.toLowerCase(), name: id, shortName: id.substring(0,3).toUpperCase(), country: id };
    }

    const flag = await getCountryFlag({ country: teamInfo.country });
    
    return {
        ...teamInfo,
        country: teamInfo.name,
        logoId: flag.flagDataUri,
    };
};

export const getFixtures = async (): Promise<Fixture[]> => {
    const odds = await getOdds();
    const fixtures: Fixture[] = odds.map(o => ({
        id: o.id,
        competitionId: o.sport_key,
        homeTeamId: o.home_team,
        awayTeamId: o.away_team,
        startTimeUtc: new Date(o.commence_time).getTime(),
        status: 'SCHEDULED',
    }));
    return fixtures.sort((a, b) => a.startTimeUtc - b.startTimeUtc);
};
export const getFixture = async (id: string): Promise<Fixture | undefined> => {
    const fixtures = await getFixtures();
    return fixtures.find(f => f.id === id);
};

export const getMarkets = async (): Promise<Market[]> => {
    const odds = await getOdds();
    const markets: Market[] = odds.map(o => ({
        id: o.id,
        fixtureId: o.id,
        type: "MATCH_WINNER",
        state: "OPEN",
        feeBps: 100, // 1%
        createdBy: 'system',
        publishedAt: Date.now(),
    }));
    return markets;
}
export const getMarket = async (id: string): Promise<Market | undefined> => {
    const markets = await getMarkets();
    return markets.find(m => m.id === id);
}

export const getPool = async (marketId: string): Promise<Pool | undefined> => {
    const odds = await getOdds();
    const odd = odds.find(o => o.id === marketId);

    if (!odd) return undefined;

    let homeOdds: number[] = [];
    let awayOdds: number[] = [];

    odd.bookmakers.forEach(bookmaker => {
        const h2h = bookmaker.markets.find(m => m.key === 'h2h');
        if (h2h) {
            const homeOutcome = h2h.outcomes.find(o => o.name === odd.home_team);
            const awayOutcome = h2h.outcomes.find(o => o.name === odd.away_team);
            if (homeOutcome) homeOdds.push(homeOutcome.price);
            if (awayOutcome) awayOdds.push(awayOutcome.price);
        }
    });

    const avgHomeOdd = homeOdds.length > 0 ? homeOdds.reduce((a, b) => a + b, 0) / homeOdds.length : 2.0;
    const avgAwayOdd = awayOdds.length > 0 ? awayOdds.reduce((a, b) => a + b, 0) / awayOdds.length : 2.0;

    const probHome = 1 / avgHomeOdd;
    const probAway = 1 / avgAwayOdd;
    
    // Normalize probabilities
    const totalProb = probHome + probAway;
    const lastPriceYes = probHome / totalProb;
    const lastPriceNo = probAway / totalProb;

    // Create a mock pool based on these probabilities
    const liquiditySeed = 10000;
    const xYes = Math.sqrt(liquiditySeed * liquiditySeed * (lastPriceNo / lastPriceYes));
    const yNo = Math.sqrt(liquiditySeed * liquiditySeed * (lastPriceYes / lastPriceNo));

    return {
        marketId: odd.id,
        xYes,
        yNo,
        k: xYes * yNo,
        lastPriceYes,
        lastPriceNo,
        liquiditySeed,
        updatedAt: Date.now(),
        volume24h: Math.random() * 50000, // Mock volume
    };
};


export const getUserPositions = (userId: string): Position[] => [];
export const getUserTrades = (userId: string): Trade[] => [];

    