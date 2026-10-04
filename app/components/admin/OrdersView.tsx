"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  ExternalLink,
  Hourglass,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  Receipt,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import type { Product } from "@/app/data/products";
import {
  isOrderPaid,
  looksLikeUpsNumber,
  needsDeliveryChoice,
  orderSteps,
  upsTrackingUrl,
  type DeliveryMethod,
  type Order,
  type OrderStatus,
} from "@/app/lib/site-data";
import {
  Avatar,
  Drawer,
  EmptyState,
  cardClass,
  compactMoney,
  fieldClass,
  formatDateTime,
  money,
  statusMeta,
  timeAgo,
} from "./ui";

export type OrderPatch = {
  status?: OrderStatus;
  deliveryMethod?: DeliveryMethod | null;
  trackingNumber?: string;
  labelNote?: string;
};

type Range = "today" | "7d" | "month" | "all";
export type OrderFilter = "all" | "decide" | OrderStatus;
type Filter = OrderFilter;

function inFilter(order: Order, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "decide") return needsDeliveryChoice(order);
  return order.status === filter;
}

const ranges: { id: Range; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "month", label: "This month" },
  { id: "all", label: "All time" },
];

const PAGE_SIZE = 12;

function orderTime(order: Order): string {
  return order.paidAt || order.createdAt;
}

function inRange(order: Order, range: Range): boolean {
  if (range === "all") return true;
  const time = new Date(orderTime(order));
  const now = new Date();
  if (range === "today") return time.toDateString() === now.toDateString();
  if (range === "7d") return now.getTime() - time.getTime() <= 7 * 864e5;
  return (
    time.getFullYear() === now.getFullYear() && time.getMonth() === now.getMonth()
  );
}

