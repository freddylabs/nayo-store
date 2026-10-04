"use client";

import { useEffect, useRef } from "react";
import {
  ExternalLink,
  Hourglass,
  Inbox,
  Mail,
  Package,
  RefreshCw,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  isOrderPaid,
  needsDeliveryChoice,
  type Order,
} from "@/app/lib/site-data";
import type { InboxSummary } from "@/app/lib/outlook";
import type { OrderFilter } from "./OrdersView";
import { money, timeAgo } from "./ui";

export type NotificationsData = { inbox: InboxSummary; outlookUrl: string } | null;

export function orderAlerts(orders: Order[]) {
  const paid = orders.filter(isOrderPaid);
  return {
    decide: paid.filter(needsDeliveryChoice).length,
    waiting: paid.filter((o) => o.status === "to_send").length,
    needTracking: paid.filter(
      (o) => o.deliveryMethod === "ups" && o.status === "to_send" && !o.trackingNumber
    ).length,
    recent: paid
      .filter((o) => Date.now() - new Date(o.paidAt || o.createdAt).getTime() < 48 * 3600e3)
      .sort((a, b) => (b.paidAt || b.createdAt).localeCompare(a.paidAt || a.createdAt))
      .slice(0, 4),
  };
}

export function unreadCount(data: NotificationsData): number {
  return data?.inbox.configured && "unread" in data.inbox ? data.inbox.unread : 0;
}

export default function NotificationsPanel({
  orders,
  data,
  loading,
  onRefresh,
  onClose,
  onShowOrders,
}: {
  orders: Order[];
  data: NotificationsData;
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
  onShowOrders: (filter: OrderFilter) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const alerts = orderAlerts(orders);
  const outlookUrl = data?.outlookUrl ?? "https://outlook.office.com/mail/";
  const inbox = data?.inbox;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (panel.current?.contains(target) || target.closest("[data-bell]")) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  const orderRows = [
    alerts.decide > 0 && {
      key: "decide",
      icon: <Package size={15} />,
      tone: "bg-[#FDECDD] text-[#C2410C]",
      title: `${alerts.decide} need${alerts.decide === 1 ? "s" : ""} shipping decided`,
      body: "Choose UPS or your delivery driver.",
      filter: "decide" as OrderFilter,
    },
    alerts.needTracking > 0 && {
      key: "tracking",
      icon: <Package size={15} />,
      tone: "bg-[#F2ECFE] text-[#6D28D9]",
      title: `${alerts.needTracking} waiting for a UPS label`,
      body: "Create the label, then add the tracking number.",
      filter: "to_send" as OrderFilter,
    },
    alerts.waiting > 0 && {
      key: "waiting",
      icon: <Hourglass size={15} />,
      tone: "bg-[#FDF4DC] text-[#A16207]",
      title: `${alerts.waiting} order${alerts.waiting === 1 ? "" : "s"} to fulfill`,
      body: "Paid and waiting to go out.",
      filter: "to_send" as OrderFilter,
    },
  ].filter(Boolean) as {
    key: string;
    icon: React.ReactNode;
    tone: string;
    title: string;
    body: string;
    filter: OrderFilter;
  }[];

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Notifications"
      className="fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-[400px] z-40 max-h-[calc(100dvh-11.5rem)] lg:max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-nayo-black/[0.07] bg-[#FBF9F4] shadow-[0_30px_70px_-20px_rgba(10,10,10,0.45)]"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-nayo-black/[0.06] bg-[#FBF9F4] px-5 py-4">
        <p className="text-display text-lg font-bold text-nayo-black">Notifications</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh"
            className="w-8 h-8 rounded-full flex items-center justify-center text-nayo-black/50 hover:bg-nayo-black/5 hover:text-nayo-black"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="w-8 h-8 rounded-full flex items-center justify-center text-nayo-black/50 hover:bg-nayo-black/5 hover:text-nayo-black"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <section className="px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold mb-3">Orders</p>
        {orderRows.length ? (
          <ul className="space-y-2">
            {orderRows.map((row) => (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() => onShowOrders(row.filter)}
                  className="w-full flex items-start gap-3 rounded-xl border border-nayo-black/[0.06] bg-white p-3 text-left hover:border-nayo-gold/60"
                >
                  <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${row.tone}`}>
                    {row.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-nayo-black">{row.title}</span>
                    <span className="block text-xs text-nayo-black/50">{row.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-white px-4 py-3 text-sm text-nayo-black/55">
            All caught up. Nothing waiting to go out.
          </p>
        )}

        {alerts.recent.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-nayo-black/50 mb-2">New in the last 2 days</p>
            <ul className="divide-y divide-nayo-black/[0.06] rounded-xl bg-white border border-nayo-black/[0.06]">
              {alerts.recent.map((order) => (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => onShowOrders("all")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-nayo-gold/[0.06]"
                  >
                    <ShoppingBag size={14} className="text-nayo-gold shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-nayo-black">
                        {order.customerName} · {money(order.total)}
                      </span>
                      <span className="block text-[11px] text-nayo-black/45">
                        {order.orderNumber} · {timeAgo(order.paidAt || order.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="border-t border-nayo-black/[0.06] px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-nayo-gold">
            Email · info@nayo.market
          </p>
          {inbox?.configured && "unread" in inbox && (
            <span className="rounded-full bg-[#E4572E] px-2 py-0.5 text-[10px] font-bold text-white">
              {inbox.unread} unread
            </span>
          )}
        </div>

        {!inbox ? (
          <p className="text-sm text-nayo-black/50">Checking your inbox…</p>
        ) : !inbox.configured ? (
          <p className="rounded-xl bg-white px-4 py-3 text-xs leading-relaxed text-nayo-black/55">
            Unread email counts appear here once Microsoft 365 is connected. You can still open
            your inbox below.
          </p>
        ) : "error" in inbox ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
            Could not check your inbox: {inbox.error}
          </p>
        ) : inbox.messages.length ? (
          <ul className="divide-y divide-nayo-black/[0.06] rounded-xl bg-white border border-nayo-black/[0.06]">
            {inbox.messages.map((message) => (
              <li key={message.id}>
                <a
                  href={message.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 px-3 py-2.5 hover:bg-nayo-gold/[0.06]"
                >
                  <Mail size={14} className="mt-0.5 text-nayo-green shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-nayo-black">
                      {message.subject}
                    </span>
                    <span className="block truncate text-[11px] text-nayo-black/45">
                      {message.from}
                      {message.receivedAt ? ` · ${timeAgo(message.receivedAt)}` : ""}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-white px-4 py-3 text-sm text-nayo-black/55 flex items-center gap-2">
            <Inbox size={15} className="text-nayo-gold" /> No unread email.
          </p>
        )}

        <a
          href={outlookUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-nayo-green py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#143424]"
        >
          Open Outlook inbox <ExternalLink size={13} />
        </a>
      </section>
    </div>
  );
}
