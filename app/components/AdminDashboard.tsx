"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  ExternalLink,
  LogOut,
  PenLine,
  Search,
  Shirt,
  Undo2,
} from "lucide-react";
import type { Product } from "@/app/data/products";
import {
  defaultCopy,
  isOrderPaid,
  type Order,
  type SiteCopy,
} from "@/app/lib/site-data";
import OrdersView, {
  type OrderFilter,
  type OrderPatch,
} from "@/app/components/admin/OrdersView";
import ItemsView from "@/app/components/admin/ItemsView";
import CopyView from "@/app/components/admin/CopyView";
import { fieldClass } from "@/app/components/admin/ui";
import NotificationsPanel, {
  orderAlerts,
  unreadCount,
  type NotificationsData,
} from "@/app/components/admin/NotificationsPanel";

type Tab = "orders" | "items" | "copy";

const tabs: { id: Tab; label: string; short: string; icon: typeof ClipboardList; search: string }[] = [
  { id: "orders", label: "Orders", short: "Orders", icon: ClipboardList, search: "Search orders, customers, items…" },
  { id: "items", label: "Items & prices", short: "Items", icon: Shirt, search: "Search items…" },
  { id: "copy", label: "Page writing", short: "Writing", icon: PenLine, search: "Search page writing…" },
];

type Toast = { text: string; kind: "ok" | "error"; undo?: () => Promise<void> } | null;

