
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// This check prevents the app from being initialized multiple times.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const listUsers = onCall({ region: 'us-central1' }, async (req) => {
  try {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Sign in required');
    }

    const uid = req.auth.uid;
    const doc = await admin.firestore().doc(`roles_admin/${uid}`).get();
    if (!doc.exists) {
      // Use a hardcoded UID for the demo if the roles_admin doc doesn't exist
      if (uid !== 'Zx04QiJxoNW5KuiAinGuEZA9Zb62') {
         throw new HttpsError('permission-denied', 'Admins only');
      }
    }

    const snap = await admin.firestore().collection('users').limit(200).get();
    const rows = snap.docs.map((d) => {
      const x = d.data() || {};
      return {
        id: d.id,
        email: x.email ?? null,
        handle: x.handle ?? null,
        createdAt: x.createdAt?.toMillis?.() ?? x.createdAt ?? null,
      };
    });
    return { rows };
  } catch (e: any) {
    console.error('listUsers failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'listUsers error');
  }
});
