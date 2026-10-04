import Link from "next/link";
import { Check, ExternalLink, Package, ShoppingBag, Store, Truck } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AccountSignIn from "./AccountSignIn";
import SignOutButton from "./SignOutButton";
import { getSessionCustomer } from "@/app/lib/customers";
import { getOrdersByEmail } from "@/app/lib/store";
import {
  customerStatusLabel,
  isOrderDone,
  isOrderPaid,
  orderSteps,
  upsTrackingUrl,
  type Order,
  type OrderStatus,
} from "@/app/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "My orders · Nayo" };

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function date(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

const stepLabel: Record<OrderStatus, string> = {
  to_send: "Order placed",
  sent: "With our driver",
  shipped: "Shipped with UPS",
  delivered: "Delivered",
  picked_up: "Picked up",
};

function Timeline({ order }: { order: Order }) {
  const steps = orderSteps(order);
  const at = steps.indexOf(order.status);
  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const reached = i <= at;
        return (
          <li key={step} className="flex-1 flex flex-col items-center text-center relative">
            {i > 0 && (
              <span
                className={`absolute top-3.5 right-1/2 w-full h-0.5 ${i <= at ? "bg-nayo-gold" : "bg-nayo-black/10"}`}
              />
            )}
            <span
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                reached ? "bg-nayo-green text-nayo-amber" : "bg-white border border-nayo-black/15 text-nayo-black/35"
              }`}
            >
              {reached ? <Check size={13} /> : i + 1}
            </span>
            <span className={`mt-2 text-[11px] leading-tight ${reached ? "text-nayo-black font-semibold" : "text-nayo-black/40"}`}>
              {stepLabel[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ order }: { order: Order }) {
  const pickup = order.fulfillment === "pickup";
  const ups = order.deliveryMethod === "ups";
  return (
    <article className="rounded-2xl border border-nayo-black/[0.08] bg-white p-5 sm:p-6 shadow-[0_12px_32px_-20px_rgba(26,65,46,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-nayo-black/50">{order.orderNumber}</p>
          <p className="text-display text-xl font-bold text-nayo-black mt-1">
            {customerStatusLabel(order)}
          </p>
          <p className="text-xs text-nayo-black/45 mt-0.5">Ordered {date(order.paidAt || order.createdAt)}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F1EA] px-3 py-1 text-[11px] font-semibold text-nayo-black/70">
          {pickup ? <Store size={12} /> : ups ? <Package size={12} /> : <Truck size={12} />}
          {pickup ? "Pickup" : ups ? "UPS shipping" : "Delivery"}
        </span>
      </div>

      <div className="mt-6">
        <Timeline order={order} />
      </div>

      {ups && order.trackingNumber && (
        <div className="mt-6 rounded-xl border border-[#DCCDFB] bg-[#F7F3FE] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D28D9]">
              UPS tracking number
            </p>
            <p className="mt-1 font-mono text-base font-semibold text-nayo-black break-all">
              {order.trackingNumber}
            </p>
          </div>
          <a
            href={upsTrackingUrl(order.trackingNumber)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6D28D9] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#5B21B6]"
          >
            Track live on UPS <ExternalLink size={13} />
          </a>
        </div>
      )}

      <ul className="mt-6 divide-y divide-nayo-black/[0.06]">
        {order.items.map((item, i) => (
          <li key={i} className="flex gap-3 py-3">
            <span className="w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F1EA] flex items-center justify-center text-nayo-gold">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ShoppingBag size={18} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-nayo-black">{item.name}</p>
              {item.note && <p className="text-xs text-nayo-black/50 mt-0.5">{item.note}</p>}
              <p className="text-xs text-nayo-black/50 mt-0.5">
                {item.qty} × {money(item.price)}
              </p>
            </div>
            <p className="text-sm font-semibold text-nayo-black">{money(item.qty * item.price)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t border-nayo-black/10 pt-3 text-base font-bold text-nayo-black">
        <span>Total</span>
        <span>{money(order.total)}</span>
      </div>
    </article>
  );
}

export default async function AccountPage() {
  const customer = await getSessionCustomer();

  if (!customer) {
    return (
      <main className="relative bg-nayo-white min-h-screen">
        <Navbar />
        <div className="pt-36 pb-24 px-5 max-w-md mx-auto">
          <AccountSignIn />
          <p className="mt-6 text-center text-xs text-nayo-black/45">
            Your customer ID is on your order receipt email.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const orders = (await getOrdersByEmail(customer.email)).filter(isOrderPaid);
  const active = orders.filter((order) => !isOrderDone(order));
  const past = orders.filter(isOrderDone);

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="bg-nayo-green">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">My orders</p>
              <h1 className="text-display text-4xl sm:text-5xl font-bold text-white mt-3">Welcome back.</h1>
              <p className="mt-3 text-sm text-white/70">
                Customer ID <strong className="text-nayo-amber tracking-wider">{customer.id}</strong>
                <span className="mx-2 text-white/30">·</span>
                {customer.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 space-y-12">
          <section>
            <h2 className="text-display text-2xl font-bold text-nayo-black mb-4">
              In progress {active.length > 0 && <span className="text-nayo-gold">({active.length})</span>}
            </h2>
            {active.length ? (
              <div className="space-y-5">
                {active.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-nayo-black/15 px-6 py-10 text-center text-sm text-nayo-black/50">
                Nothing on the way right now.{" "}
                <Link href="/" className="font-semibold text-nayo-green hover:text-nayo-gold">
                  Start shopping
                </Link>
              </p>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-display text-2xl font-bold text-nayo-black mb-4">Previous orders</h2>
              <div className="space-y-5">
                {past.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
