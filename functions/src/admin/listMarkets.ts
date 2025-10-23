
import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
if (!admin.apps.length) admin.initializeApp();

export const adminListMarkets = onCall({ region: 'us-central1' }, async (req) => {
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

    const { state } = (req.data ?? {}) as { state?: string };
    let q: admin.firestore.Query = admin.firestore().collection('markets');

    // only add filter if provided (avoid composite index surprises)
    if (state) q = q.where('state', '==', state);

    // Avoid orderBy on possibly-missing fields; safest for mixed data
    const snap = await q.limit(200).get();

    const rows = snap.docs.map(d => {
      const x = d.data() || {};
      return {
        id: d.id,
        fixtureId: x.fixtureId ?? null,
        type: x.type ?? null,
        state: x.state ?? null,
        feeBps: x.feeBps ?? null,
        startTimeUtc: x.startTimeUtc ?? null,
        publishedAt: x.publishedAt?.toMillis?.() ?? x.publishedAt ?? null,
      };
    });

    return { rows };
  } catch (e: any) {
    console.error('adminListMarkets failed:', e);
    if (e instanceof HttpsError) throw e;
    throw new HttpsError('internal', e?.message ?? 'listMarkets error');
  }
});
