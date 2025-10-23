
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { Market } from '../../../src/lib/types';

// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminListMarkets = onCall({ region: 'us-central1' }, async (req) => {
  try {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const uid = req.auth.uid;
    const adminDoc = await admin.firestore().doc(`roles_admin/${uid}`).get();
    if (!adminDoc.exists) {
       // For the demo, we will use a hardcoded UID check instead of roles_admin collection
      if (uid !== 'Zx04QiJxoNW5KuiAinGuEZA9Zb62') {
         throw new HttpsError('permission-denied', 'Admins only');
      }
    }
    
    const stateFilter = req.data.state as Market['state'] | undefined;
    let query: admin.firestore.Query = admin.firestore().collection('markets');

    if (stateFilter) {
        query = query.where('state', '==', stateFilter);
    }
    
    query = query.orderBy('publishedAt', 'desc').limit(200);

    const snapshot = await query.get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            fixtureId: data.fixtureId,
            type: data.type,
            state: data.state,
            feeBps: data.feeBps,
            publishedAt: data.publishedAt?.toMillis?.() ?? data.publishedAt ?? null,
        }
    });
  } catch (e: any) {
    console.error('adminListMarkets failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'adminListMarkets error');
  }
});
