import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const adminPing = onCall({ region: 'us-central1' }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
  return { ok: true, uid: req.auth.uid, time: new Date().toISOString() };
});
