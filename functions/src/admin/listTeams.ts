
import * as admin from 'firebase-admin';
import { onCall } from 'firebase-functions/v2/https';

// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}

// This is a public-facing function and does not require admin auth
// as teams are considered public data.
export const adminListTeams = onCall({ region: 'us-central1' }, async (request) => {
    const snapshot = await admin.firestore().collection('teams').limit(200).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
