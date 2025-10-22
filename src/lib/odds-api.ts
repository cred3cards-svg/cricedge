// In a real application, this API key should be stored in an environment variable.
const API_KEY = 'c682c3afe945f4d81855dc2a2a0b4576';
const SPORT = 'cricket'; // Changed from cricket_odi to cricket to get all cricket matches
const REGIONS = 'au,eu,uk,us'; // Australia, Europe, UK, US
const MARKETS = 'h2h'; // Head to head
const DAYS_FROM = '15';

type Odd = {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: {
        key: string;
        title: string;
        last_update: string;
        markets: {
            key: 'h2h';
            outcomes: {
                name: string;
                price: number;
            }[];
        }[];
    }[];
}

export async function getOdds(): Promise<Odd[]> {
    try {
        const url = `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=${REGIONS}&markets=${MARKETS}&daysFrom=${DAYS_FROM}`;
        const response = await fetch(url, {
            // Using a long revalidation time to respect the free tier API limits.
            // This means data will be fetched at most once every hour.
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch odds: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: Odd[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching from The Odds API:", error);
        return [];
    }
}
