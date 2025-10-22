// /src/app/api/auth/telegram/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getAdminApp } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

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
    const telegramId = user.id.toString();

    if (!telegramId) {
        return NextResponse.json({ error: 'User ID not found in Telegram data.' }, { status: 400 });
    }

    const admin = getAdminApp();
    const auth = admin.auth();
    const db = admin.firestore();

    const telegramProfileRef = db.collection('telegramProfiles').doc(telegramId);
    const userProfileRef = db.collection('users').doc(); // Will be set later if user is new
    
    let uid: string;
    
    const telegramProfileSnap = await telegramProfileRef.get();

    if (telegramProfileSnap.exists) {
        uid = telegramProfileSnap.data()!.uid;
    } else {
        // User is new, create a new Firebase user and link it.
        uid = userProfileRef.id;
        const newUserRecord = {
            email: `${telegramId}@telegram.user`,
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
        
        // Use a batch to ensure atomicity
        const batch = db.batch();
        batch.set(db.collection('users').doc(uid), newUserRecord);
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
