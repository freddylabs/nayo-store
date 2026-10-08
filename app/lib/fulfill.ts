import Stripe from "stripe";
import type { Order, OrderAddress } from "@/app/lib/site-data";
import {
  addOrder,
  claimAdminNotice,
  claimReceipt,
  createOrderNumber,
  getOrder,
  markOrderPaid,
  releaseAdminNotice,
  releaseReceipt,
} from "@/app/lib/store";
import { sendEmail } from "@/app/lib/email";
import { renderAdminOrderEmail } from "@/app/lib/admin-order-email";
import { getAdminEmail } from "@/app/lib/admin-auth";
import { emailBaseUrl, renderReceiptEmail } from "@/app/lib/receipt-email";
import { ensureCustomer, pinLinkUrl, type Customer } from "@/app/lib/customers";

export type CustomerSummary = { id: string; hasPin: boolean };

export type CheckoutOutcome =
  | { state: "paid"; order: Order; customer: CustomerSummary | null }
  | { state: "processing"; order: Order; customer: CustomerSummary | null }
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

async function sendReceiptOnce(order: Order, customer: Customer | null) {
  if (!order.email) return;
  // If the store is unreachable, fall back on Resend's idempotency key to avoid duplicates.
  const claimed = (await attempt("claim receipt", () => claimReceipt(order.id))) ?? true;
  if (!claimed) return;

  const base = emailBaseUrl();
  const { subject, html, text } = renderReceiptEmail(order, {
    baseUrl: base,
    account: customer
      ? {
          customerId: customer.id,
          pinUrl: customer.pinHash ? undefined : pinLinkUrl(customer, base),
        }
      : undefined,
  });
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

async function sendAdminNoticeOnce(order: Order) {
  const claimed =
    (await attempt("claim admin notice", () => claimAdminNotice(order.id))) ?? true;
  if (!claimed) return;

  const { subject, html, text } = renderAdminOrderEmail(order);
  const result = await sendEmail({
    to: getAdminEmail(),
    subject,
    html,
    text,
    replyTo: order.email || undefined,
    idempotencyKey: `nayo-admin-order-${order.id}`,
  });

  if (!result.sent) {
    if (!result.skipped) console.error("[checkout] admin order email failed", result.error);
    await attempt("release admin notice", () => releaseAdminNotice(order.id));
  }
}

/**
 * Confirms a Checkout Session with Stripe, marks the order paid, and emails
 * the customer receipt and the admin summary once each. Safe to call
 * repeatedly from the success page and webhook.
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
    if (session.status !== "complete") return { state: "unpaid", order };
    const pending = order.email
      ? await attempt("ensure customer", () => ensureCustomer(order!.email))
      : null;
    return { state: "processing", order, customer: summarize(pending) };
  }

  const paid =
    (await attempt("mark paid", () => markOrderPaid(session.id))) ??
    ({ ...order, paymentStatus: "paid", paidAt: new Date().toISOString() } as Order);

  const customer = paid.email
    ? await attempt("ensure customer", () => ensureCustomer(paid.email))
    : null;
  await Promise.all([sendReceiptOnce(paid, customer), sendAdminNoticeOnce(paid)]);
  return { state: "paid", order: paid, customer: summarize(customer) };
}

function summarize(customer: Customer | null): CustomerSummary | null {
  return customer ? { id: customer.id, hasPin: Boolean(customer.pinHash) } : null;
}
