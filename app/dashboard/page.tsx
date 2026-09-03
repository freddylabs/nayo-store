import Link from "next/link";
import { Package, Wallet, CalendarClock, ArrowRight, ShoppingBag } from "lucide-react";
import { requireUser } from "@/app/lib/dal";
import { getOrdersForUser } from "@/app/lib/store";
import { formatCurrency } from "@/app/lib/pricing";
import OrderListItem from "@/app/components/OrderListItem";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const orders = await getOrdersForUser(user.id);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const stats = [
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: Package,
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: Wallet,
    },
    {
      label: "Member Since",
      value: memberSince,
      icon: CalendarClock,
    },
  ];

  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-nayo-gold/70 text-xs tracking-[0.25em] uppercase mb-2">
          Dashboard
        </p>
        <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-white">
          Welcome back, <span className="gold-text italic">{user.name.split(" ")[0]}</span>
        </h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass rounded-2xl border border-nayo-gold/15 p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-nayo-black flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-display text-nayo-white">
                  {stat.value}
                </p>
                <p className="text-xs text-nayo-white/40 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-display text-xl font-bold text-nayo-white">
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="text-xs text-nayo-gold hover:text-nayo-amber uppercase tracking-widest font-semibold flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="glass rounded-2xl border border-nayo-gold/15 p-10 text-center">
            <div className="w-16 h-16 rounded-full glass-light border border-nayo-gold/15 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={26} className="text-nayo-gold/40" />
            </div>
            <p className="text-nayo-white/60 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/fashion"
              className="btn-gold inline-flex px-7 py-3 text-xs tracking-widest uppercase font-bold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((order) => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
