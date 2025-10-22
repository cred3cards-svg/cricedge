// /src/app/api/auth/telegram/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// This is a placeholder for the actual Firebase Admin SDK initialization
// In a real deployed environment, you'd use firebase-admin
const mockAdmin = {
  auth: () => ({
    createCustomToken: async (uid: string, claims?: object) => {
      console.log(`Minting custom token for UID: ${uid} with claims:`, claims);
      return `mock-custom-token-for-${uid}`;
    },
  }),
};

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
    const telegramId = user.id;

    if (!telegramId) {
        return NextResponse.json({ error: 'User ID not found in Telegram data.' }, { status: 400 });
    }

    // --- Firebase Custom Token Minting ---
    // In a real app, you would find or create a user in Firebase Auth
    // and then mint a token for their Firebase UID.
    // For now, we'll use the Telegram ID as the UID for simplicity.
    const uid = `telegram:${telegramId}`;
    const customToken = await mockAdmin.auth().createCustomToken(uid, { telegram_id: telegramId });

    // TODO: Save/update user profile in Firestore `telegramProfiles/{telegramId}`

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
