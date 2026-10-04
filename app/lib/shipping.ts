import { sendEmail } from "@/app/lib/email";
import { renderNoticeEmail } from "@/app/lib/notice-email";
import { emailBaseUrl } from "@/app/lib/receipt-email";
import { upsTrackingUrl, type Order } from "@/app/lib/site-data";
import { claimShippingEmail, releaseShippingEmail } from "@/app/lib/store";

export function renderShippedEmail(order: Order, base = emailBaseUrl()) {
  const first = order.customerName.trim().split(/\s+/)[0] || "there";
  const tracking = order.trackingNumber ?? "";
  return renderNoticeEmail(
    {
      subject: `Your Nayo order ${order.orderNumber} has shipped`,
      preheader: `UPS tracking number ${tracking}`,
      eyebrow: "On its way",
      title: `Good news, ${first}.`,
      intro: `Your order ${order.orderNumber} is with UPS. Use the tracking number below to follow it live on the UPS website.`,
      panel: { label: "UPS tracking number", lines: [tracking] },
      button: { label: "Track on UPS", url: upsTrackingUrl(tracking) },
      footnote: `You can also see all your orders at ${base}/account`,
    },
    base
  );
}

/** Emails the customer their UPS tracking number once, the first time an order ships. */
export async function notifyShipped(order: Order): Promise<void> {
  if (
    order.status !== "shipped" ||
    order.deliveryMethod !== "ups" ||
    !order.trackingNumber ||
    !order.email ||
    order.shippingEmailSentAt
  ) {
    return;
  }
  const claimed = await claimShippingEmail(order.id).catch(() => true);
  if (!claimed) return;

  const { subject, html, text } = renderShippedEmail(order);
  const result = await sendEmail({
    to: order.email,
    subject,
    html,
    text,
    idempotencyKey: `nayo-shipped-${order.id}-${order.trackingNumber}`,
  });
  if (!result.sent) {
    if (!result.skipped) console.error("[shipping] email failed", result.error);
    await releaseShippingEmail(order.id).catch(() => undefined);
  }
}
