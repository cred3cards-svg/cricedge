import * as functions from 'firebase-functions';

export const adminPing = functions
  .region('us-central1')
  .https.onCall(async (_data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
    }
    return { ok: true, uid: context.auth.uid, time: new Date().toISOString() };
  });
