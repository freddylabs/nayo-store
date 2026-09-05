"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, ShoppingCart, Store, Truck, Clock, Phone } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ExploreShop from "@/app/components/ExploreShop";
import MealExtrasPrompt from "@/app/components/MealExtrasPrompt";
import { useCart } from "@/app/context/CartContext";
import { mealNeedsExtrasPrompt } from "@/app/lib/meal";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  getDeliveryFee,
  type FulfillmentMethod,
} from "@/app/lib/checkout";

const fieldClass =
  "w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-nayo-gold bg-nayo-white";

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const router = useRouter();
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
  const [askExtras, setAskExtras] = useState(false);

  const deliveryFee = useMemo(
    () => getDeliveryFee(totalPrice, fulfillment),
    [totalPrice, fulfillment]
  );
  const grandTotal = totalPrice + deliveryFee;
  const freeDelivery =
    fulfillment === "delivery" && deliveryFee === 0 && totalPrice > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (state.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (state.items.some(mealNeedsExtrasPrompt)) {
      setAskExtras(true);
      return;
    }

    await startCheckout();
  };

  const startCheckout = async () => {
    setAskExtras(false);
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
            note: item.note,
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
        <div className="pt-[5.75rem] sm:pt-[6.5rem]">
          <section className="relative bg-nayo-green overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
            <div className="relative max-w-[800px] mx-auto px-6 py-14 sm:py-16 text-center">
              <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                Checkout
              </p>
              <h1 className="text-display text-4xl sm:text-5xl font-bold text-white mt-3">
                Your cart is empty
              </h1>
              <p className="mt-4 text-white/75 max-w-md mx-auto">
                Add items from Apparel, Foods, or Health, then come back to
                check out.
              </p>
            </div>
          </section>
          <div className="py-16 px-6">
            <div className="max-w-[800px] mx-auto text-center">
              <ExploreShop />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />
      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="relative bg-nayo-green overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
          <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
              Checkout
            </p>
            <h1 className="text-display text-4xl sm:text-5xl font-bold text-white leading-tight mt-3">
              Pickup or delivery — we will take care of the rest.
            </h1>
            <p className="mt-4 text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
              We fulfill orders on Mondays, Fridays, and Saturdays, 9:00 AM –
              9:00 PM. Questions? Call{" "}
              <a href="tel:+12403083183" className="text-nayo-gold font-semibold">
                +1 (240) 308-3183
              </a>
              .
            </p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-5 gap-10"
        >
          <div className="lg:col-span-3 space-y-10">
            <section>
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold mb-4">
                How would you like your order?
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
                  <p className="text-sm text-nayo-black/60 mt-1 leading-relaxed">
                    You are welcome to collect your order during our working
                    hours. Pickup is complimentary.
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
                  <p className="text-sm text-nayo-black/60 mt-1 leading-relaxed">
                    We would be glad to bring your order to you. Delivery is $
                    {DELIVERY_FEE.toFixed(2)}, and it is complimentary on
                    orders of ${FREE_DELIVERY_THRESHOLD} or more.
                  </p>
                </button>
              </div>
              <p className="mt-4 text-sm text-nayo-black/55 flex items-start gap-2 leading-relaxed">
                <Clock size={14} className="mt-0.5 shrink-0 text-nayo-gold" />
                Mondays, Fridays, and Saturdays, 9:00 AM – 9:00 PM. Pickup and
                delivery only.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold">
                Your details
              </h2>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
                className={fieldClass}
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={fieldClass}
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className={fieldClass}
              />
            </section>

            {fulfillment === "delivery" && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-nayo-gold flex items-center gap-2">
                  <MapPin size={14} />
                  Delivery address
                </h2>
                <p className="text-sm text-nayo-black/55 leading-relaxed">
                  Please share a complete address so we can reach you without
                  delay. Kindly have someone available to receive the order.
                </p>
                <input
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Street address"
                  className={fieldClass}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className={fieldClass}
                  />
                  <input
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="State"
                    className={fieldClass}
                  />
                  <input
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="ZIP"
                    className={fieldClass}
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
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-nayo-black line-clamp-1">
                        {item.name}
                      </p>
                      {item.note && (
                        <p className="text-[11px] text-nayo-black/50 leading-snug line-clamp-2">
                          {item.note}
                        </p>
                      )}
                      <p className="text-xs text-nayo-black/50">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
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
                  <span
                    className={
                      freeDelivery ? "text-nayo-green font-semibold" : ""
                    }
                  >
                    {fulfillment === "pickup"
                      ? "Complimentary"
                      : freeDelivery
                        ? "Complimentary"
                        : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="gold-text text-display">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-nayo-black/45 leading-relaxed flex items-start gap-1.5">
                <Phone size={12} className="mt-0.5 shrink-0" />
                Need help? +1 (240) 308-3183
              </p>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full mt-6 py-4 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShoppingCart size={16} />
                {loading ? "Taking you to payment…" : "Pay now"}
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
      <MealExtrasPrompt
        open={askExtras}
        title="Would you like anything extra with your meals?"
        body="You are welcome to add more meat, plantain, a drink, or other sides before you pay."
        confirmLabel="Yes, take me to extras"
        declineLabel="No thank you, continue to pay"
        onConfirm={() => {
          setAskExtras(false);
          router.push("/food");
        }}
        onDecline={() => {
          dispatch({ type: "DECLINE_MEAL_EXTRAS" });
          void startCheckout();
        }}
      />
      <Footer />
    </main>
  );
}
