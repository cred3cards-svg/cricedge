import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const adminPing = onCall({ region: 'us-central1' }, async (req) => {
  if (!req.auth) {
    throw new HttpsError('unauthenticated', 'Sign in required');
  }
  const uid = req.auth.uid;
  const doc = await admin.firestore().doc(`roles_admin/${uid}`).get();
  if (!doc.exists) {
    throw new HttpsError('permission-denied', 'Admins only');
  }
  return { ok: true, uid: uid, time: new Date().toISOString() };
});
