import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { finalizeCheckout, stripeClient } from "@/app/lib/fulfill";

const handled = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export async function POST(request: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (handled.has(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    const outcome = await finalizeCheckout(session.id);
    if (outcome.state === "not_found" || outcome.state === "unconfigured") {
      // A non-2xx response makes Stripe retry later.
      return NextResponse.json({ error: outcome.state }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
