import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { requireUser } from "@/app/lib/dal";
import { getOrdersForUser } from "@/app/lib/store";
import OrderListItem from "@/app/components/OrderListItem";

export default async function OrdersPage() {
  const user = await requireUser("/dashboard/orders");
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-nayo-gold/70 text-xs tracking-[0.25em] uppercase mb-2">
          Dashboard
        </p>
        <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-white">
          My <span className="gold-text italic">Orders</span>
        </h1>
      </header>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl border border-nayo-gold/15 p-12 text-center">
          <div className="w-16 h-16 rounded-full glass-light border border-nayo-gold/15 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={26} className="text-nayo-gold/40" />
          </div>
          <p className="text-nayo-white/60 mb-6">No orders yet.</p>
          <Link
            href="/fashion"
            className="btn-gold inline-flex px-7 py-3 text-xs tracking-widest uppercase font-bold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
