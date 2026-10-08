import type { Order } from "@/app/lib/site-data";
import {
  CREAM,
  GOLD,
  GOLD_TEXT,
  GREEN,
  GREEN_DEEP,
  INK,
  MUTED,
  PANEL,
  SANS,
  SERIF,
  emailBaseUrl,
  escapeHtml,
} from "@/app/lib/receipt-email";

const RULE = "#E8E1D0";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function orderWhen(order: Order): string {
  return new Date(order.paidAt ?? order.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function addressLines(order: Order): string[] {
  const address = order.address;
  if (!address) return [];
  return [
    address.line1,
    `${address.city}, ${address.region} ${address.postalCode}`,
  ];
}

/** A summary of a paid order, sent to the shop admin. */
export function renderAdminOrderEmail(order: Order, base = emailBaseUrl()) {
  const isPickup = order.fulfillment === "pickup";
  const method = isPickup ? "Pickup" : "Delivery";
  const when = orderWhen(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const subject = `New order ${order.orderNumber} · ${money(order.total)}`;
  const preheader = `${order.customerName} · ${method} · ${itemCount} item${itemCount === 1 ? "" : "s"}`;
  const adminUrl = `${base}/admin`;

  const itemRows = order.items
    .map((item, index) => {
      const border = index === 0 ? "" : `border-top:1px solid ${RULE};`;
      const note = item.note
        ? `<div style="font-family:${SANS};font-size:12px;line-height:18px;color:${MUTED};padding-top:3px;">${escapeHtml(item.note)}</div>`
        : "";
      return `<tr>
        <td valign="top" style="padding:14px 12px 14px 0;${border}">
          <div style="font-family:${SANS};font-size:15px;line-height:21px;font-weight:600;color:${INK};">${escapeHtml(item.name)}</div>
          ${note}
          <div style="font-family:${SANS};font-size:12px;line-height:18px;color:${MUTED};padding-top:4px;">Qty ${item.qty} &times; ${money(item.price)}</div>
        </td>
        <td valign="top" align="right" style="padding:14px 0;${border}font-family:${SANS};font-size:15px;line-height:21px;font-weight:600;color:${INK};white-space:nowrap;">${money(item.price * item.qty)}</td>
      </tr>`;
    })
    .join("");

  const destination = isPickup
    ? `<div style="font-family:${SANS};font-size:15px;line-height:22px;font-weight:600;color:${INK};padding-top:6px;">Customer will collect this order.</div>`
    : addressLines(order)
        .map(
          (line) =>
            `<div style="font-family:${SANS};font-size:15px;line-height:22px;font-weight:600;color:${INK};padding-top:4px;">${escapeHtml(line)}</div>`
        )
        .join("");

  const phone = order.phone
    ? `<div style="font-family:${SANS};font-size:14px;line-height:22px;padding-top:4px;"><a href="tel:${escapeHtml(order.phone.replace(/[^\d+]/g, ""))}" style="color:${GREEN};font-weight:600;text-decoration:none;">${escapeHtml(order.phone)}</a></div>`
    : "";
  const email = order.email
    ? `<div style="font-family:${SANS};font-size:14px;line-height:22px;padding-top:2px;"><a href="mailto:${escapeHtml(order.email)}" style="color:${GREEN};font-weight:600;text-decoration:none;">${escapeHtml(order.email)}</a></div>`
    : "";

  const feeLabel = isPickup ? "Pickup" : "Delivery";
  const feeValue =
    order.fulfillment === "pickup" || order.deliveryFee === 0
      ? "Complimentary"
      : money(order.deliveryFee);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
<style>
  @media (max-width: 620px) {
    .nayo-shell { width: 100% !important; }
    .nayo-pad { padding-left: 24px !important; padding-right: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="nayo-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:20px;overflow:hidden;">
        <tr>
          <td align="center" bgcolor="${GREEN}" style="background-color:${GREEN};padding:36px 24px 10px;">
            <img src="${base}/email/nayo-logo.png" width="90" height="100" alt="Nayo" style="display:block;width:90px;height:100px;border:0;">
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="${GREEN}" class="nayo-pad" style="background-color:${GREEN};padding:16px 48px 36px;">
            <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD};">New paid order</div>
            <h1 style="margin:12px 0 0;font-family:${SERIF};font-size:30px;line-height:36px;font-weight:700;color:#FFFFFF;">${escapeHtml(order.orderNumber)}</h1>
            <p style="margin:12px 0 0;font-family:${SANS};font-size:15px;line-height:24px;color:#FFFFFF;opacity:0.82;">${escapeHtml(order.customerName)} placed a ${method.toLowerCase()} order for ${money(order.total)}.</p>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:28px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PANEL};border-radius:14px;">
              <tr>
                <td width="50%" style="padding:16px 20px;">
                  <div style="font-family:${SANS};font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">When</div>
                  <div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:600;color:${INK};padding-top:4px;">${escapeHtml(when)} ET</div>
                </td>
                <td width="50%" style="padding:16px 20px;">
                  <div style="font-family:${SANS};font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">Payment</div>
                  <div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:600;color:${GREEN};padding-top:4px;">Paid · ${money(order.total)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:16px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top" style="padding:8px 12px 0 0;">
                  <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">Customer</div>
                  <div style="font-family:${SANS};font-size:16px;line-height:22px;font-weight:700;color:${INK};padding-top:6px;">${escapeHtml(order.customerName)}</div>
                  ${email}
                  ${phone}
                </td>
                <td width="50%" valign="top" style="padding:8px 0 0 12px;">
                  <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">${method}</div>
                  ${destination}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:24px 48px 0;">
            <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};padding-bottom:4px;">Items</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${itemRows}
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:8px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">
              <tr>
                <td style="padding:14px 0 6px;font-family:${SANS};font-size:14px;line-height:20px;color:${MUTED};">Subtotal</td>
                <td align="right" style="padding:14px 0 6px;font-family:${SANS};font-size:14px;line-height:20px;color:${INK};">${money(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0 14px;font-family:${SANS};font-size:14px;line-height:20px;color:${MUTED};">${feeLabel}</td>
                <td align="right" style="padding:6px 0 14px;font-family:${SANS};font-size:14px;line-height:20px;color:${feeValue === "Complimentary" ? GREEN : INK};font-weight:${feeValue === "Complimentary" ? 600 : 400};">${feeValue}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;border-top:1px solid ${RULE};font-family:${SERIF};font-size:20px;line-height:26px;font-weight:700;color:${INK};">Total</td>
                <td align="right" style="padding:14px 0 0;border-top:1px solid ${RULE};font-family:${SERIF};font-size:26px;line-height:30px;font-weight:700;color:${GREEN};">${money(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" class="nayo-pad" style="padding:32px 48px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${GOLD}" style="background-color:${GOLD};border-radius:999px;">
                  <a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:14px 34px;font-family:${SANS};font-size:12px;line-height:16px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;color:${GREEN};text-decoration:none;border-radius:999px;">Open orders</a>
                </td>
              </tr>
            </table>
            <p style="margin:16px 0 0;font-family:${SANS};font-size:12px;line-height:19px;color:${MUTED};">Reply to this email to write the customer.</p>
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

  const itemLines = order.items
    .map((item) => {
      const note = item.note ? `\n    ${item.note}` : "";
      return `  ${item.qty} x ${item.name}  ${money(item.price * item.qty)}${note}`;
    })
    .join("\n");
  const where = isPickup
    ? "Pickup: customer will collect this order."
    : `Delivery:\n${addressLines(order).join("\n")}`;

  const text = `New paid order ${order.orderNumber}

${order.customerName} placed a ${method.toLowerCase()} order for ${money(order.total)}.

When: ${when} ET
Payment: Paid

Customer: ${order.customerName}
${order.email}
${order.phone}

${where}

${itemLines}

Subtotal: ${money(order.subtotal)}
${feeLabel}: ${feeValue}
Total: ${money(order.total)}

Open orders: ${adminUrl}
`;

  return { subject, html, text };
}
