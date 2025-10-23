
import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

async function isAdmin(uid: string): Promise<boolean> {
    const adminRoleDoc = await admin.firestore().collection('roles_admin').doc(uid).get();
    return adminRoleDoc.exists;
}

export const adminListFixtures = functions.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    
    const uid = request.auth.uid;
    if (!(await isAdmin(uid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can access this function.');
    }

    const { dateFrom, dateTo } = request.data;
    let query: admin.firestore.Query = admin.firestore().collection('fixtures');

    if (dateFrom) {
        query = query.where('startTimeUtc', '>=', new Date(dateFrom).getTime());
    }
    if (dateTo) {
        query = query.where('startTimeUtc', '<=', new Date(dateTo).getTime());
    }

    query = query.orderBy('startTimeUtc', 'asc').limit(200);

    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            homeTeamId: data.homeTeamId,
            awayTeamId: data.awayTeamId,
            startTimeUtc: data.startTimeUtc,
            status: data.status,
        };
    });
});
