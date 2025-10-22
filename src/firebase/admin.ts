// src/firebase/admin.ts
import * as admin from 'firebase-admin';

// This is a server-side only file.
// Do not import this on the client.

// Because this is a server-only file, we can use the service account credentials.
// App Hosting automatically sets the GOOGLE_APPLICATION_CREDENTIALS environment
// variable. The Admin SDK automatically uses this variable to initialize.
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let adminApp: admin.app.App;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const credential = serviceAccount 
    ? admin.credential.applicationDefault() 
    : undefined;

  // In a deployed App Hosting environment, the SDK will automatically find the project ID
  // and credentials. For local development, you might need to specify them,
  // but App Hosting's emulation layer often handles this.
  adminApp = admin.initializeApp({
    credential
  });

  return adminApp;
}

/**
 * Returns the singleton instance of the Firebase Admin App.
 */
export function getAdminApp(): admin.app.App {
  if (admin.apps.length === 0) {
    return initializeAdminApp();
  }
  return admin.app();
}