function matches(order: Order, query: string): boolean {
  if (!query) return true;
  const haystack = [
    order.orderNumber,
    order.customerName,
    order.email,
    order.phone,
    order.trackingNumber,
    ...order.items.map((item) => item.name),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function csvCell(value: string | number | undefined): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportCsv(orders: Order[]) {
  const header = [
    "Order",
    "Paid at",
    "Customer",
    "Email",
    "Phone",
    "Fulfillment",
    "Address",
    "Items",
    "Subtotal",
    "Delivery",
    "Total",
    "Status",
    "Sent by",
    "Tracking",
  ];
  const rows = orders.map((order) => [
    order.orderNumber,
    formatDateTime(orderTime(order)),
    order.customerName,
    order.email,
    order.phone,
    order.fulfillment,
    order.address
      ? `${order.address.line1}, ${order.address.city}, ${order.address.region} ${order.address.postalCode}`
      : "",
    order.items.map((item) => `${item.qty}x ${item.name}`).join("; "),
    order.subtotal.toFixed(2),
    order.deliveryFee.toFixed(2),
    order.total.toFixed(2),
    statusMeta[order.status].label,
    order.fulfillment === "pickup"
      ? "Pickup"
      : order.deliveryMethod === "ups"
        ? "UPS"
        : order.deliveryMethod === "local"
          ? "Driver"
          : "Not chosen",
    order.trackingNumber,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `nayo-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function OrdersView({
  orders,
  products,
  query,
  filter,
  onFilter,
  onUpdate,
}: {
  orders: Order[];
  products: Product[];
  query: string;
  filter: Filter;
  onFilter: (filter: Filter) => void;
  onUpdate: (id: string, patch: OrderPatch) => Promise<boolean>;
}) {
  const [range, setRange] = useState<Range>("all");
  const setFilter = onFilter;
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const paid = useMemo(
    () =>
      orders
        .filter(isOrderPaid)
        .sort((a, b) => orderTime(b).localeCompare(orderTime(a))),
    [orders]
  );
  const awaitingPayment = orders.length - paid.length;

  const scoped = useMemo(
    () => paid.filter((order) => inRange(order, range) && matches(order, query)),
    [paid, range, query]
  );

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: scoped.length,
      decide: 0,
      to_send: 0,
      sent: 0,
      shipped: 0,
      delivered: 0,
      picked_up: 0,
    };
    for (const order of scoped) {
      base[order.status] += 1;
      if (needsDeliveryChoice(order)) base.decide += 1;
    }
    return base;
  }, [scoped]);
  const undecided = paid.filter(needsDeliveryChoice).length;

  const updateFromCard = async (id: string, patch: OrderPatch) => {
    const ok = await onUpdate(id, patch);
    if (ok && patch.deliveryMethod) {
      if (patch.deliveryMethod === "ups") setOpenId(id);
      if (filter === "decide" && undecided <= 1) setFilter("to_send");
    }
    return ok;
  };

  const stats = useMemo(() => {
    const inScope = paid.filter((order) => inRange(order, range));
    const revenue = inScope.reduce((sum, order) => sum + order.total, 0);
    return {
      total: inScope.length,
      revenue,
      average: inScope.length ? revenue / inScope.length : 0,
      waiting: paid.filter((order) => order.status === "to_send").length,
      fulfilled: inScope.filter((order) => order.status !== "to_send").length,
    };
  }, [paid, range]);

  const visible = scoped.filter((o) => inFilter(o, filter));
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageOrders = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const openOrder = paid.find((order) => order.id === openId) ?? null;
  const rangeLabel = ranges.find((r) => r.id === range)!.label.toLowerCase();

  const imageFor = (name: string, image?: string) =>
    image ||
    products.find((p) => name === p.name || name.startsWith(`${p.name},`))?.image;

  const statCards = [
    {
      label: "Revenue",
      value: compactMoney(stats.revenue),
      hint: rangeLabel,
      icon: <CircleDollarSign size={16} />,
      tone: "text-nayo-amber",
      chip: "bg-white/10 text-nayo-amber",
      featured: true,
    },
    {
      label: "Total orders",
      value: stats.total.toLocaleString(),
      hint: rangeLabel,
      icon: <ShoppingBag size={16} />,
      tone: "text-nayo-green",
      chip: "bg-nayo-green/10 text-nayo-green",
    },
    {
      label: "To fulfill",
      value: stats.waiting.toLocaleString(),
      hint: "waiting now",
      icon: <Hourglass size={16} />,
      tone: "text-[#C2410C]",
      chip: "bg-[#FDECDD] text-[#C2410C]",
    },
    {
      label: "Average order",
      value: money(stats.average),
      hint: rangeLabel,
      icon: <Receipt size={16} />,
      tone: "text-[#1D4ED8]",
      chip: "bg-[#EAF1FE] text-[#1D4ED8]",
    },
    {
      label: "Fulfilled",
      value: stats.fulfilled.toLocaleString(),
      hint: "handed over",
      icon: <Check size={16} />,
      tone: "text-nayo-green-light",
      chip: "bg-[#E6F2EA] text-nayo-green-light",
    },
  ];

  const filters: { id: Filter; label: string; tone: string }[] = [
    { id: "all", label: "All orders", tone: "" },
    { id: "decide", label: "Choose driver or UPS", tone: "text-[#C2410C]" },
    { id: "to_send", label: statusMeta.to_send.label, tone: "text-[#A16207]" },
    { id: "sent", label: statusMeta.sent.label, tone: "text-[#1D4ED8]" },
    { id: "shipped", label: statusMeta.shipped.label, tone: "text-[#6D28D9]" },
    { id: "delivered", label: statusMeta.delivered.label, tone: "text-nayo-green-light" },
    { id: "picked_up", label: statusMeta.picked_up.label, tone: "text-nayo-green-light" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            Orders overview
          </h1>
          <p className="mt-1 text-sm text-nayo-black/55">
            Every paid order, from checkout to pickup or delivery.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-nayo-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-nayo-black/70 hover:text-nayo-black"
          >
            <Printer size={14} /> Print
          </button>
          <button
            type="button"
            onClick={() => exportCsv(visible)}
            disabled={!visible.length}
            className="inline-flex items-center gap-2 rounded-xl border border-nayo-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-nayo-black/70 hover:text-nayo-black disabled:opacity-40"
          >
            <Download size={14} /> Export
          </button>
          <label className="relative inline-flex items-center gap-2 rounded-xl border border-nayo-black/10 bg-white pl-3.5 pr-2 py-2 text-xs font-semibold text-nayo-black/70">
            <CalendarDays size={14} />
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value as Range);
                setPage(1);
              }}
              className="bg-transparent pr-1 outline-none cursor-pointer"
              aria-label="Date range"
            >
              {ranges.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-4 sm:p-5 ${
              card.featured
                ? "relative overflow-hidden col-span-2 md:col-span-1 rounded-2xl bg-nayo-green shadow-[0_18px_40px_-20px_rgba(26,65,46,0.9)]"
                : cardClass
            }`}
          >
            {card.featured && (
              <span className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full bg-nayo-gold/20 blur-2xl" />
            )}
            <div className="relative flex items-center gap-2.5">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${card.chip}`}>
                {card.icon}
              </span>
              <span className={`text-[13px] font-medium ${card.featured ? "text-white/80" : "text-nayo-black/70"}`}>
                {card.label}
              </span>
            </div>
            <p className={`relative mt-4 text-3xl sm:text-[2.4rem] leading-none font-bold tracking-tight ${card.tone}`}>
              {card.value}
            </p>
            <p className={`relative mt-2 text-[11px] uppercase tracking-[0.14em] ${card.featured ? "text-white/45" : "text-nayo-black/40"}`}>
              {card.hint}
            </p>
          </div>
        ))}
      </div>

      {undecided > 0 && filter !== "decide" && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#F5C9A8] bg-[#FFF4EA] p-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 w-9 h-9 shrink-0 rounded-full bg-[#FDECDD] text-[#C2410C] flex items-center justify-center">
              <Package size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-nayo-black">
                {undecided} delivery order{undecided === 1 ? "" : "s"} need{undecided === 1 ? "s" : ""} a decision
              </p>
              <p className="text-xs text-nayo-black/55 mt-0.5">
                Does it need shipping with UPS, or will your delivery driver take it?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFilter("decide");
              setPage(1);
            }}
            className="shrink-0 rounded-xl bg-[#C2410C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9A3412]"
          >
            Review now
          </button>
        </div>
      )}

      <section id="order-list" className="space-y-4 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-display text-2xl font-bold text-nayo-black">
            {query ? `Results for “${query}”` : "Orders"}
          </h2>
          {awaitingPayment > 0 && (
            <p className="text-xs text-nayo-black/45 text-right">
              {awaitingPayment} checkout{awaitingPayment === 1 ? "" : "s"} started, not paid yet
            </p>
          )}
        </div>

        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto hide-scrollbar print:hidden">
          <div className="flex gap-2 min-w-max">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilter(f.id);
                    setPage(1);
                  }}
                  className={`rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold transition border ${
                    active
                      ? "bg-nayo-green text-white border-nayo-green shadow-[0_8px_20px_-10px_rgba(26,65,46,0.8)]"
                      : `bg-white border-nayo-black/[0.07] hover:border-nayo-gold/50 ${f.tone || "text-nayo-black/70"}`
                  }`}
                >
                  {f.label}
                  <span className={active ? "text-nayo-amber" : "opacity-70"}> ({counts[f.id]})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${cardClass} p-3 sm:p-4 bg-white/60`}>
          {pageOrders.length ? (
            <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {pageOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  imageFor={imageFor}
                  onOpen={() => setOpenId(order.id)}
                  onUpdate={updateFromCard}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ClipboardList size={24} />}
              title={paid.length ? "No orders match" : "No paid orders yet"}
              body={
                paid.length
                  ? "Try another status, date range or search."
                  : "Once a customer pays, their order will appear here with everything you need to fulfill it."
              }
            />
          )}

          {pages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1.5 print:hidden">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, current - 1))}
                disabled={current === 1}
                aria-label="Previous page"
                className="w-9 h-9 rounded-full flex items-center justify-center text-nayo-black/60 hover:bg-nayo-black/5 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - current) <= 1)
                .map((n, i, list) => (
                  <span key={n} className="flex items-center gap-1.5">
                    {i > 0 && n - list[i - 1] > 1 && (
                      <span className="text-xs text-nayo-black/35">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold ${
                        n === current
                          ? "bg-nayo-gold text-nayo-black"
                          : "text-nayo-black/60 hover:bg-nayo-black/5"
                      }`}
                    >
                      {n}
                    </button>
                  </span>
                ))}
              <button
                type="button"
                onClick={() => setPage(Math.min(pages, current + 1))}
                disabled={current === pages}
                aria-label="Next page"
                className="w-9 h-9 rounded-full flex items-center justify-center text-nayo-black/60 hover:bg-nayo-black/5 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <OrderDrawer
        order={openOrder}
        imageFor={imageFor}
        onClose={() => setOpenId(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
}

function FulfillmentBadge({ order }: { order: Order }) {
  const pickup = order.fulfillment === "pickup";
  const ups = order.deliveryMethod === "ups";
  const label = pickup
    ? "Pickup"
    : ups
      ? "Ship · UPS"
      : order.deliveryMethod === "local"
        ? "Delivery · Driver"
        : "Delivery";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
        pickup
          ? "bg-[#FDF4DC] text-[#A16207]"
          : ups
            ? "bg-[#F2ECFE] text-[#6D28D9]"
            : "bg-[#EAF1FE] text-[#1D4ED8]"
      }`}
    >
      {pickup ? <Store size={11} /> : ups ? <Package size={11} /> : <Truck size={11} />}
      {label}
    </span>
  );
}

type CardAction =
  | { kind: "status"; label: string; next: OrderStatus }
  | { kind: "open"; label: string };

function primaryAction(order: Order): CardAction | null {
  if (order.fulfillment === "pickup") {
    return order.status === "to_send"
      ? { kind: "status", label: "Mark picked up", next: "picked_up" }
      : null;
  }
  if (order.deliveryMethod === "ups") {
    if (order.status === "to_send") return { kind: "open", label: "Add UPS tracking" };
    if (order.status === "shipped") {
      return { kind: "status", label: "Mark delivered", next: "delivered" };
    }
    return null;
  }
  if (order.status === "to_send") {
    return { kind: "status", label: "Hand to driver", next: "sent" };
  }
  if (order.status === "sent") {
    return { kind: "status", label: "Mark delivered", next: "delivered" };
  }
  return null;
}

function DeliveryChoice({
  order,
  onUpdate,
  compact = false,
}: {
  order: Order;
  onUpdate: (id: string, patch: OrderPatch) => Promise<boolean>;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState<DeliveryMethod | null>(null);
  const choose = async (method: DeliveryMethod) => {
    setBusy(method);
    await onUpdate(order.id, { deliveryMethod: method });
    setBusy(null);
  };
  const button =
    "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition disabled:opacity-60";
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-[#F5C9A8] bg-[#FFF4EA] p-2.5"
          : "rounded-2xl border border-[#F5C9A8] bg-[#FFF4EA] p-4"
      }
    >
      <p className={`font-semibold text-nayo-black ${compact ? "text-[11px] text-center" : "text-sm"}`}>
        Does this order need shipping?
      </p>
      {!compact && (
        <p className="mt-1 text-xs text-nayo-black/55">
          Choose UPS if it is going by courier, or your driver if you are delivering it locally.
        </p>
      )}
      <div className={`flex gap-2 ${compact ? "mt-2" : "mt-3"}`}>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => choose("ups")}
          className={`${button} ${compact ? "py-2" : "py-2.5"} bg-[#6D28D9] border-[#6D28D9] text-white hover:bg-[#5B21B6]`}
        >
          <Package size={13} /> {busy === "ups" ? "Saving…" : compact ? "Yes, UPS" : "Yes, ship with UPS"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => choose("local")}
          className={`${button} ${compact ? "py-2" : "py-2.5"} bg-white border-nayo-black/15 text-nayo-black/75 hover:border-nayo-gold`}
        >
          <Truck size={13} /> {busy === "local" ? "Saving…" : compact ? "No, driver" : "No, our driver"}
        </button>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  imageFor,
  onOpen,
  onUpdate,
}: {
  order: Order;
  imageFor: (name: string, image?: string) => string | undefined;
  onOpen: () => void;
  onUpdate: (id: string, patch: OrderPatch) => Promise<boolean>;
}) {
  const [slide, setSlide] = useState(0);
  const [busy, setBusy] = useState(false);
  const images = order.items
    .map((item) => imageFor(item.name, item.image))
    .filter((src): src is string => Boolean(src));
  const image = images[slide % Math.max(images.length, 1)];
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const action = primaryAction(order);
  const meta = statusMeta[order.status];

  return (
    <article className="group rounded-2xl border border-nayo-black/[0.07] bg-white p-3.5 flex flex-col transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgba(26,65,46,0.45)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-nayo-black/60 tracking-wide">
          #{order.orderNumber.replace(/^NAYO-/, "")}
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>
      <div className="mt-2">
        <FulfillmentBadge order={order} />
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <Avatar name={order.customerName} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-nayo-black truncate">
            {order.customerName}
          </p>
          <p className="text-[11px] text-nayo-black/45">{timeAgo(orderTime(order))}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => (images.length > 1 ? setSlide(slide + 1) : onOpen())}
        className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F4F1EA]"
        aria-label={images.length > 1 ? "Next photo" : "Open order"}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-nayo-gold">
            <ShoppingBag size={28} />
          </span>
        )}
        {images.length > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-nayo-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
            {(slide % images.length) + 1}/{images.length}
          </span>
        )}
      </button>

      <div className="mt-3 flex-1">
        <p className="text-xs font-bold text-nayo-black">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </p>
        <ul className="mt-1 space-y-0.5">
          {order.items.slice(0, 3).map((item, i) => (
            <li key={i} className="text-xs text-nayo-black/55 truncate">
              {item.qty}× {item.name}
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-xs text-nayo-black/40">+{order.items.length - 3} more</li>
          )}
        </ul>
      </div>

      <div className="mt-3 rounded-lg bg-[#F4F1EA] px-3 py-2 text-center text-[11px] font-medium text-nayo-black/65 truncate">
        {order.fulfillment === "pickup"
          ? "Pickup at Nayo · Saturdays"
          : order.address
            ? `${order.address.city}, ${order.address.region}`
            : "Delivery"}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-nayo-black">Total:</span>
        <span className="text-lg font-bold text-nayo-black">{money(order.total)}</span>
      </div>

      {order.trackingNumber && order.deliveryMethod === "ups" && (
        <a
          href={upsTrackingUrl(order.trackingNumber)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-[#6D28D9] hover:underline truncate"
        >
          UPS {order.trackingNumber} <ExternalLink size={11} />
        </a>
      )}

      <div className="mt-3 space-y-2 print:hidden">
        {needsDeliveryChoice(order) ? (
          <DeliveryChoice order={order} onUpdate={onUpdate} compact />
        ) : action ? (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (action.kind === "open") return onOpen();
              setBusy(true);
              await onUpdate(order.id, { status: action.next });
              setBusy(false);
            }}
            className="w-full rounded-lg bg-nayo-green py-2.5 text-xs font-semibold text-white transition hover:bg-[#143424] disabled:opacity-60"
          >
            {busy ? "Saving…" : action.label}
          </button>
        ) : (
          <div className="w-full rounded-lg bg-nayo-green-light py-2.5 text-xs font-semibold text-white flex items-center justify-center gap-1.5">
            {meta.done} <Check size={14} />
          </div>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="w-full rounded-lg border border-nayo-black/15 py-2.5 text-xs font-semibold text-nayo-black/75 hover:border-nayo-gold hover:text-nayo-black"
        >
          View details
        </button>
      </div>
    </article>
  );
}

function OrderDrawer({
  order,
  imageFor,
  onClose,
  onUpdate,
}: {
  order: Order | null;
  imageFor: (name: string, image?: string) => string | undefined;
  onClose: () => void;
  onUpdate: (id: string, patch: OrderPatch) => Promise<boolean>;
}) {
  if (!order) return <Drawer open={false} title="" onClose={onClose}>{null}</Drawer>;

  const steps = orderSteps(order);
  const deciding = needsDeliveryChoice(order);

  return (
    <Drawer
      open
      title={order.orderNumber}
      onClose={onClose}
      subtitle={
        <span className="flex flex-wrap items-center gap-2">
          <FulfillmentBadge order={order} />
          <span>Paid {formatDateTime(order.paidAt || order.createdAt)}</span>
        </span>
      }
    >
      <div className="space-y-6">
        {deciding && <DeliveryChoice order={order} onUpdate={onUpdate} />}

        {order.fulfillment === "delivery" && order.deliveryMethod && order.status === "to_send" && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-nayo-black/[0.07] bg-white px-4 py-3 text-xs">
            <span className="text-nayo-black/65">
              Going by{" "}
              <strong className="text-nayo-black">
                {order.deliveryMethod === "ups" ? "UPS shipping" : "your delivery driver"}
              </strong>
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdate(order.id, {
                  deliveryMethod: order.deliveryMethod === "ups" ? "local" : "ups",
                })
              }
              className="font-semibold text-nayo-green hover:text-nayo-gold"
            >
              Switch to {order.deliveryMethod === "ups" ? "driver" : "UPS"}
            </button>
          </div>
        )}

        <section className={deciding ? "opacity-50 pointer-events-none" : ""}>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold mb-2">
            Status
          </p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step) => {
              const active = order.status === step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => !active && onUpdate(order.id, { status: step })}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-nayo-green text-white border-nayo-green"
                      : "bg-white border-nayo-black/10 text-nayo-black/65 hover:border-nayo-gold"
                  }`}
                >
                  {statusMeta[step].label}
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${cardClass} p-4 space-y-3`}>
          <div className="flex items-center gap-3">
            <Avatar name={order.customerName} size="lg" />
            <div className="min-w-0">
              <p className="font-semibold text-nayo-black">{order.customerName}</p>
              <p className="text-xs text-nayo-black/50">
                {order.receiptSentAt
                  ? `Receipt emailed ${formatDateTime(order.receiptSentAt)}`
                  : "Receipt not emailed yet"}
              </p>
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            {order.phone && (
              <a href={`tel:${order.phone}`} className="flex items-center gap-2.5 text-nayo-black/75 hover:text-nayo-green">
                <Phone size={15} className="text-nayo-gold" /> {order.phone}
              </a>
            )}
            {order.email && (
              <a href={`mailto:${order.email}`} className="flex items-center gap-2.5 text-nayo-black/75 hover:text-nayo-green break-all">
                <Mail size={15} className="text-nayo-gold shrink-0" /> {order.email}
              </a>
            )}
            <p className="flex items-start gap-2.5 text-nayo-black/75">
              <MapPin size={15} className="text-nayo-gold mt-0.5 shrink-0" />
              {order.fulfillment === "pickup" || !order.address
                ? "Pickup at Nayo, Saturdays 9:00 AM – 9:00 PM"
                : `${order.address.line1}, ${order.address.city}, ${order.address.region} ${order.address.postalCode}`}
            </p>
          </div>
        </section>

        <section>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold mb-2">
            Items
          </p>
          <ul className={`${cardClass} divide-y divide-nayo-black/[0.06]`}>
            {order.items.map((item, i) => {
              const src = imageFor(item.name, item.image);
              return (
                <li key={i} className="flex gap-3 p-3">
                  <span className="w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F1EA] flex items-center justify-center text-nayo-gold">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" className="h-full w-full object-cover" />
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
                  <p className="text-sm font-semibold text-nayo-black">
                    {money(item.qty * item.price)}
                  </p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-3 space-y-1.5 px-1 text-sm">
            <div className="flex justify-between text-nayo-black/60">
              <dt>Subtotal</dt>
              <dd>{money(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-nayo-black/60">
              <dt>{order.fulfillment === "pickup" ? "Pickup" : "Delivery"}</dt>
              <dd>{order.deliveryFee ? money(order.deliveryFee) : "Complimentary"}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-nayo-black/10 font-bold text-nayo-black text-base">
              <dt>Total</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
        </section>

        {order.fulfillment === "delivery" && order.deliveryMethod === "ups" && (
          <UpsSection
            key={`${order.id}-ups-${order.trackingNumber ?? ""}`}
            order={order}
            onUpdate={onUpdate}
          />
        )}

        {order.fulfillment === "delivery" && order.deliveryMethod === "local" && (
          <section className="space-y-2" key={`${order.id}-local`}>
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold">
              Driver notes
            </p>
            <textarea
              key={order.labelNote ?? ""}
              defaultValue={order.labelNote}
              placeholder="Driver name, delivery window, gate code…"
              rows={3}
              onBlur={(e) => {
                if (e.target.value !== (order.labelNote ?? "")) {
                  void onUpdate(order.id, { labelNote: e.target.value });
                }
              }}
              className={fieldClass}
            />
            <p className="text-[11px] text-nayo-black/40">Saves when you click away.</p>
          </section>
        )}
      </div>
    </Drawer>
  );
}

function UpsSection({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (id: string, patch: OrderPatch) => Promise<boolean>;
}) {
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [busy, setBusy] = useState(false);
  const cleaned = tracking.replace(/\s+/g, "").toUpperCase();
  const changed = cleaned !== (order.trackingNumber ?? "");
  const shippedAlready = order.status === "shipped" || order.status === "delivered";

  const save = async (markShipped: boolean) => {
    setBusy(true);
    await onUpdate(order.id, {
      trackingNumber: cleaned,
      ...(markShipped ? { status: "shipped" as const } : {}),
    });
    setBusy(false);
  };

  return (
    <section className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold">
        UPS shipping
      </p>
      <ol className="space-y-1.5 text-xs text-nayo-black/60 list-decimal pl-4">
        <li>
          Create the label on{" "}
          <a
            href="https://www.ups.com/ship"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#6D28D9] hover:underline"
          >
            ups.com/ship
          </a>{" "}
          using the address above.
        </li>
        <li>Copy the tracking number from the label (it starts with 1Z).</li>
        <li>Paste it below and press Save and mark shipped. The customer gets it by email.</li>
      </ol>
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="1Z999AA10123456784"
        autoCapitalize="characters"
        spellCheck={false}
        className={`${fieldClass} font-mono tracking-wide`}
      />
      {cleaned && !looksLikeUpsNumber(cleaned) && (
        <p className="text-[11px] text-[#C2410C]">
          UPS numbers usually start with 1Z and are 18 characters. Double check it before saving.
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        {!shippedAlready ? (
          <button
            type="button"
            disabled={busy || !cleaned}
            onClick={() => save(true)}
            className="flex-1 rounded-xl bg-[#6D28D9] py-2.5 text-xs font-semibold text-white hover:bg-[#5B21B6] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save and mark shipped"}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy || !changed || !cleaned}
            onClick={() => save(false)}
            className="flex-1 rounded-xl bg-nayo-green py-2.5 text-xs font-semibold text-white hover:bg-[#143424] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Update tracking number"}
          </button>
        )}
        {order.trackingNumber && (
          <a
            href={upsTrackingUrl(order.trackingNumber)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-nayo-black/15 bg-white py-2.5 text-xs font-semibold text-nayo-black/75 hover:border-nayo-gold"
          >
            Track on UPS <ExternalLink size={12} />
          </a>
        )}
      </div>
      {order.shippingEmailSentAt && (
        <p className="text-[11px] text-nayo-green-light">
          Tracking emailed to the customer {formatDateTime(order.shippingEmailSentAt)}.
        </p>
      )}
      <textarea
        key={order.labelNote ?? ""}
        defaultValue={order.labelNote}
        placeholder="Label notes (box size, weight, service level)"
        rows={2}
        onBlur={(e) => {
          if (e.target.value !== (order.labelNote ?? "")) {
            void onUpdate(order.id, { labelNote: e.target.value });
          }
        }}
        className={fieldClass}
      />
    </section>
  );
}
