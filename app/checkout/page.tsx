"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingCart, Store, Truck } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/context/CartContext";
import {
  FREE_DELIVERY_THRESHOLD,
  getDeliveryFee,
  type FulfillmentMethod,
} from "@/app/lib/checkout";

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryFee = useMemo(
    () => getDeliveryFee(totalPrice, fulfillment),
    [totalPrice, fulfillment]
  );
  const grandTotal = totalPrice + deliveryFee;
  const freeDelivery = fulfillment === "delivery" && deliveryFee === 0 && totalPrice > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (state.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            lineId: item.lineId,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image,
          })),
          fulfillment,
          customerName,
          email,
          phone,
          address:
            fulfillment === "delivery"
              ? { line1, city, region, postalCode }
              : undefined,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <main className="relative bg-nayo-white min-h-screen">
        <Navbar />
        <div className="pt-36 pb-24 px-6 max-w-xl mx-auto text-center">
          <ShoppingCart size={40} className="mx-auto text-nayo-gold mb-4" />
          <h1 className="text-display text-4xl font-bold text-nayo-black mb-3">
            Your cart is empty
          </h1>
          <p className="text-nayo-black/55 mb-8">
            Add items from the shop, then come back to check out.
          </p>
          <Link href="/fashion" className="btn-gold px-6 py-3 text-xs tracking-widest uppercase font-bold inline-flex items-center gap-2">
            <ShoppingCart size={14} />
            Continue shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-5 sm:px-8 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <ShoppingCart size={26} className="text-nayo-gold" />
          <h1 className="text-display text-4xl sm:text-5xl font-bold text-nayo-black">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold mb-4">
                Fulfillment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment("pickup")}
                  className={`rounded-2xl border p-5 text-left transition-colors ${
                    fulfillment === "pickup"
                      ? "border-nayo-gold bg-nayo-gold/10"
                      : "border-nayo-black/10 hover:border-nayo-gold/40"
                  }`}
                >
                  <Store size={20} className="text-nayo-gold mb-3" />
                  <p className="font-bold text-nayo-black">Pickup</p>
                  <p className="text-sm text-nayo-black/55 mt-1">
                    Collect at the flagship. No delivery fee.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("delivery")}
                  className={`rounded-2xl border p-5 text-left transition-colors ${
                    fulfillment === "delivery"
                      ? "border-nayo-gold bg-nayo-gold/10"
                      : "border-nayo-black/10 hover:border-nayo-gold/40"
                  }`}
                >
                  <Truck size={20} className="text-nayo-gold mb-3" />
                  <p className="font-bold text-nayo-black">Delivery</p>
                  <p className="text-sm text-nayo-black/55 mt-1">
                    ${FREE_DELIVERY_THRESHOLD}+ ships free. Otherwise $9.99.
                  </p>
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold">
                Contact
              </h2>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
              />
            </section>

            {fulfillment === "delivery" && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold flex items-center gap-2">
                  <MapPin size={14} />
                  Delivery address
                </h2>
                <input
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Street address"
                  className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
                  />
                  <input
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="State"
                    className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
                  />
                  <input
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="ZIP"
                    className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold"
                  />
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-nayo-gold/25 p-6 sticky top-32 bg-nayo-white">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold mb-5 flex items-center gap-2">
                <ShoppingCart size={14} />
                Order summary
              </h2>
              <ul className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <li key={item.lineId} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F3F4F6] shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-nayo-black line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-mono text-nayo-black/40">{item.lineId}</p>
                      <p className="text-xs text-nayo-black/50">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold">${(item.price * item.qty).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t border-nayo-gold/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-nayo-black/55">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nayo-black/55">
                    {fulfillment === "pickup" ? "Pickup" : "Delivery"}
                  </span>
                  <span className={freeDelivery ? "text-nayo-green font-semibold" : ""}>
                    {fulfillment === "pickup"
                      ? "Free"
                      : freeDelivery
                        ? "Free"
                        : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="gold-text text-display">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full mt-6 py-4 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShoppingCart size={16} />
                {loading ? "Redirecting…" : "Pay with Stripe"}
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "OPEN_CART" });
                }}
                className="btn-outline w-full mt-3 py-3 text-xs tracking-widest uppercase font-medium"
              >
                Edit cart
              </button>
            </div>
          </aside>
        </form>
      </div>
      <Footer />
    </main>
  );
}
