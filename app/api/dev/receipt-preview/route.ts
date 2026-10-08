import { NextResponse } from "next/server";
import { renderAdminOrderEmail } from "@/app/lib/admin-order-email";
import { renderReceiptEmail } from "@/app/lib/receipt-email";
import type { Order } from "@/app/lib/site-data";

const sample: Order = {
  id: "cs_test_preview",
  orderNumber: "NAYO-PREVIEW",
  createdAt: new Date().toISOString(),
  paidAt: new Date().toISOString(),
  customerName: "Ama Mensah",
  email: "ama@example.com",
  phone: "(240) 555-0142",
  fulfillment: "delivery",
  address: {
    line1: "1200 Harbor Point Way",
    city: "Baltimore",
    region: "MD",
    postalCode: "21230",
  },
  items: [
    {
      name: "Jollof and Beef",
      qty: 2,
      price: 19.99,
      note: "Served free: Shito pepper sauce, Serviettes, Bottled water",
      image: "/hero-food.png",
    },
    {
      name: "Nayo Nurse Scrub Dress, Teal & Green",
      qty: 1,
      price: 118,
      image: "/health-nurse-dress.jpg",
    },
    {
      name: "Nurse Badge Reel",
      qty: 1,
      price: 14,
      image: "/health-badge-reel.jpg",
    },
  ],
  subtotal: 171.98,
  deliveryFee: 0,
  total: 171.98,
  status: "to_send",
  paymentStatus: "paid",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const url = new URL(request.url);
  const pickup = url.searchParams.get("pickup") === "1";
  const order: Order = pickup
    ? { ...sample, fulfillment: "pickup", address: undefined }
    : sample;
  if (url.searchParams.get("admin") === "1") {
    const { html } = renderAdminOrderEmail(order, url.origin);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  const { html } = renderReceiptEmail(order, {
    baseUrl: url.origin,
    account: {
      customerId: "NY-K7Q2MX",
      pinUrl:
        url.searchParams.get("haspin") === "1" ? undefined : `${url.origin}/account/pin?token=preview`,
    },
  });
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