export default function AdminDashboard() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");
  const [query, setQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [copy, setCopy] = useState<SiteCopy>(defaultCopy);
  const savedCopy = useRef<SiteCopy>(defaultCopy);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<Toast>(null);
  const [undoing, setUndoing] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationsData>(null);
  const [checking, setChecking] = useState(false);

  const refreshOrders = useCallback(async () => {
    const res = await fetch("/api/admin/orders");
    if (!res.ok) return;
    const data = (await res.json()) as { orders: Order[] };
    setOrders(data.orders);
  }, []);

  const refreshNotifications = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) setNotifications((await res.json()) as NotificationsData);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      void refreshOrders();
      void refreshNotifications();
    };
    const first = setTimeout(() => void refreshNotifications(), 0);
    const timer = setInterval(tick, 60_000);
    window.addEventListener("focus", tick);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, [authed, refreshOrders, refreshNotifications]);

  const notify = (text: string, kind: "ok" | "error" = "ok", undo?: () => Promise<void>) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, kind, undo });
    toastTimer.current = setTimeout(() => setToast(null), undo ? 10_000 : 3200);
  };

  const runUndo = async (undo: () => Promise<void>) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setUndoing(true);
    try {
      await undo();
    } finally {
      setUndoing(false);
    }
  };

  const load = async () => {
    const [p, c, o] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/copy"),
      fetch("/api/admin/orders"),
    ]);
    if (!p.ok) {
      setAuthed(false);
      return;
    }
    const productsData = (await p.json()) as { products: Product[] };
    const copyData = (await c.json()) as { copy: SiteCopy };
    const ordersData = (await o.json()) as { orders: Order[] };
    setProducts(productsData.products);
    setCopy(copyData.copy);
    savedCopy.current = copyData.copy;
    setOrders(ordersData.orders);
    setAuthed(true);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => {
        if (res.ok) return load();
        setAuthed(false);
      })
      .finally(() => setReady(true));
  }, []);

  const saveProducts = async (next: Product[], isUndo = false) => {
    const before = products;
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: next }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      notify(data.error || "Could not save items. Please try again.", "error");
      return false;
    }
    setProducts(next);
    if (isUndo) notify("Change undone. The shop is back to how it was.");
    else
      notify("Items saved. They are live in the shop.", "ok", async () => {
        await saveProducts(before, true);
      });
    return true;
  };

  const putCopy = async (next: SiteCopy) => {
    const res = await fetch("/api/admin/copy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copy: next }),
    });
    if (!res.ok) {
      notify("Could not save the writing. Please try again.", "error");
      return false;
    }
    savedCopy.current = next;
    return true;
  };

  const saveCopy = async () => {
    const before = savedCopy.current;
    if (!(await putCopy(copy))) return;
    notify("Page writing saved.", "ok", async () => {
      if (!(await putCopy(before))) return;
      setCopy(before);
      notify("Change undone. The writing is back to how it was.");
    });
  };

  const updateOrder = async (id: string, patch: OrderPatch, undoOf?: Order) => {
    const before = orders.find((item) => item.id === id);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = (await res.json().catch(() => ({}))) as { order?: Order; error?: string };
    if (!res.ok || !data.order) {
      notify(data.error || "Could not update the order.", "error");
      return false;
    }
    const order = data.order;
    setOrders((current) => current.map((item) => (item.id === id ? order : item)));

    if (undoOf) {
      notify(
        undoOf.shippingEmailSentAt && order.status === "to_send"
          ? `${order.orderNumber} change undone. The customer already got a tracking email; shipping again sends the new number.`
          : `${order.orderNumber} change undone.`
      );
      return true;
    }
    const restore: OrderPatch | null = before
      ? {
          status: before.status,
          deliveryMethod: before.deliveryMethod ?? null,
          trackingNumber: before.trackingNumber ?? "",
          labelNote: before.labelNote ?? "",
        }
      : null;
    notify(
      patch.status === "shipped" && order.shippingEmailSentAt
        ? `${order.orderNumber} shipped. Tracking emailed to the customer.`
        : `${order.orderNumber} updated.`,
      "ok",
      restore
        ? async () => {
            await updateOrder(id, restore, order);
          }
        : undefined
    );
    return true;
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    window.scrollTo({ top: 0 });
  };

  if (!ready) {
    return (
      <div className="min-h-dvh bg-nayo-green flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-nayo-gold/30 border-t-nayo-gold animate-spin" />
      </div>
    );
  }

  if (!authed) return <SignIn onSignedIn={load} />;

  const waiting = orders.filter((o) => isOrderPaid(o) && o.status === "to_send").length;
  const activeTab = tabs.find((t) => t.id === tab)!;
  const unread = unreadCount(notifications);
  const bellCount = orderAlerts(orders).waiting + unread;

  return (
    <div className="min-h-dvh bg-[#F4F1EA] lg:pl-[104px]">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-[104px] flex-col items-center bg-nayo-green py-6 print:hidden">
        <Link href="/" aria-label="Nayo store" className="block w-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Nayo_logo_nav.png" alt="Nayo" className="w-full h-auto" />
        </Link>
        <div className="mt-6 h-px w-12 bg-nayo-gold/30" />
        <nav className="mt-6 flex flex-col items-center gap-3">
          {tabs.map(({ id, short, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className="group flex flex-col items-center gap-1.5"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition ${
                    active
                      ? "bg-gradient-to-br from-nayo-gold to-nayo-amber text-nayo-green shadow-[0_8px_24px_-6px_rgba(212,175,55,0.7)]"
                      : "text-white/60 group-hover:text-white group-hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  {id === "orders" && waiting > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E4572E] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-nayo-green">
                      {waiting}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] font-semibold tracking-wide ${active ? "text-nayo-amber" : "text-white/55"}`}>
                  {short}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Open the store"
            title="Open the store"
          >
            <ExternalLink size={18} />
          </a>
          <button
            type="button"
            onClick={signOut}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 bg-[#F4F1EA]/85 backdrop-blur-md border-b border-nayo-black/[0.05] print:hidden">
        <div className="mx-auto max-w-[1500px] flex items-center gap-3 px-4 sm:px-8 h-16 sm:h-20">
          <Link href="/" className="lg:hidden shrink-0 w-10" aria-label="Nayo store">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Nayo_logo_nav.png" alt="Nayo" className="w-full h-auto" />
          </Link>
          <label className="relative flex-1 max-w-xl mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nayo-black/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeTab.search}
              className="w-full rounded-full border border-nayo-black/[0.07] bg-white pl-11 pr-4 py-2.5 sm:py-3 text-sm outline-none shadow-[0_1px_2px_rgba(10,10,10,0.04)] focus:border-nayo-gold focus:ring-4 focus:ring-nayo-gold/15"
            />
          </label>
          <div className="relative shrink-0">
            <button
              type="button"
              data-bell
              onClick={() => {
                const next = !bellOpen;
                setBellOpen(next);
                if (next) {
                  void refreshOrders();
                  void refreshNotifications();
                }
              }}
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition ${
                bellOpen
                  ? "bg-nayo-green border-nayo-green text-nayo-amber"
                  : "bg-white border-nayo-black/[0.07] text-nayo-black/70 hover:text-nayo-black"
              }`}
              aria-label={`Notifications: ${waiting} orders to fulfill, ${unread} unread emails`}
              aria-expanded={bellOpen}
              title="Notifications"
            >
              <Bell size={17} />
              {bellCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E4572E] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#F4F1EA]">
                  {bellCount > 99 ? "99+" : bellCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <NotificationsPanel
                orders={orders}
                data={notifications}
                loading={checking}
                onRefresh={() => {
                  void refreshOrders();
                  void refreshNotifications();
                }}
                onClose={() => setBellOpen(false)}
                onShowOrders={(filter) => {
                  setOrderFilter(filter);
                  switchTab("orders");
                  setBellOpen(false);
                  requestAnimationFrame(() =>
                    document.getElementById("order-list")?.scrollIntoView({ behavior: "smooth" })
                  );
                }}
              />
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 rounded-full bg-white border border-nayo-black/[0.07] pl-1.5 pr-4 py-1.5">
            <span className="w-8 h-8 rounded-full bg-nayo-green text-nayo-amber text-xs font-bold flex items-center justify-center">
              N
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-semibold text-nayo-black">Nayo Owner</span>
              <span className="block text-[10px] text-nayo-black/45">info@nayo.market</span>
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-white border border-nayo-black/[0.07] flex items-center justify-center text-nayo-black/70"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 sm:px-8 pt-6 sm:pt-8 pb-28 lg:pb-12">
        {tab === "orders" && (
          <OrdersView
            orders={orders}
            products={products}
            query={query}
            filter={orderFilter}
            onFilter={setOrderFilter}
            onUpdate={updateOrder}
          />
        )}
        {tab === "items" && <ItemsView products={products} query={query} onSave={saveProducts} />}
        {tab === "copy" && (
          <CopyView copy={copy} query={query} onChange={setCopy} onSave={saveCopy} />
        )}
      </main>

      <nav className="lg:hidden fixed inset-x-3 bottom-3 z-30 rounded-2xl bg-nayo-green/95 backdrop-blur shadow-[0_18px_40px_-12px_rgba(10,10,10,0.5)] px-2 py-2 grid grid-cols-4 print:hidden">
        {tabs.map(({ id, short, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => switchTab(id)}
              className={`relative flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold ${
                active ? "text-nayo-amber" : "text-white/60"
              }`}
            >
              <span className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? "bg-gradient-to-br from-nayo-gold to-nayo-amber text-nayo-green" : ""}`}>
                <Icon size={18} />
              </span>
              {short}
              {id === "orders" && waiting > 0 && (
                <span className="absolute top-0 right-[calc(50%-24px)] min-w-[16px] h-4 px-1 rounded-full bg-[#E4572E] text-[9px] font-bold text-white flex items-center justify-center">
                  {waiting}
                </span>
              )}
            </button>
          );
        })}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold text-white/60"
        >
          <span className="w-9 h-9 rounded-full flex items-center justify-center">
            <ExternalLink size={18} />
          </span>
          Store
        </a>
      </nav>

      {toast && (
        <div
          role="status"
          className={`fixed z-[60] left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0 w-[calc(100%-2rem)] max-w-md sm:w-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-xl ${
            toast.kind === "ok" ? "bg-nayo-black text-white" : "bg-red-600 text-white"
          }`}
        >
          <span className="flex-1">
            {toast.kind === "ok" && <span className="text-nayo-gold mr-1.5">●</span>}
            {toast.text}
          </span>
          {toast.undo && (
            <button
              type="button"
              disabled={undoing}
              onClick={() => void runUndo(toast.undo!)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-nayo-amber hover:bg-white/20 disabled:opacity-60"
            >
              <Undo2 size={14} />
              {undoing ? "Undoing…" : "Undo"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SignIn({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      setBusy(false);
      return;
    }
    setPassword("");
    await onSignedIn();
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-nayo-green flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-nayo-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-nayo-green-light/40 blur-3xl" />

      <div className="relative w-full max-w-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Nayo_logo_nav.png" alt="Nayo" className="mx-auto w-28 sm:w-32 h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />

        <form
          onSubmit={submit}
          className="mt-8 rounded-3xl bg-[#FBF9F4] p-7 sm:p-9 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] border border-nayo-gold/25 space-y-5"
        >
          <div>
            <p className="text-nayo-gold text-[11px] tracking-[0.3em] uppercase font-semibold">
              Owner desk
            </p>
            <h1 className="text-display text-3xl font-bold text-nayo-black mt-2">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-nayo-black/55">
              Sign in to follow orders and update the shop.
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className={fieldClass}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-gold w-full py-3.5 text-xs tracking-widest uppercase disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
