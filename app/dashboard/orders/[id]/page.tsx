import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { requireUser } from "@/app/lib/dal";
import { getOrderById } from "@/app/lib/store";
import { formatCurrency } from "@/app/lib/pricing";
import { StatusBadge, formatDate } from "@/app/components/OrderListItem";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/dashboard/orders/${id}`);
  const order = await getOrderById(id);

  if (!order || order.userId !== user.id) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-nayo-white/50 hover:text-nayo-gold transition-colors"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display text-3xl font-bold gold-text">{order.id}</h1>
          <p className="text-sm text-nayo-white/40 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Items */}
        <div className="glass rounded-2xl border border-nayo-gold/15 p-6 space-y-5">
          <h2 className="text-display text-lg font-bold text-nayo-white">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-nayo-gold/15">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-nayo-white text-display font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-nayo-gold/60 uppercase tracking-widest mt-0.5">
                    {item.category}
                  </p>
                  <p className="text-xs text-nayo-white/40 mt-0.5">
                    {formatCurrency(item.price)} × {item.qty}
                  </p>
                </div>
                <span className="text-sm font-bold gold-text text-display">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + meta */}
        <div className="space-y-6">
          <div className="glass rounded-2xl border border-nayo-gold/15 p-6 space-y-3">
            <h2 className="text-display text-lg font-bold text-nayo-white mb-2">
              Payment Summary
            </h2>
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            <Row
              label="Shipping"
              value={order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
            />
            <Row label="Tax" value={formatCurrency(order.tax)} />
            <div className="h-px divider-gold" />
            <div className="flex items-center justify-between">
              <span className="text-nayo-white/70 uppercase tracking-wider text-sm">
                Total
              </span>
              <span className="text-xl font-bold gold-text text-display">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl border border-nayo-gold/15 p-6 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-nayo-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-nayo-white/40 mb-1">
                  Shipping To
                </p>
                <p className="text-nayo-white/80">{order.shipping_address.name}</p>
                <p className="text-nayo-white/50">{order.shipping_address.address}</p>
                <p className="text-nayo-white/50">
                  {order.shipping_address.city}, {order.shipping_address.zip}
                </p>
                <p className="text-nayo-white/50">{order.shipping_address.country}</p>
              </div>
            </div>
            <div className="h-px divider-gold" />
            <div className="flex items-start gap-3">
              <CreditCard size={16} className="text-nayo-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-nayo-white/40 mb-1">
                  Payment
                </p>
                <p className="text-nayo-white/80">
                  {order.payment.brand} ending in {order.payment.last4}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-nayo-white/50">{label}</span>
      <span className="text-nayo-white/90 font-medium">{value}</span>
    </div>
  );
}
