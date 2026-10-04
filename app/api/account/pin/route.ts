import { NextResponse } from "next/server";
import {
  customerCookie,
  isValidPin,
  makeSessionToken,
  readPinLinkToken,
  setCustomerPin,
} from "@/app/lib/customers";

export async function POST(request: Request) {
  let body: { token?: string; pin?: string };
  try {
    body = (await request.json()) as { token?: string; pin?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const pin = body.pin ?? "";
  if (!isValidPin(pin)) {
    return NextResponse.json({ error: "Your PIN must be exactly 4 digits." }, { status: 400 });
  }
  if (/^(\d)\1{3}$/.test(pin) || ["1234", "4321", "0123"].includes(pin)) {
    return NextResponse.json(
      { error: "That PIN is too easy to guess. Please choose another." },
      { status: 400 }
    );
  }

  const customer = body.token ? await readPinLinkToken(body.token) : null;
  if (!customer) {
    return NextResponse.json(
      { error: "This link has expired or was already used. Request a new one from the sign in page." },
      { status: 400 }
    );
  }

  const updated = await setCustomerPin(customer.id, pin);
  if (!updated) {
    return NextResponse.json({ error: "We could not find your account." }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true, customerId: updated.id });
  res.cookies.set(customerCookie.name, makeSessionToken(updated), customerCookie.options);
  return res;
}
