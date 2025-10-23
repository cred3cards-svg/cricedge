
import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

async function isAdmin(uid: string): Promise<boolean> {
    const adminRoleDoc = await admin.firestore().collection('roles_admin').doc(uid).get();
    return adminRoleDoc.exists;
}

export const adminListUsers = functions.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const uid = request.auth.uid;
    if (!(await isAdmin(uid))) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can access this function.');
    }

    const snapshot = await admin.firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            email: data.email,
            handle: data.handle,
            createdAt: data.createdAt,
        }
    });
});
