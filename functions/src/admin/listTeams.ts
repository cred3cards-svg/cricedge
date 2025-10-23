
import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// This is a public-facing function and does not require admin auth
// as teams are considered public data.
export const adminListTeams = functions.onCall(async (request) => {
    const snapshot = await admin.firestore().collection('teams').limit(200).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
