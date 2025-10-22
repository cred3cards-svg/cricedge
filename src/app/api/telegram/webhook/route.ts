// /src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set.");
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("Received Telegram update:", JSON.stringify(body, null, 2));

    // A simple echo bot for now to confirm it's working
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      // In a real bot, you'd handle commands like /start, /markets, etc. here.
      const responseText = `Echo: You said "${text}"`;

      const responseUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
        }),
      });
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
  }
}
