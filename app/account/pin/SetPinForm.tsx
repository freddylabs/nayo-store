"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

const field =
  "w-full rounded-xl border border-nayo-black/15 bg-white px-4 py-3 text-lg tracking-[0.6em] text-nayo-black placeholder:text-nayo-black/30 outline-none focus:border-nayo-gold focus:ring-4 focus:ring-nayo-gold/15";

export default function SetPinForm({ token }: { token: string }) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (pin !== confirm) {
      setError("The two PINs do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/account/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, pin }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not save your PIN.");
      setBusy(false);
      return;
    }
    router.replace("/account");
    router.refresh();
  };

  const digits = (value: string) => value.replace(/\D/g, "").slice(0, 4);

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
          New 4-digit PIN
        </span>
        <input
          value={pin}
          onChange={(e) => setPin(digits(e.target.value))}
          inputMode="numeric"
          type="password"
          autoComplete="new-password"
          placeholder="••••"
          required
          className={field}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
          Type it again
        </span>
        <input
          value={confirm}
          onChange={(e) => setConfirm(digits(e.target.value))}
          inputMode="numeric"
          type="password"
          autoComplete="new-password"
          placeholder="••••"
          required
          className={field}
        />
      </label>
      <p className="text-xs text-nayo-black/45">
        Avoid easy PINs like 1234 or 1111. Keep it to yourself, it opens your order history.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy || pin.length !== 4 || confirm.length !== 4}
        className="btn-gold w-full py-3.5 text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <KeyRound size={15} /> {busy ? "Saving…" : "Save my PIN"}
      </button>
    </form>
  );
}
