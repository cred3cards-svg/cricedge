
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminListFixtures = onCall({ region: 'us-central1' }, async (req) => {
  try {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const uid = req.auth.uid;
    const adminDoc = await admin.firestore().doc(`roles_admin/${uid}`).get();
    if (!adminDoc.exists) {
        throw new HttpsError('permission-denied', 'Admins only');
    }

    const { dateFrom, dateTo } = req.data;
    let query: admin.firestore.Query = admin.firestore().collection('fixtures');

    if (dateFrom) {
        // Timestamps in Firestore are often numbers, not Date objects.
        const fromTimestamp = new Date(dateFrom).getTime();
        query = query.where('startTimeUtc', '>=', fromTimestamp);
    }
    if (dateTo) {
        const toTimestamp = new Date(dateTo).getTime();
        query = query.where('startTimeUtc', '<=', toTimestamp);
    }

    query = query.orderBy('startTimeUtc', 'asc').limit(200);
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        // The .toMillis() function only exists on Firestore Timestamp objects.
        // The data might already be a number if it came from our seed script.
        const startTime = data.startTimeUtc?.toMillis?.() ?? data.startTimeUtc ?? null;
        return {
            id: doc.id,
            homeTeamId: data.homeTeamId,
            awayTeamId: data.awayTeamId,
            startTimeUtc: startTime,
            status: data.status,
        };
    });
  } catch (e: any) {
    console.error('adminListFixtures failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'adminListFixtures error');
  }
});
