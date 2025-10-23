
import * as admin from 'firebase-admin';

// Initialize the app once in the main entry file.
admin.initializeApp();

// Export all functions from the admin directory
export * from './admin/listUsers';
export * from './admin/listMarkets';
export * from './admin/listFixtures';
export * from './admin/listTrades';
export * from './admin/listTeams';
export * from './admin/ping';
