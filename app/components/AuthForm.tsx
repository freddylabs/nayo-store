"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, User, AlertCircle } from "lucide-react";
import { login, signup, type AuthFormState } from "@/app/lib/auth-actions";
import { useAuth } from "@/app/context/AuthContext";

interface AuthFormProps {
  mode: "login" | "signup";
  next?: string;
}

const initialState: AuthFormState = {};

export default function AuthForm({ mode, next }: AuthFormProps) {
  const isLogin = mode === "login";
  const action = isLogin ? login : signup;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { refresh } = useAuth();

  // The server action sets the session cookie then redirects; make sure the
  // client auth context reflects the new session as soon as we land.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-nayo-black">
      {/* Ambient gold glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.07]"
        style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.9) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-2">
          <div className="relative w-28 h-28">
            <Image
              src="/nayo-logo-transparent.png"
              alt="Nayo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-white">
            {isLogin ? (
              <>
                Welcome <span className="gold-text italic">Back</span>
              </>
            ) : (
              <>
                Join <span className="gold-text italic">Nayo</span>
              </>
            )}
          </h1>
          <p className="text-nayo-white/50 text-sm mt-3">
            {isLogin
              ? "Sign in to access your orders and account."
              : "Create an account to shop and track your orders."}
          </p>
        </div>

        <form
          action={formAction}
          className="glass p-6 sm:p-8 rounded-2xl border border-nayo-gold/15 space-y-5"
        >
          <input type="hidden" name="next" value={next ?? "/dashboard"} />

          {state.errors?.form && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} className="flex-shrink-0" />
              {state.errors.form}
            </div>
          )}

          {!isLogin && (
            <Field
              icon={<User size={16} />}
              label="Full Name"
              error={state.errors?.name}
            >
              <input
                type="text"
                name="name"
                autoComplete="name"
                defaultValue={state.values?.name}
                placeholder="Ada Okoye"
                className="auth-input"
              />
            </Field>
          )}

          <Field icon={<Mail size={16} />} label="Email Address" error={state.errors?.email}>
            <input
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={state.values?.email}
              placeholder="you@example.com"
              className="auth-input"
            />
          </Field>

          <Field icon={<Lock size={16} />} label="Password" error={state.errors?.password}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={isLogin ? "••••••••" : "At least 8 characters"}
                className="auth-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nayo-white/40 hover:text-nayo-gold transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={pending}
            className="btn-gold w-full py-3.5 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          {isLogin && (
            <p className="text-center text-[11px] text-nayo-white/40 leading-relaxed">
              Demo account:{" "}
              <span className="text-nayo-gold/80">demo@nayo.store</span> /{" "}
              <span className="text-nayo-gold/80">password123</span>
            </p>
          )}
        </form>

        <p className="text-center text-sm text-nayo-white/50 mt-6">
          {isLogin ? "New to Nayo?" : "Already have an account?"}{" "}
          <Link
            href={
              isLogin
                ? `/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`
                : `/login${next ? `?next=${encodeURIComponent(next)}` : ""}`
            }
            className="text-nayo-gold hover:text-nayo-amber font-semibold transition-colors"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

function Field({
  icon,
  label,
  error,
  children,
}: {
  icon: ReactNode;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">
        <span className="text-nayo-gold/70">{icon}</span>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
