
// src/scripts/seed-firestore.ts
import { getAdminApp } from '@/firebase/admin';
import { getFixtures, getMarkets, getTeam } from '@/lib/data';
import type { Team, Fixture, Market, User, Wallet, Trade, Position } from '@/lib/types';

// Initialize Firebase Admin
const adminApp = getAdminApp();
const db = adminApp.firestore();

async function seedTeams(fixtures: Fixture[]): Promise<Team[]> {
    if (fixtures.length === 0) {
        console.log('No fixtures found, so no teams to seed.');
        return [];
    }

    const teamIds = new Set<string>();
    fixtures.forEach(f => {
        teamIds.add(f.homeTeamId);
        teamIds.add(f.awayTeamId);
    });
    
    console.log(`Found ${teamIds.size} unique teams. Seeding to Firestore...`);
    const batch = db.batch();
    const teamsCollection = db.collection('teams');

    const teamPromises = Array.from(teamIds).map(id => getTeam(id));
    const teams = await Promise.all(teamPromises);

    const validTeams = teams.filter((t): t is Team => t !== undefined);

    validTeams.forEach(team => {
        const docRef = teamsCollection.doc(team.id);
        batch.set(docRef, team);
    });

    await batch.commit();
    console.log(`Successfully seeded ${validTeams.length} teams.`);
    return validTeams;
}


async function seedFixtures(): Promise<Fixture[]> {
  console.log('Fetching fixtures from API...');
  const fixtures = await getFixtures();
  if (fixtures.length === 0) {
    console.log('No fixtures found to seed.');
    return [];
  }

  console.log(`Found ${fixtures.length} fixtures. Seeding to Firestore...`);
  const batch = db.batch();
  const fixturesCollection = db.collection('fixtures');

  fixtures.forEach(fixture => {
    const docRef = fixturesCollection.doc(fixture.id);
    batch.set(docRef, fixture);
  });

  await batch.commit();
  console.log(`Successfully seeded ${fixtures.length} fixtures.`);
  return fixtures;
}

async function seedMarkets(fixtures: Fixture[]): Promise<Market[]> {
    if (fixtures.length === 0) {
        console.log('No fixtures found, so no markets to seed.');
        return [];
    }
    console.log(`Seeding markets for ${fixtures.length} fixtures...`);
    const markets = await getMarkets();
    const batch = db.batch();
    const marketsCollection = db.collection('markets');

    markets.forEach(market => {
        const docRef = marketsCollection.doc(market.id);
        batch.set(docRef, market);
    });

    await batch.commit();
    console.log(`Successfully seeded ${markets.length} markets.`);
    return markets;
}

async function seedDemoUser(markets: Market[]) {
    if (markets.length < 2) {
        console.log('Not enough markets to seed a demo user with trades/positions.');
        return;
    }

    const DEMO_USER_ID = 'cricket_fan_123';
    console.log(`Seeding demo user with ID: ${DEMO_USER_ID}...`);
    
    const batch = db.batch();

    // 1. Create User document
    const userRef = db.collection('users').doc(DEMO_USER_ID);
    const user: User = {
        id: DEMO_USER_ID,
        email: 'demo@onlywin.app',
        handle: 'CricketFan123',
        role: 'user',
        kycStatus: 'basic',
        createdAt: Date.now(),
    };
    batch.set(userRef, user);

    // 2. Create Wallet document
    const walletRef = db.collection('wallets').doc(DEMO_USER_ID);
    const wallet: Wallet = {
        id: DEMO_USER_ID,
        balanceDemo: 10000,
        lockedDemo: 500,
        updatedAt: Date.now(),
    };
    batch.set(walletRef, wallet);

    // 3. Create a Trade document
    const tradeMarket = markets[0];
    const tradesCollectionRef = userRef.collection('trades');
    const tradeRef = tradesCollectionRef.doc(); // Auto-generate ID
    const trade: Omit<Trade, 'id'> = {
        uid: DEMO_USER_ID,
        marketId: tradeMarket.id,
        side: 'YES',
        amount: 250,
        shares: 250 / 0.65,
        avgPrice: 0.65,
        fee: 2.5,
        clientTxnId: `seed-${Date.now()}`,
        createdAt: Date.now() - 86400000, // 1 day ago
    };
    batch.set(tradeRef, trade);

    // 4. Create a Position document
    const positionMarket = markets[1];
    const positionsCollectionRef = userRef.collection('positions');
    const positionRef = positionsCollectionRef.doc(positionMarket.id);
    const position: Omit<Position, 'id'> = {
        uid: DEMO_USER_ID,
        marketId: positionMarket.id,
        yesShares: 150,
        noShares: 0,
        avgPriceYes: 0.55,
        avgPriceNo: 0,
        realizedPnl: 0,
        unrealizedPnl: (0.60 - 0.55) * 150, // Mock current price vs avg price
        updatedAt: Date.now(),
    };
    batch.set(positionRef, position);

    await batch.commit();
    console.log(`Successfully seeded demo user, wallet, trade, and position.`);
}


async function main() {
  try {
    const fixtures = await seedFixtures();
    await seedTeams(fixtures);
    const markets = await seedMarkets(fixtures);
    await seedDemoUser(markets);

    console.log('\n✅ Firestore seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Firestore seeding failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
