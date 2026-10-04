"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";

const field =
  "w-full rounded-xl border border-nayo-black/15 bg-white px-4 py-3 text-sm text-nayo-black placeholder:text-nayo-black/30 outline-none focus:border-nayo-gold focus:ring-4 focus:ring-nayo-gold/15";

export default function AccountSignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<"pin" | "link">("pin");
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, pin }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      setPin("");
      return;
    }
    router.refresh();
  };

  const sendLink = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const res = await fetch("/api/account/pin-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not send the link.");
      return;
    }
    setMessage(data.message || "Check your email for a link.");
  };

  return (
    <div className="rounded-3xl border border-nayo-gold/25 bg-[#FBF9F4] p-6 sm:p-9 shadow-[0_30px_80px_-40px_rgba(26,65,46,0.5)]">
      {mode === "pin" ? (
        <form onSubmit={signIn} className="space-y-5">
          <div>
            <p className="text-nayo-gold text-[11px] tracking-[0.3em] uppercase font-semibold">
              My orders
            </p>
            <h1 className="text-display text-3xl font-bold text-nayo-black mt-2">Welcome back</h1>
            <p className="mt-1.5 text-sm text-nayo-black/55">
              Sign in to follow orders in progress and see past orders.
            </p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
              Email or customer ID
            </span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or NY-XXXXXX"
              autoComplete="username"
              required
              className={field}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
              4-digit PIN
            </span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              autoComplete="current-password"
              type="password"
              placeholder="••••"
              required
              className={`${field} tracking-[0.6em] text-lg`}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy || pin.length !== 4 || !identifier.trim()}
            className="btn-gold w-full py-3.5 text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <KeyRound size={15} /> {busy ? "Signing in…" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("link");
              setError("");
            }}
            className="w-full text-center text-sm font-semibold text-nayo-green hover:text-nayo-gold"
          >
            First time, or forgot your PIN? Email me a link
          </button>
        </form>
      ) : (
        <form onSubmit={sendLink} className="space-y-5">
          <div>
            <p className="text-nayo-gold text-[11px] tracking-[0.3em] uppercase font-semibold">
              Set or reset your PIN
            </p>
            <h1 className="text-display text-3xl font-bold text-nayo-black mt-2">
              We will email you a link
            </h1>
            <p className="mt-1.5 text-sm text-nayo-black/55">
              Enter the email you ordered with, or your customer ID from your receipt.
            </p>
          </div>

          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or NY-XXXXXX"
            autoComplete="username"
            required
            className={field}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && (
            <p className="rounded-xl bg-nayo-green/10 px-4 py-3 text-sm text-nayo-green">{message}</p>
          )}

          <button
            type="submit"
            disabled={busy || !identifier.trim()}
            className="btn-gold w-full py-3.5 text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Mail size={15} /> {busy ? "Sending…" : "Email me a link"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("pin");
              setError("");
              setMessage("");
            }}
            className="w-full text-center text-sm font-semibold text-nayo-green hover:text-nayo-gold"
          >
            I have my PIN, sign in
          </button>
        </form>
      )}
    </div>
  );
}
