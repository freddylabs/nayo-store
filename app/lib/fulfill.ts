import Stripe from "stripe";
import type { Order, OrderAddress } from "@/app/lib/site-data";
import {
  addOrder,
  claimReceipt,
  createOrderNumber,
  getOrder,
  markOrderPaid,
  releaseReceipt,
} from "@/app/lib/store";
import { sendEmail } from "@/app/lib/email";
import { renderReceiptEmail } from "@/app/lib/receipt-email";

export type CheckoutOutcome =
  | { state: "paid"; order: Order }
  | { state: "processing"; order: Order }
  | { state: "unpaid"; order: Order }
  | { state: "not_found" }
  | { state: "unconfigured" };

export function stripeClient(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY;
  return secret ? new Stripe(secret) : null;
}

async function attempt<T>(label: string, task: () => Promise<T>): Promise<T | null> {
  try {
    return await task();
  } catch (error) {
    console.error(`[checkout] ${label} failed`, error);
    return null;
  }
}

function parseAddress(raw?: string): OrderAddress | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as OrderAddress;
  } catch {
    return undefined;
  }
}

/** Rebuilds an order from Stripe when it was never saved locally. */
function orderFromSession(session: Stripe.Checkout.Session): Order {
  const meta = session.metadata ?? {};
  const lines = session.line_items?.data ?? [];
  const deliveryLine = lines.find((line) => line.description === "Delivery fee");
  const items = lines
    .filter((line) => line !== deliveryLine)
    .map((line) => ({
      name: line.description ?? "Item",
      qty: line.quantity ?? 1,
      price: (line.price?.unit_amount ?? 0) / 100,
    }));
  const deliveryFee = (deliveryLine?.amount_total ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;

  return {
    id: session.id,
    orderNumber: meta.orderNumber || createOrderNumber(),
    createdAt: new Date(session.created * 1000).toISOString(),
    customerName: meta.customerName || session.customer_details?.name || "Customer",
    email: session.customer_details?.email || session.customer_email || "",
    phone: meta.phone || session.customer_details?.phone || "",
    fulfillment: meta.fulfillment === "delivery" ? "delivery" : "pickup",
    address: parseAddress(meta.address),
    items,
    subtotal: total - deliveryFee,
    deliveryFee,
    total,
    status: "to_send",
    paymentStatus: "pending",
  };
}

async function sendReceiptOnce(order: Order) {
  if (!order.email) return;
  // If the store is unreachable, fall back on Resend's idempotency key to avoid duplicates.
  const claimed = (await attempt("claim receipt", () => claimReceipt(order.id))) ?? true;
  if (!claimed) return;

  const { subject, html, text } = renderReceiptEmail(order);
  const result = await sendEmail({
    to: order.email,
    subject,
    html,
    text,
    idempotencyKey: `nayo-receipt-${order.id}`,
  });

  if (!result.sent) {
    if (!result.skipped) console.error("[checkout] receipt email failed", result.error);
    await attempt("release receipt", () => releaseReceipt(order.id));
  }
}

/**
 * Confirms a Checkout Session with Stripe, marks the order paid, and emails
 * the receipt once. Safe to call repeatedly from the success page and webhook.
 */
export async function finalizeCheckout(sessionId: string): Promise<CheckoutOutcome> {
  const stripe = stripeClient();
  if (!stripe) return { state: "unconfigured" };

  const session = await attempt("retrieve session", () =>
    stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] })
  );
  if (!session) return { state: "not_found" };

  let order = await attempt("load order", () => getOrder(session.id));
  if (!order) {
    order = orderFromSession(session);
    await attempt("save order", () => addOrder(order as Order));
  }

  if (session.payment_status === "unpaid") {
    return { state: session.status === "complete" ? "processing" : "unpaid", order };
  }

  const paid =
    (await attempt("mark paid", () => markOrderPaid(session.id))) ??
    ({ ...order, paymentStatus: "paid", paidAt: new Date().toISOString() } as Order);

  await sendReceiptOnce(paid);
  return { state: "paid", order: paid };
}
