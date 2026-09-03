"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateProfile, type ProfileFormState } from "@/app/lib/auth-actions";
import { useAuth } from "@/app/context/AuthContext";

interface SettingsFormProps {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initial: ProfileFormState = {};

export default function SettingsForm({ name, email, phone, address }: SettingsFormProps) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const { refresh } = useAuth();

  useEffect(() => {
    if (state.ok) refresh();
  }, [state.ok, refresh]);

  return (
    <form
      action={action}
      className="glass rounded-2xl border border-nayo-gold/15 p-6 sm:p-8 space-y-6 max-w-2xl"
    >
      {state.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          <CheckCircle2 size={16} />
          Your profile has been updated.
        </div>
      )}
      {state.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
            Full Name
          </label>
          <input name="name" defaultValue={name} className="auth-input" required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
            Email
          </label>
          <input
            value={email}
            disabled
            className="auth-input opacity-60 cursor-not-allowed"
          />
          <p className="text-[11px] text-nayo-white/30">Email cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={phone}
            className="auth-input"
            placeholder="+234 800 123 4567"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
            Address
          </label>
          <input
            name="address"
            defaultValue={address}
            className="auth-input"
            placeholder="14 Victoria Island Blvd, Lagos"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-gold px-8 py-3.5 text-sm tracking-widest uppercase font-bold flex items-center gap-2 disabled:opacity-60"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        Save Changes
      </button>
    </form>
  );
}
