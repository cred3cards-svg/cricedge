
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
if (!admin.apps.length) admin.initializeApp();

export const adminListTeams = onCall({ region: 'us-central1' }, async (req) => {
  try {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');

    const uid = req.auth.uid;
    const isAdmin = await admin.firestore().doc(`roles_admin/${uid}`).get();
    if (!isAdmin.exists) {
        // Use a hardcoded UID for the demo if the roles_admin doc doesn't exist
        if (uid !== 'Zx04QiJxoNW5KuiAinGuEZA9Zb62') {
            throw new HttpsError('permission-denied', 'Admins only');
        }
    }

    const snap = await admin.firestore().collection('teams').limit(500).get();
    const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
    return { rows };
  } catch (e: any) {
    console.error('adminListTeams failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'listTeams error');
  }
});
