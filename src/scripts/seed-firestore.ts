// src/scripts/seed-firestore.ts
import { getAdminApp } from '@/firebase/admin';
import { getFixtures, getTeams, getTeam } from '@/lib/data';
import type { Team } from '@/lib/types';

// Initialize Firebase Admin
const adminApp = getAdminApp();
const db = adminApp.firestore();

async function seedFixtures() {
  console.log('Fetching fixtures from API...');
  const fixtures = await getFixtures();
  if (fixtures.length === 0) {
    console.log('No fixtures found to seed.');
    return;
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
}

async function seedTeams() {
    console.log('Fetching fixtures to identify teams...');
    const fixtures = await getFixtures();
    if (fixtures.length === 0) {
        console.log('No fixtures found, so no teams to seed.');
        return;
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
}

async function main() {
  try {
    await seedTeams();
    await seedFixtures();
    console.log('\n✅ Firestore seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Firestore seeding failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
