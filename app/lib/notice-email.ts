import {
  CONTACT_EMAIL,
  CREAM,
  GOLD,
  GOLD_TEXT,
  GREEN,
  GREEN_DEEP,
  INK,
  MUTED,
  PANEL,
  PHONE_DISPLAY,
  PHONE_LINK,
  SANS,
  SERIF,
  emailBaseUrl,
  escapeHtml,
} from "@/app/lib/receipt-email";

type Notice = {
  subject: string;
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  panel?: { label: string; lines: string[] };
  button: { label: string; url: string };
  footnote?: string;
};

/** A short branded email with one call to action. All text is escaped here. */
export function renderNoticeEmail(notice: Notice, base = emailBaseUrl()) {
  const panel = notice.panel
    ? `<tr>
          <td class="nayo-pad" style="padding:28px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PANEL};border-radius:14px;border-left:4px solid ${GOLD};">
              <tr>
                <td style="padding:20px 22px;">
                  <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">${escapeHtml(notice.panel.label)}</div>
                  ${notice.panel.lines
                    .map(
                      (line, i) =>
                        `<div style="font-family:${SANS};font-size:${i === 0 ? 18 : 14}px;line-height:${i === 0 ? 26 : 22}px;font-weight:${i === 0 ? 700 : 400};color:${i === 0 ? INK : MUTED};padding-top:${i === 0 ? 8 : 4}px;word-break:break-all;">${escapeHtml(line)}</div>`
                    )
                    .join("")}
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    : "";

  const footnote = notice.footnote
    ? `<p style="margin:16px 0 0;font-family:${SANS};font-size:12px;line-height:19px;color:${MUTED};">${escapeHtml(notice.footnote)}</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(notice.subject)}</title>
<style>
  @media (max-width: 620px) {
    .nayo-shell { width: 100% !important; }
    .nayo-pad { padding-left: 24px !important; padding-right: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(notice.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="nayo-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:20px;overflow:hidden;">
        <tr>
          <td align="center" bgcolor="${GREEN}" style="background-color:${GREEN};padding:36px 24px 10px;">
            <a href="${base}" style="text-decoration:none;">
              <img src="${base}/email/nayo-logo.png" width="90" height="100" alt="Nayo" style="display:block;width:90px;height:100px;border:0;font-family:${SERIF};font-size:28px;color:${GOLD};">
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="${GREEN}" class="nayo-pad" style="background-color:${GREEN};padding:20px 48px 38px;">
            <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD};">${escapeHtml(notice.eyebrow)}</div>
            <h1 style="margin:12px 0 0;font-family:${SERIF};font-size:30px;line-height:36px;font-weight:700;color:#FFFFFF;">${escapeHtml(notice.title)}</h1>
            <p style="margin:14px 0 0;font-family:${SANS};font-size:15px;line-height:24px;color:#FFFFFF;opacity:0.82;">${escapeHtml(notice.intro)}</p>
          </td>
        </tr>
        ${panel}
        <tr>
          <td align="center" class="nayo-pad" style="padding:32px 48px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${GOLD}" style="background-color:${GOLD};border-radius:999px;">
                  <a href="${escapeHtml(notice.button.url)}" style="display:inline-block;padding:14px 34px;font-family:${SANS};font-size:12px;line-height:16px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;color:${GREEN};text-decoration:none;border-radius:999px;">${escapeHtml(notice.button.label)}</a>
                </td>
              </tr>
            </table>
            ${footnote}
          </td>
        </tr>
        <tr>
          <td align="center" class="nayo-pad" style="padding:20px 48px 36px;">
            <p style="margin:0;font-family:${SANS};font-size:13px;line-height:21px;color:${MUTED};">Questions? Reply to this email, write to <a href="mailto:${CONTACT_EMAIL}" style="color:${GREEN};font-weight:600;text-decoration:none;">${CONTACT_EMAIL}</a>, or call <a href="${PHONE_LINK}" style="color:${GREEN};font-weight:600;text-decoration:none;white-space:nowrap;">${PHONE_DISPLAY}</a>.</p>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="${GREEN_DEEP}" style="background-color:${GREEN_DEEP};padding:24px;">
            <div style="font-family:${SERIF};font-size:20px;line-height:24px;font-weight:700;color:${GOLD};">Nayo</div>
            <div style="font-family:${SERIF};font-size:13px;line-height:20px;font-style:italic;color:#FFFFFF;opacity:0.7;padding-top:6px;">Wear it. Taste it. Love it.</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const panelText = notice.panel
    ? `\n${notice.panel.label}:\n${notice.panel.lines.join("\n")}\n`
    : "";
  const text = `${notice.title}

${notice.intro}
${panelText}
${notice.button.label}: ${notice.button.url}
${notice.footnote ? `\n${notice.footnote}\n` : ""}
Questions? Reply to this email, write to ${CONTACT_EMAIL}, or call ${PHONE_DISPLAY}.

Nayo
${base}
`;

  return { subject: notice.subject, html, text };
}
