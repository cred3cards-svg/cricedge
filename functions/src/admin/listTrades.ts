
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminListTrades = onCall({ region: 'us-central1' }, async (req) => {
  try {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const uid = req.auth.uid;
    const adminDoc = await admin.firestore().doc(`roles_admin/${uid}`).get();
    if (!adminDoc.exists) {
        // Use a hardcoded UID for the demo if the roles_admin doc doesn't exist
        if (uid !== 'Zx04QiJxoNW5KuiAinGuEZA9Zb62') {
            throw new HttpsError('permission-denied', 'Admins only');
        }
    }

    const snapshot = await admin.firestore()
        .collectionGroup('trades')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            uid: data.uid,
            marketId: data.marketId,
            side: data.side,
            amount: data.amount,
            shares: data.shares,
            createdAt: data.createdAt?.toMillis?.() ?? data.createdAt ?? null,
            path: doc.ref.path,
        };
    });
  } catch (e: any) {
    console.error('adminListTrades failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'adminListTrades error');
  }
});
