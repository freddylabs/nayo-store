type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
};

export type EmailResult =
  | { sent: true; id: string }
  | { sent: false; skipped: true }
  | { sent: false; skipped?: false; error: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY not set, skipped "${message.subject}"`);
    return { sent: false, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(message.idempotencyKey
        ? { "Idempotency-Key": message.idempotencyKey }
        : {}),
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Nayo <orders@nayo.market>",
      reply_to: process.env.EMAIL_REPLY_TO || "info@nayo.market",
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };
  if (!res.ok || !data.id) {
    return { sent: false, error: data.message || `Resend returned ${res.status}` };
  }
  return { sent: true, id: data.id };
}
