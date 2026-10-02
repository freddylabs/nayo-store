import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getDeliveryFee, type FulfillmentMethod } from "@/app/lib/checkout";
import { addOrder, createOrderNumber } from "@/app/lib/store";
import { stripeClient } from "@/app/lib/fulfill";

type CheckoutItem = {
  lineId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  note?: string;
};

type CheckoutBody = {
  items: CheckoutItem[];
  fulfillment: FulfillmentMethod;
  customerName: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    city: string;
    region: string;
    postalCode: string;
  };
};

export async function POST(request: Request) {
  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local to take payments.",
      },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.items?.length || !body.customerName || !body.email) {
    return NextResponse.json(
      { error: "Name, email, and cart items are required." },
      { status: 400 }
    );
  }

  if (body.fulfillment !== "delivery" && body.fulfillment !== "pickup") {
    return NextResponse.json(
      { error: "Choose delivery or pickup." },
      { status: 400 }
    );
  }

  if (body.fulfillment === "delivery") {
    const a = body.address;
    if (!a?.line1 || !a.city || !a.region || !a.postalCode) {
      return NextResponse.json(
        { error: "Delivery address is required." },
        { status: 400 }
      );
    }
  }

  const cents = (value: number) => Math.round(value * 100) / 100;
  const subtotal = cents(
    body.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  const deliveryFee = getDeliveryFee(subtotal, body.fulfillment);
  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://127.0.0.1:3000";

  const orderNumber = createOrderNumber();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    body.items.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.note ? `${item.name}, ${item.note}` : item.name,
        },
      },
    }));

  if (deliveryFee > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(deliveryFee * 100),
        product_data: { name: "Delivery fee" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.email,
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    metadata: {
      orderNumber,
      fulfillment: body.fulfillment,
      customerName: body.customerName,
      phone: body.phone || "",
      address: body.fulfillment === "delivery" ? JSON.stringify(body.address) : "",
      lineIds: body.items.map((i) => i.lineId).join(","),
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not start Stripe checkout." },
      { status: 500 }
    );
  }

  try {
    await addOrder({
      id: session.id,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: body.customerName,
      email: body.email,
      phone: body.phone || "",
      fulfillment: body.fulfillment,
      address: body.fulfillment === "delivery" ? body.address : undefined,
      items: body.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        note: item.note,
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      total: cents(subtotal + deliveryFee),
      status: "to_send",
      paymentStatus: "pending",
    });
  } catch (error) {
    // Payment must still go through; the order is rebuilt from Stripe once paid.
    console.error("[checkout] could not save pending order", error);
  }

  return NextResponse.json({ url: session.url });
}
