import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { requireUser } from "@/app/lib/dal";
import { getOrderById } from "@/app/lib/store";
import { formatCurrency } from "@/app/lib/pricing";

export const metadata: Metadata = {
  title: "Order Confirmed — Nayo",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const user = await requireUser("/dashboard/orders");
  const { order: orderId } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : undefined;

  if (!order || order.userId !== user.id) notFound();

  return (
    <main className="relative bg-nayo-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-32 pb-20 px-6 lg:px-10 max-w-2xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            <CheckCircle2 size={40} className="text-nayo-ink" />
          </div>
          <h1 className="text-display text-4xl sm:text-5xl font-bold text-nayo-white mb-3">
            Order <span className="gold-text italic">Confirmed</span>
          </h1>
          <p className="text-nayo-white/50">
            Thank you, {user.name.split(" ")[0]}. We&apos;ve received your order and
            will be in touch shortly.
          </p>
        </div>

        <div className="glass rounded-2xl border border-nayo-gold/15 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-nayo-white/40">
                Order Number
              </p>
              <p className="text-display text-xl font-bold gold-text">{order.id}</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-nayo-gold/10 border border-nayo-gold/30 text-[10px] uppercase tracking-widest text-nayo-gold font-semibold">
              {order.status}
            </span>
          </div>

          <div className="h-px divider-gold" />

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-nayo-gold/15">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-nayo-white text-display font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-nayo-white/40">Qty {item.qty}</p>
                </div>
                <span className="text-sm font-bold gold-text text-display">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px divider-gold" />

          <div className="space-y-2 text-sm">
            <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
            <SummaryRow
              label="Shipping"
              value={order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
            />
            <SummaryRow label="Tax" value={formatCurrency(order.tax)} />
            <div className="flex items-center justify-between pt-2">
              <span className="text-nayo-white/70 uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold gold-text text-display">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          <p className="text-xs text-nayo-white/40">
            Paid with {order.payment.brand} ending in {order.payment.last4} · Shipping
            to {order.shipping_address.city}, {order.shipping_address.country}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/dashboard/orders"
            className="btn-gold flex-1 py-3.5 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2"
          >
            <Package size={16} />
            View My Orders
          </Link>
          <Link
            href="/fashion"
            className="btn-outline flex-1 py-3.5 text-sm tracking-widest uppercase font-medium flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-nayo-white/50">{label}</span>
      <span className="text-nayo-white/90 font-medium">{value}</span>
    </div>
  );
}
