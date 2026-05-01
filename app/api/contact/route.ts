import { NextResponse } from "next/server";

type ContactPayload = {
  email?: string;
  telegram?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidTelegram(value: string) {
  return /^@?[\w\d_]{3,32}$/.test(value);
}

function escapeTelegramHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendToTelegram(params: {
  botToken: string;
  chatId: string;
  email: string;
  telegram: string;
  message: string;
}) {
  const text = [
    "<b>New contact request</b>",
    "",
    `<b>Email:</b> ${escapeTelegramHtml(params.email || "-")}`,
    `<b>Telegram:</b> ${escapeTelegramHtml(params.telegram || "-")}`,
    "",
    "<b>Message:</b>",
    escapeTelegramHtml(params.message),
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${params.botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: params.chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram send failed: ${details}`);
  }
}

async function sendToEmail(params: {
  resendApiKey: string;
  fromEmail: string;
  toEmail: string;
  email: string;
  telegram: string;
  message: string;
}) {
  const subject = "New contact request from nico.studio";
  const html = `
    <h2>New contact request</h2>
    <p><strong>Email:</strong> ${params.email || "-"}</p>
    <p><strong>Telegram:</strong> ${params.telegram || "-"}</p>
    <p><strong>Message:</strong></p>
    <p>${params.message.replace(/\n/g, "<br/>")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.fromEmail,
      to: [params.toEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Email send failed: ${details}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const email = (body.email ?? "").trim();
    const telegram = (body.telegram ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!email && !telegram) {
      return NextResponse.json({ error: "Provide at least email or Telegram." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (telegram && !isValidTelegram(telegram)) {
      return NextResponse.json({ error: "Invalid Telegram username." }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
    const chatId = process.env.TELEGRAM_CHAT_ID ?? "";
    const resendApiKey = process.env.RESEND_API_KEY ?? "";
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "";
    const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

    const telegramConfigured = Boolean(botToken && chatId);
    const emailConfigured = Boolean(resendApiKey && toEmail);

    if (!telegramConfigured && !emailConfigured) {
      return NextResponse.json(
        {
          error:
            "Сервер не настроен: задайте TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID и/или RESEND_API_KEY + CONTACT_TO_EMAIL (см. .env.example).",
        },
        { status: 500 }
      );
    }

    const tasks: Promise<unknown>[] = [];
    if (telegramConfigured) {
      tasks.push(sendToTelegram({ botToken, chatId, email, telegram, message }));
    }
    if (emailConfigured) {
      tasks.push(sendToEmail({ resendApiKey, fromEmail, toEmail, email, telegram, message }));
    }

    await Promise.all(tasks);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submit failed", error);
    return NextResponse.json({ error: "Failed to submit contact request." }, { status: 500 });
  }
}
