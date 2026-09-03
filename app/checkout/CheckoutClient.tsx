"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  CreditCard,
  Truck,
  Loader2,
  ShoppingBag,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { computeTotals, formatCurrency } from "@/app/lib/pricing";
import { placeOrder } from "@/app/lib/order-actions";

interface CheckoutClientProps {
  defaultName: string;
  defaultEmail: string;
  defaultAddress: string;
}

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutClient({
  defaultName,
  defaultEmail,
  defaultAddress,
}: CheckoutClientProps) {
  const { state, totalPrice, dispatch } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    name: defaultName,
    email: defaultEmail,
    address: defaultAddress,
    city: "",
    country: "",
    zip: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => computeTotals(totalPrice), [totalPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);
    try {
      const result = await placeOrder({
        items: state.items.map((i) => ({ id: i.id, qty: i.qty })),
        shipping,
        card: { number: card.number, expiry: card.expiry, cvc: card.cvc },
      });
      if (result.ok) {
        dispatch({ type: "CLEAR_CART" });
        router.push(`/checkout/success?order=${result.orderId}`);
      } else {
        setError(result.error);
        setProcessing(false);
      }
    } catch {
      setError("Something went wrong while processing your order. Please try again.");
      setProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full glass-light border border-nayo-gold/15 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-nayo-gold/40" />
          </div>
          <h1 className="text-display text-3xl font-bold text-nayo-white mb-3">
            Your cart is empty
          </h1>
          <p className="text-nayo-white/50 mb-8">
            Add something beautiful before heading to checkout.
          </p>
          <Link
            href="/fashion"
            className="btn-gold inline-flex px-8 py-3.5 text-sm tracking-widest uppercase font-bold"
          >
            Explore the Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow pt-32 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-display text-4xl sm:text-5xl font-bold text-nayo-white">
          Secure <span className="gold-text italic">Checkout</span>
        </h1>
        <p className="text-nayo-white/50 mt-3 flex items-center gap-2 text-sm">
          <Lock size={14} className="text-nayo-gold" />
          Your payment details are encrypted and never stored.
        </p>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start"
      >
        {/* Left: forms */}
        <div className="space-y-10">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Shipping */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full glass-light border border-nayo-gold/20 flex items-center justify-center text-nayo-gold">
                <Truck size={16} />
              </div>
              <h2 className="text-display text-xl font-bold text-nayo-white">
                Shipping Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" full>
                <input
                  required
                  className="auth-input"
                  value={shipping.name}
                  onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                  placeholder="Ada Okoye"
                />
              </FormField>
              <FormField label="Email" full>
                <input
                  required
                  type="email"
                  className="auth-input"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </FormField>
              <FormField label="Street Address" full>
                <input
                  required
                  className="auth-input"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="14 Victoria Island Blvd"
                />
              </FormField>
              <FormField label="City">
                <input
                  required
                  className="auth-input"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  placeholder="Lagos"
                />
              </FormField>
              <FormField label="ZIP / Postal Code">
                <input
                  required
                  className="auth-input"
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                  placeholder="101241"
                />
              </FormField>
              <FormField label="Country" full>
                <input
                  required
                  className="auth-input"
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  placeholder="Nigeria"
                />
              </FormField>
            </div>
          </section>

          {/* Payment */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full glass-light border border-nayo-gold/20 flex items-center justify-center text-nayo-gold">
                <CreditCard size={16} />
              </div>
              <h2 className="text-display text-xl font-bold text-nayo-white">
                Payment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Name on Card" full>
                <input
                  required
                  className="auth-input"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  placeholder="Ada Okoye"
                />
              </FormField>
              <FormField label="Card Number" full>
                <div className="relative">
                  <input
                    required
                    inputMode="numeric"
                    className="auth-input pr-11"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: formatCardNumber(e.target.value) })
                    }
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nayo-gold/50"
                  />
                </div>
              </FormField>
              <FormField label="Expiry (MM/YY)">
                <input
                  required
                  inputMode="numeric"
                  className="auth-input"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({ ...card, expiry: formatExpiry(e.target.value) })
                  }
                  placeholder="12/28"
                />
              </FormField>
              <FormField label="CVC">
                <input
                  required
                  inputMode="numeric"
                  maxLength={4}
                  className="auth-input"
                  value={card.cvc}
                  onChange={(e) =>
                    setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })
                  }
                  placeholder="123"
                />
              </FormField>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-nayo-white/40">
              <ShieldCheck size={14} className="text-nayo-gold/70" />
              Demo gateway — use test card 4242 4242 4242 4242. No real charge is made.
            </p>
          </section>
        </div>

        {/* Right: order summary */}
        <div className="lg:sticky lg:top-28">
          <div className="glass rounded-2xl border border-nayo-gold/15 p-6 space-y-5">
            <h2 className="text-display text-lg font-bold text-nayo-white">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-nayo-gold/15">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gold-gradient text-[10px] font-bold text-nayo-ink flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-nayo-white truncate text-display font-semibold">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-nayo-gold/60 uppercase tracking-widest">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold gold-text text-display whitespace-nowrap">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px divider-gold" />

            <div className="space-y-2.5 text-sm">
              <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
              <Row
                label="Shipping"
                value={totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}
              />
              <Row label="Tax (8%)" value={formatCurrency(totals.tax)} />
            </div>

            <div className="h-px divider-gold" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-nayo-white/60 uppercase tracking-wider">
                Total
              </span>
              <span className="text-2xl font-bold gold-text text-display">
                {formatCurrency(totals.total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn-gold w-full py-4 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock size={15} />
                  Pay {formatCurrency(totals.total)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-nayo-white/50">{label}</span>
      <span className="text-nayo-white/90 font-medium">{value}</span>
    </div>
  );
}
