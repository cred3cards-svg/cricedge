// /src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_WEBAPP_URL = process.env.TELEGRAM_WEBAPP_URL;

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set.");
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("Received Telegram update:", JSON.stringify(body, null, 2));

    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;

      if (text === '/start') {
        const responseText = 'Welcome to OnlyWin! Click the button below to open the app.';
        
        // This is the inline keyboard with the button to open the web app
        const inlineKeyboard = {
          inline_keyboard: [
            [
              {
                text: '🚀 Open App',
                web_app: { url: TELEGRAM_WEBAPP_URL || 'https://studio--studio-1832356161-758ad.us-central1.hosted.app/tg' }
              }
            ]
          ]
        };

        const responseUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(responseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
            reply_markup: inlineKeyboard,
          }),
        });
      } else {
        const responseText = `Echo: You said "${text}"`;
        const responseUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(responseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: responseText }),
        });
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
  }
}
