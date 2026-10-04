import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import {
  getOrder,
  getOrders,
  releaseShippingEmail,
  updateOrder,
  type OrderPatch,
} from "@/app/lib/store";
import { notifyShipped } from "@/app/lib/shipping";
import {
  orderStatuses,
  type DeliveryMethod,
  type OrderStatus,
} from "@/app/lib/site-data";

const methods: DeliveryMethod[] = ["local", "ups"];

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  let body: {
    id?: string;
    status?: OrderStatus;
    deliveryMethod?: DeliveryMethod | null;
    trackingNumber?: string;
    labelNote?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Order id is required." }, { status: 400 });
  }

  const current = await getOrder(body.id);
  if (!current) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const patch: OrderPatch = {};
  if (body.status && orderStatuses.includes(body.status)) patch.status = body.status;
  if (body.deliveryMethod === null) {
    patch.deliveryMethod = null;
  } else if (body.deliveryMethod && methods.includes(body.deliveryMethod)) {
    patch.deliveryMethod = body.deliveryMethod;
  }
  if (typeof body.trackingNumber === "string") {
    patch.trackingNumber = body.trackingNumber.replace(/\s+/g, "").toUpperCase().slice(0, 40);
  }
  if (typeof body.labelNote === "string") patch.labelNote = body.labelNote.trim().slice(0, 1000);

  if (patch.status === "shipped") {
    patch.deliveryMethod = "ups";
    const tracking = patch.trackingNumber ?? current.trackingNumber;
    if (!tracking) {
      return NextResponse.json(
        { error: "Add the UPS tracking number before marking it shipped." },
        { status: 400 }
      );
    }
  }
  if (patch.status === "sent") patch.deliveryMethod = "local";
  if (current.fulfillment === "pickup") delete patch.deliveryMethod;

  const order = await updateOrder(body.id, patch);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.status === "to_send" && order.shippingEmailSentAt) {
    await releaseShippingEmail(order.id);
  }

  await notifyShipped(order).catch((error) =>
    console.error("[orders] shipping email failed", error)
  );
  const fresh = (await getOrder(order.id)) ?? order;
  return NextResponse.json({ order: fresh });
}
