import { NextResponse } from "next/server";
import {
  customerCookie,
  findCustomer,
  makeSessionToken,
  verifyPin,
} from "@/app/lib/customers";
import {
  clearFailures,
  clientKey,
  lockedMinutes,
  recordFailure,
  safely,
} from "@/app/lib/login-limit";

const QUARTER_HOUR = 15 * 60 * 1000;
const perIp = { max: 10, windowMs: QUARTER_HOUR, lockMs: QUARTER_HOUR };
const perAccount = { max: 5, windowMs: QUARTER_HOUR, lockMs: QUARTER_HOUR };

function tooMany(wait: number) {
  return NextResponse.json(
    { error: `Too many wrong tries. Please wait ${wait} minute${wait === 1 ? "" : "s"} and try again.` },
    { status: 429, headers: { "Retry-After": String(wait * 60) } }
  );
}

export async function POST(request: Request) {
  let body: { identifier?: string; pin?: string };
  try {
    body = (await request.json()) as { identifier?: string; pin?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const identifier = (body.identifier ?? "").trim().slice(0, 200);
  const pin = (body.pin ?? "").trim();
  if (!identifier || !pin) {
    return NextResponse.json(
      { error: "Enter your email or customer ID and your PIN." },
      { status: 400 }
    );
  }

  const ipKey = clientKey(request, "customer-login");
  const ipWait = await safely(() => lockedMinutes(ipKey), 0);
  if (ipWait > 0) return tooMany(ipWait);

  const customer = await findCustomer(identifier);
  const accountKey = customer ? `customer-account:${customer.id}` : null;
  if (accountKey) {
    const wait = await safely(() => lockedMinutes(accountKey), 0);
    if (wait > 0) return tooMany(wait);
  }

  if (!customer || !(await verifyPin(customer, pin))) {
    await safely(() => recordFailure(ipKey, perIp), undefined);
    if (accountKey) await safely(() => recordFailure(accountKey, perAccount), undefined);
    return NextResponse.json(
      {
        error:
          "That ID and PIN did not match. If you have not set a PIN yet, use “Email me a link” below.",
      },
      { status: 401 }
    );
  }

  await safely(() => clearFailures(ipKey), undefined);
  await safely(() => clearFailures(accountKey!), undefined);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(customerCookie.name, makeSessionToken(customer), customerCookie.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(customerCookie.name, "", { ...customerCookie.options, maxAge: 0 });
  return res;
}
