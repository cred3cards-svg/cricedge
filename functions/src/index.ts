
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all functions from the admin directory
export * from './admin/listUsers';
export * from './admin/listMarkets';
export * from './admin/listFixtures';
export * from './admin/listTrades';
export * from './admin/listTeams';
