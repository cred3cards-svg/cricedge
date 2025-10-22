
// /src/app/api/auth/telegram/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getAdminApp } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserRecord } from 'firebase-admin/auth';

export async function POST(req: NextRequest) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set.");
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { initData } = body;

    if (!initData) {
      return NextResponse.json({ error: 'initData is required.' }, { status: 400 });
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    params.sort(); // IMPORTANT: The keys must be sorted alphabetically

    let dataCheckString = '';
    for (const [key, value] of params.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1); // Remove the last newline

    const secretKey = createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest();
    const hmac = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid hash. Verification failed.' }, { status: 403 });
    }

    // Hash is valid, data is from Telegram
    const user = JSON.parse(params.get('user') || '{}');
    const telegramId = user.id?.toString();

    if (!telegramId) {
        return NextResponse.json({ error: 'User ID not found in Telegram data.' }, { status: 400 });
    }

    const admin = getAdminApp();
    const auth = admin.auth();
    const db = admin.firestore();

    const telegramProfileRef = db.collection('telegramProfiles').doc(telegramId);
    const telegramProfileSnap = await telegramProfileRef.get();
    
    let uid: string;
    let authUser: UserRecord;

    if (telegramProfileSnap.exists) {
        uid = telegramProfileSnap.data()!.uid;
        // Fetch the user record to ensure it exists
        try {
            authUser = await auth.getUser(uid);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                 // Data inconsistency: Firestore profile exists but Auth user doesn't.
                 // We will treat this as a new user sign-up.
                 console.warn(`Inconsistency found: Firestore profile for Telegram ID ${telegramId} exists, but Firebase Auth user ${uid} does not. Re-creating user.`);
                 // By falling through, we let the 'else' block handle user creation.
                 uid = ''; // Reset UID to trigger creation
            } else {
                throw error; // Re-throw other auth errors
            }
        }
    }
    
    // If we don't have a valid UID by now, it's a new user.
    if (!telegramProfileSnap.exists || !uid) {
        // User is new, create a new Firebase Auth user.
        try {
            authUser = await auth.createUser({
                // We don't have an email, so we create a placeholder one.
                // Or we could use uid as the email, but this is clearer.
                email: `${telegramId}@telegram.user.onlywin.app`,
                displayName: user.username || `${user.first_name} ${user.last_name}`.trim(),
                photoURL: user.photo_url || undefined,
            });
            uid = authUser.uid;
        } catch (error: any) {
             if (error.code === 'auth/email-already-exists') {
                // This can happen if a user was deleted and is now signing up again.
                // We'll try to get the user by email.
                console.warn(`Auth user with email ${telegramId}@telegram.user.onlywin.app already exists. Fetching...`);
                authUser = await auth.getUserByEmail(`${telegramId}@telegram.user.onlywin.app`);
                uid = authUser.uid;
            } else {
                throw error;
            }
        }

        // Now create the associated Firestore documents in a batch
        const userProfileRef = db.collection('users').doc(uid);
        const newUserRecord = {
            email: authUser.email,
            handle: user.username || `tg_${telegramId}`,
            role: 'user',
            createdAt: FieldValue.serverTimestamp(),
        };

        const newTelegramProfile = {
            uid: uid,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            languageCode: user.language_code,
            photoUrl: user.photo_url,
            linkedAt: FieldValue.serverTimestamp(),
        };
        
        const batch = db.batch();
        batch.set(userProfileRef, newUserRecord);
        batch.set(telegramProfileRef, newTelegramProfile);
        await batch.commit();
    }

    const customToken = await auth.createCustomToken(uid, { telegram_id: telegramId });

    return NextResponse.json({
        message: 'Verification successful.',
        user: user,
        firebaseCustomToken: customToken,
    });

  } catch (error) {
    console.error('Error in /api/auth/telegram/verify:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

    