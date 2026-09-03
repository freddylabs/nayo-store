import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Order } from "@/app/lib/store";
import { formatCurrency } from "@/app/lib/pricing";

const statusStyles: Record<Order["status"], string> = {
  processing: "bg-nayo-gold/10 border-nayo-gold/30 text-nayo-gold",
  shipped: "bg-blue-500/10 border-blue-400/30 text-blue-300",
  delivered: "bg-green-500/10 border-green-400/30 text-green-300",
};

export function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span
      className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrderListItem({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-nayo-gold/10 bg-white/[0.02] hover:border-nayo-gold/30 hover:bg-nayo-gold/[0.03] transition-all duration-300"
    >
      {/* Thumbnails */}
      <div className="flex -space-x-3 flex-shrink-0">
        {order.items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="relative w-12 h-12 rounded-lg overflow-hidden border border-nayo-gold/20 bg-nayo-charcoal"
          >
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
          </div>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-display gold-text">{order.id}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-xs text-nayo-white/40 mt-1">
          {formatDate(order.createdAt)} · {itemCount} item{itemCount > 1 ? "s" : ""}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-display text-nayo-white">
          {formatCurrency(order.total)}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="text-nayo-white/30 group-hover:text-nayo-gold group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
      />
    </Link>
  );
}
