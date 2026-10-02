import Link from "next/link";
import { CheckCircle2, Clock, Phone, ShoppingCart } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ExploreShop from "@/app/components/ExploreShop";
import ClearCart from "./ClearCart";
import { finalizeCheckout, type CheckoutOutcome } from "@/app/lib/fulfill";
import { emailConfigured } from "@/app/lib/email";
import type { Order } from "@/app/lib/site-data";

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function OrderSummary({ order }: { order: Order }) {
  const isPickup = order.fulfillment === "pickup";
  return (
    <div className="rounded-2xl border border-nayo-gold/25 p-6 text-left bg-nayo-white">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold">
          Order summary
        </p>
        <p className="text-xs font-semibold tracking-widest text-nayo-black/55">
          {order.orderNumber}
        </p>
      </div>
      <ul className="space-y-3 mb-5">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-4 text-sm">
            <div className="min-w-0">
              <p className="font-semibold text-nayo-black">
                {item.qty} × {item.name}
              </p>
              {item.note && (
                <p className="text-[11px] text-nayo-black/50 leading-snug">
                  {item.note}
                </p>
              )}
            </div>
            <p className="font-semibold shrink-0">{money(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="space-y-2 text-sm border-t border-nayo-gold/20 pt-4">
        <div className="flex justify-between">
          <span className="text-nayo-black/55">Subtotal</span>
          <span>{money(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-nayo-black/55">{isPickup ? "Pickup" : "Delivery"}</span>
          <span>
            {isPickup || order.deliveryFee === 0
              ? "Complimentary"
              : money(order.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2">
          <span>Total</span>
          <span className="gold-text text-display">{money(order.total)}</span>
        </div>
      </div>
      <p className="mt-5 text-sm text-nayo-black/60 leading-relaxed">
        {isPickup
          ? "We will call or text you as soon as your order is ready to collect."
          : "We will reach out to confirm a delivery time. Kindly have someone available to receive it."}
      </p>
    </div>
  );
}

function content(outcome: CheckoutOutcome | null) {
  if (outcome?.state === "paid") {
    return {
      clear: true,
      icon: <CheckCircle2 size={40} className="mx-auto text-nayo-gold mb-4" />,
      title: "Order confirmed",
      body: emailConfigured()
        ? `Thank you, ${outcome.order.customerName.split(" ")[0]}. Your payment went through and a receipt is on its way to ${outcome.order.email}.`
        : `Thank you, ${outcome.order.customerName.split(" ")[0]}. Your payment went through and we will be in touch about next steps.`,
      order: outcome.order,
    };
  }
  if (outcome?.state === "processing") {
    return {
      clear: true,
      icon: <Clock size={40} className="mx-auto text-nayo-gold mb-4" />,
      title: "Payment processing",
      body: "Your order is placed and your payment is being confirmed. We will email your receipt as soon as it clears.",
      order: outcome.order,
    };
  }
  if (outcome?.state === "unpaid") {
    return {
      clear: false,
      icon: <ShoppingCart size={40} className="mx-auto text-nayo-gold mb-4" />,
      title: "Payment not finished",
      body: "It looks like the payment was not completed. Your cart is still saved, so you can try again whenever you are ready.",
      order: null,
    };
  }
  return {
    clear: false,
    icon: <ShoppingCart size={40} className="mx-auto text-nayo-gold mb-4" />,
    title: "Thank you",
    body: "We could not look up this payment. If you were charged, please call us and we will sort it out right away.",
    order: null,
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : undefined;
  const outcome = sessionId ? await finalizeCheckout(sessionId) : null;
  const view = content(outcome);

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      {view.clear && <ClearCart />}
      <div className="pt-36 pb-24 px-6 max-w-xl mx-auto text-center">
        {view.icon}
        <h1 className="text-display text-4xl font-bold text-nayo-black mb-3">
          {view.title}
        </h1>
        <p className="text-nayo-black/55 mb-8 leading-relaxed">{view.body}</p>

        {view.order && (
          <div className="mb-10">
            <OrderSummary order={view.order} />
          </div>
        )}

        {outcome?.state === "unpaid" && (
          <Link
            href="/checkout"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-bold mb-10"
          >
            Back to checkout
          </Link>
        )}

        <p className="text-sm text-nayo-black/50 mb-8 flex items-center justify-center gap-1.5">
          <Phone size={13} />
          Questions? Call{" "}
          <a href="tel:+12403083183" className="text-nayo-green font-semibold">
            +1 (240) 308-3183
          </a>
        </p>
        <ExploreShop />
      </div>
      <Footer />
    </main>
  );
}
