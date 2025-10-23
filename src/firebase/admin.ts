
// src/firebase/admin.ts
import * as admin from 'firebase-admin';

// This is a server-side only file. Do not import this on the client.

let adminApp: admin.app.App;

/**
 * Initializes the Firebase Admin SDK, handling both deployed and local/emulator environments.
 * It ensures that the app is initialized only once.
 */
function initializeAdminApp(): admin.app.App {
  // If the app is already initialized, return it.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // App Hosting automatically sets GOOGLE_APPLICATION_CREDENTIALS.
  // The Admin SDK uses this variable to initialize.
  // In a local/emulator environment, this variable may not be set,
  // so we initialize without explicit credentials, allowing it to
  // connect to the emulators if they are running.
  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    console.log('Initializing admin app without explicit credentials for local/emulator environment.');
    adminApp = admin.initializeApp();
  }

  return adminApp;
}

/**
 * Returns a singleton instance of the Firebase Admin App.
 * This is the primary way to get the admin app instance in the application.
 */
export function getAdminApp(): admin.app.App {
  return initializeAdminApp();
}
