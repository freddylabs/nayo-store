import { NextResponse } from "next/server";
import { ensureCustomer, findCustomer } from "@/app/lib/customers";
import { renderPinLinkEmail } from "@/app/lib/account-email";
import { sendEmail } from "@/app/lib/email";
import { clientKey, lockedMinutes, recordFailure, safely } from "@/app/lib/login-limit";
import { getOrdersByEmail } from "@/app/lib/store";
import { isOrderPaid } from "@/app/lib/site-data";

const HOUR = 60 * 60 * 1000;
const perIp = { max: 5, windowMs: HOUR, lockMs: HOUR };
const perCustomer = { max: 3, windowMs: HOUR, lockMs: HOUR };

const done = () =>
  NextResponse.json({
    ok: true,
    message:
      "If that matches an order with us, a link to set your PIN is on its way. Check your inbox and spam folder.",
  });

export async function POST(request: Request) {
  let body: { identifier?: string };
  try {
    body = (await request.json()) as { identifier?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const identifier = (body.identifier ?? "").trim().slice(0, 200);
  if (!identifier) {
    return NextResponse.json(
      { error: "Enter the email you ordered with, or your customer ID." },
      { status: 400 }
    );
  }

  const ipKey = clientKey(request, "pin-link");
  const wait = await safely(() => lockedMinutes(ipKey), 0);
  if (wait > 0) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${wait} minutes.` },
      { status: 429 }
    );
  }
  await safely(() => recordFailure(ipKey, perIp), undefined);

  let customer = await findCustomer(identifier);
  if (!customer && identifier.includes("@")) {
    const orders = await getOrdersByEmail(identifier);
    if (orders.some(isOrderPaid)) customer = await ensureCustomer(identifier);
  }
  if (!customer) return done();

  const customerKey = `pin-link-customer:${customer.id}`;
  if ((await safely(() => lockedMinutes(customerKey), 0)) > 0) return done();
  await safely(() => recordFailure(customerKey, perCustomer), undefined);

  const { subject, html, text } = renderPinLinkEmail(customer);
  const result = await sendEmail({ to: customer.email, subject, html, text });
  if (!result.sent && !result.skipped) {
    console.error("[account] pin link email failed", result.error);
  }
  return done();
}
