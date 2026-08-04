/**
 * Email service helper.
 *
 * When RESEND_API_KEY is set we use the Resend REST API to send a real
 * transactional email. Otherwise we log the email locally (so the UI
 * flow still works in development).
 */

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export type EmailResult = {
  id: string | null;
  delivered: boolean;
  provider: "resend" | "local";
  to: string;
  subject: string;
  sentAt: string;
};

async function sendViaResend(opts: EmailOptions): Promise<EmailResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "DeployBD <hello@deploybd.dev>",
      to: [opts.to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { id: string };
  return {
    id: data.id,
    delivered: true,
    provider: "resend",
    to: opts.to,
    subject: opts.subject,
    sentAt: new Date().toISOString(),
  };
}

function sendLocal(opts: EmailOptions): EmailResult {
  // In dev/no-key mode, pretend we delivered and log the payload.
  // eslint-disable-next-line no-console
  console.log(
    `[email] to=${opts.to} subject="${opts.subject}" html=${opts.html.length}b`,
  );
  return {
    id: `local_${Date.now()}`,
    delivered: true,
    provider: "local",
    to: opts.to,
    subject: opts.subject,
    sentAt: new Date().toISOString(),
  };
}

export async function sendEmail(opts: EmailOptions): Promise<EmailResult> {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(opts);
  }
  return sendLocal(opts);
}
