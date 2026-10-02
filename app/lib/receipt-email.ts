import type { Order } from "@/app/lib/site-data";

const GREEN = "#1A412E";
const GREEN_DEEP = "#123224";
const GOLD = "#D4AF37";
const GOLD_TEXT = "#9A7A1E";
const INK = "#1C1C1C";
const MUTED = "#6F6A60";
const CREAM = "#F4F1EA";
const PANEL = "#FAF7F0";
const RULE = "#E8E1D0";

const PHONE_DISPLAY = "+1 (240) 308-3183";
const PHONE_LINK = "tel:+12403083183";
const CONTACT_EMAIL = "info@nayo.market";
const HOURS = "Saturdays, 9:00 AM – 9:00 PM";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Email images must load from a public https host, never localhost. */
export function emailBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured?.startsWith("https://")) return configured.replace(/\/$/, "");
  return "https://nayo.market";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function firstName(order: Order): string {
  return order.customerName.trim().split(/\s+/)[0] || "there";
}

function orderDate(order: Order): string {
  return new Date(order.paidAt ?? order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function assetUrl(base: string, src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
}

function addressLine(order: Order): string {
  const a = order.address;
  if (!a) return "";
  return `${a.line1}, ${a.city}, ${a.region} ${a.postalCode}`;
}

function fulfillmentFee(order: Order): string {
  if (order.fulfillment === "pickup" || order.deliveryFee === 0) {
    return "Complimentary";
  }
  return money(order.deliveryFee);
}

export function renderReceiptEmail(
  order: Order,
  { baseUrl = emailBaseUrl() }: { baseUrl?: string } = {}
) {
  const base = baseUrl;
  const name = escapeHtml(firstName(order));
  const orderNumber = escapeHtml(order.orderNumber);
  const date = orderDate(order);
  const phone = order.phone ? escapeHtml(order.phone) : "";
  const isPickup = order.fulfillment === "pickup";
  const year = new Date(order.createdAt).getFullYear();

  const subject = `Your Nayo order ${order.orderNumber} is confirmed`;
  const preheader = `Thank you, ${firstName(order)}. Your payment went through and we are getting your order ready.`;

  const itemRows = order.items
    .map((item, index) => {
      const image = assetUrl(base, item.image);
      const border = index === 0 ? "" : `border-top:1px solid ${RULE};`;
      const imageCell = image
        ? `<td width="64" valign="top" style="padding:16px 16px 16px 0;${border}">
             <img src="${escapeHtml(image)}" width="64" alt="" style="display:block;width:64px;height:auto;border-radius:10px;border:0;outline:none;">
           </td>`
        : "";
      const note = item.note
        ? `<div style="font-family:${SANS};font-size:12px;line-height:18px;color:${MUTED};padding-top:2px;">${escapeHtml(item.note)}</div>`
        : "";
      return `<tr>
        ${imageCell}
        <td valign="top" style="padding:16px 12px 16px 0;${border}">
          <div style="font-family:${SANS};font-size:15px;line-height:21px;font-weight:600;color:${INK};">${escapeHtml(item.name)}</div>
          ${note}
          <div style="font-family:${SANS};font-size:12px;line-height:18px;color:${MUTED};padding-top:4px;">Qty ${item.qty} &times; ${money(item.price)}</div>
        </td>
        <td valign="top" align="right" style="padding:16px 0;${border}font-family:${SANS};font-size:15px;line-height:21px;font-weight:600;color:${INK};white-space:nowrap;">${money(item.price * item.qty)}</td>
      </tr>`;
    })
    .join("");

  const phoneStrong = phone
    ? ` at <strong style="color:${INK};white-space:nowrap;">${phone}</strong>`
    : "";
  const fulfillmentBody = isPickup
    ? `We will call or text you${phoneStrong} as soon as your order is ready to collect.`
    : `We are bringing your order to <strong style="color:${INK};">${escapeHtml(addressLine(order))}</strong>. We will reach out${phoneStrong} to confirm a delivery time. Kindly have someone available to receive it.`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
<style>
  @media (max-width: 620px) {
    .nayo-shell { width: 100% !important; }
    .nayo-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .nayo-hero { font-size: 28px !important; line-height: 34px !important; }
    .nayo-meta td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="nayo-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:20px;overflow:hidden;">

        <tr>
          <td align="center" bgcolor="${GREEN}" style="background-color:${GREEN};padding:40px 24px 30px;">
            <a href="${base}" style="text-decoration:none;">
              <img src="${base}/email/nayo-logo.png" width="108" height="120" alt="Nayo" style="display:block;width:108px;height:120px;border:0;outline:none;font-family:${SERIF};font-size:32px;color:${GOLD};">
            </a>
          </td>
        </tr>
        <tr>
          <td bgcolor="${GREEN}" style="background-color:${GREEN};padding:0 48px;">
            <div style="height:1px;line-height:1px;font-size:0;background-color:${GOLD};opacity:0.6;">&nbsp;</div>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="${GREEN}" class="nayo-pad" style="background-color:${GREEN};padding:30px 48px 44px;">
            <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD};">Order confirmed</div>
            <h1 class="nayo-hero" style="margin:12px 0 0;font-family:${SERIF};font-size:34px;line-height:40px;font-weight:700;color:#FFFFFF;">Thank you, ${name}.</h1>
            <p style="margin:14px 0 0;font-family:${SANS};font-size:15px;line-height:24px;color:#FFFFFF;opacity:0.8;">Your payment went through and your order is in our hands. Here is everything in one place.</p>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:32px 48px 8px;">
            <table role="presentation" class="nayo-meta" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PANEL};border-radius:14px;">
              <tr>
                <td width="40%" style="padding:16px 20px;">
                  <div style="font-family:${SANS};font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">Order</div>
                  <div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:600;color:${INK};padding-top:4px;">${orderNumber}</div>
                </td>
                <td width="35%" style="padding:16px 20px;">
                  <div style="font-family:${SANS};font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">Date</div>
                  <div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:600;color:${INK};padding-top:4px;">${date}</div>
                </td>
                <td width="25%" style="padding:16px 20px;">
                  <div style="font-family:${SANS};font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">Payment</div>
                  <div style="font-family:${SANS};font-size:14px;line-height:20px;font-weight:600;color:${GREEN};padding-top:4px;">Paid</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:24px 48px 0;">
            <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};padding-bottom:4px;">Your order</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${itemRows}
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:8px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">
              <tr>
                <td style="padding:16px 0 6px;font-family:${SANS};font-size:14px;line-height:20px;color:${MUTED};">Subtotal</td>
                <td align="right" style="padding:16px 0 6px;font-family:${SANS};font-size:14px;line-height:20px;color:${INK};">${money(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0 16px;font-family:${SANS};font-size:14px;line-height:20px;color:${MUTED};">${isPickup ? "Pickup" : "Delivery"}</td>
                <td align="right" style="padding:6px 0 16px;font-family:${SANS};font-size:14px;line-height:20px;color:${fulfillmentFee(order) === "Complimentary" ? GREEN : INK};font-weight:${fulfillmentFee(order) === "Complimentary" ? 600 : 400};">${fulfillmentFee(order)}</td>
              </tr>
              <tr>
                <td style="padding:16px 0 0;border-top:1px solid ${RULE};font-family:${SERIF};font-size:20px;line-height:26px;font-weight:700;color:${INK};">Total</td>
                <td align="right" style="padding:16px 0 0;border-top:1px solid ${RULE};font-family:${SERIF};font-size:26px;line-height:30px;font-weight:700;color:${GREEN};">${money(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td class="nayo-pad" style="padding:32px 48px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PANEL};border-radius:14px;border-left:4px solid ${GOLD};">
              <tr>
                <td style="padding:20px 22px;">
                  <div style="font-family:${SANS};font-size:11px;line-height:16px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${GOLD_TEXT};">${isPickup ? "Pickup" : "Delivery"}</div>
                  <p style="margin:8px 0 0;font-family:${SANS};font-size:14px;line-height:22px;color:${MUTED};">${fulfillmentBody}</p>
                  <p style="margin:10px 0 0;font-family:${SANS};font-size:13px;line-height:20px;color:${MUTED};">${isPickup ? "Pickup hours" : "Delivery hours"}: ${HOURS}.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" class="nayo-pad" style="padding:36px 48px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${GOLD}" style="background-color:${GOLD};border-radius:999px;">
                  <a href="${base}" style="display:inline-block;padding:14px 34px;font-family:${SANS};font-size:12px;line-height:16px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;color:${GREEN};text-decoration:none;border-radius:999px;">Continue shopping</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" class="nayo-pad" style="padding:20px 48px 40px;">
            <p style="margin:0;font-family:${SANS};font-size:13px;line-height:21px;color:${MUTED};">Questions about your order? Reply to this email, write to <a href="mailto:${CONTACT_EMAIL}" style="color:${GREEN};font-weight:600;text-decoration:none;">${CONTACT_EMAIL}</a>, or call <a href="${PHONE_LINK}" style="color:${GREEN};font-weight:600;text-decoration:none;white-space:nowrap;">${PHONE_DISPLAY}</a>.</p>
          </td>
        </tr>

        <tr>
          <td align="center" bgcolor="${GREEN_DEEP}" style="background-color:${GREEN_DEEP};padding:28px 24px 30px;">
            <div style="font-family:${SERIF};font-size:22px;line-height:26px;font-weight:700;color:${GOLD};">Nayo</div>
            <div style="font-family:${SANS};font-size:10px;line-height:16px;letter-spacing:3px;text-transform:uppercase;color:#FFFFFF;opacity:0.7;padding-top:6px;">Fashion &bull; Food &bull; Culture</div>
            <div style="font-family:${SERIF};font-size:13px;line-height:20px;font-style:italic;color:#FFFFFF;opacity:0.7;padding-top:8px;">Wear it. Taste it. Love it.</div>
            <div style="font-family:${SANS};font-size:11px;line-height:18px;color:#FFFFFF;opacity:0.5;padding-top:14px;">
              <a href="${base}" style="color:#FFFFFF;text-decoration:none;">nayo.market</a> &nbsp;&bull;&nbsp; &copy; ${year} Nayo Ltd.
            </div>
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

  const fulfillmentText = isPickup
    ? `Pickup: we will call or text you${order.phone ? ` at ${order.phone}` : ""} as soon as your order is ready.\nPickup hours: ${HOURS}.`
    : `Delivery to: ${addressLine(order)}\nWe will reach out${order.phone ? ` at ${order.phone}` : ""} to confirm a delivery time.\nDelivery hours: ${HOURS}.`;

  const text = `Thank you, ${firstName(order)}.

Your payment went through and your order is in our hands.

Order: ${order.orderNumber}
Date: ${date}
Payment: Paid

${itemLines}

Subtotal: ${money(order.subtotal)}
${isPickup ? "Pickup" : "Delivery"}: ${fulfillmentFee(order)}
Total: ${money(order.total)}

${fulfillmentText}

Questions? Reply to this email, write to ${CONTACT_EMAIL}, or call ${PHONE_DISPLAY}.

Nayo, Fashion, Food, Culture
Wear it. Taste it. Love it.
${base}
`;

  return { subject, html, text };
}
