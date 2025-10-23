
import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import type { Market } from '../../../src/lib/types';

async function isAdmin(uid: string): Promise<boolean> {
    const adminRoleDoc = await admin.firestore().collection('roles_admin').doc(uid).get();
    return adminRoleDoc.exists;
}

export const adminListMarkets = functions.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const uid = request.auth.uid;
    if (!(await isAdmin(uid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can access this function.');
    }

    const stateFilter = request.data.state as Market['state'] | undefined;

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
            publishedAt: data.publishedAt,
        }
    });
});
