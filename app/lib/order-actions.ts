"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/app/lib/dal";
import { createOrder, type OrderItem } from "@/app/lib/store";
import { allProducts } from "@/app/data/products";

export interface CheckoutPayload {
  items: { id: string; qty: number }[];
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  card: {
    number: string;
    expiry: string;
    cvc: string;
  };
}

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 15;

/** Luhn checksum — the same validation real card networks use. */
function luhnValid(number: string): boolean {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function detectBrand(number: string): string {
  const d = number.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6(?:011|5)/.test(d)) return "Discover";
  return "Card";
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function placeOrder(
  payload: CheckoutPayload
): Promise<PlaceOrderResult> {
  const user = await requireUser("/checkout");

  if (!payload.items || payload.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const { shipping, card } = payload;
  const requiredFields: (keyof CheckoutPayload["shipping"])[] = [
    "name",
    "email",
    "address",
    "city",
    "country",
    "zip",
  ];
  for (const field of requiredFields) {
    if (!shipping?.[field]?.trim()) {
      return { ok: false, error: "Please complete all shipping details." };
    }
  }

  const cardNumber = card.number.replace(/\D/g, "");
  if (!luhnValid(cardNumber)) {
    return { ok: false, error: "The card number appears to be invalid." };
  }
  if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry.trim())) {
    return { ok: false, error: "Enter the card expiry as MM/YY." };
  }
  if (!/^\d{3,4}$/.test(card.cvc.trim())) {
    return { ok: false, error: "Enter a valid CVC." };
  }

  // Rebuild the order from authoritative server-side product data so prices
  // and item metadata can't be tampered with from the client.
  const items: OrderItem[] = [];
  for (const line of payload.items) {
    const product = allProducts.find((p) => p.id === line.id);
    const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
    if (!product || !Number.isFinite(qty)) {
      return { ok: false, error: "One or more items are no longer available." };
    }
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty,
    });
  }

  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.qty, 0));
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shippingFee + tax);

  const order = await createOrder({
    userId: user.id,
    items,
    subtotal,
    shipping: shippingFee,
    tax,
    total,
    shipping_address: {
      name: shipping.name.trim(),
      email: shipping.email.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
      country: shipping.country.trim(),
      zip: shipping.zip.trim(),
    },
    payment: {
      brand: detectBrand(cardNumber),
      last4: cardNumber.slice(-4),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");

  return { ok: true, orderId: order.id };
}
