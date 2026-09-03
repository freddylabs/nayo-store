"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="bg-nayo-onyx relative overflow-hidden">
      {/* Ambient gold glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-20 sm:py-24 relative text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eyebrow text-nayo-gold-bright mb-4"
        >
          Join the House of Nayo
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-display text-4xl sm:text-5xl font-bold text-nayo-cream leading-tight mb-4"
        >
          Style & flavour, <span className="italic gold-text">first.</span>
        </motion.h2>
        <p className="text-nayo-cream/50 max-w-md mx-auto mb-10 leading-relaxed">
          Subscribe for early access to new collections, seasonal menus, and members-only offers.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-nayo-green/40 border border-nayo-gold/30 text-nayo-cream">
            <Check size={18} className="text-nayo-gold-bright" />
            You&apos;re on the list — welcome to Nayo.
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-nayo-cream/5 border border-nayo-cream/20 rounded-full px-6 py-3.5 text-sm text-nayo-cream placeholder:text-nayo-cream/40 focus:outline-none focus:border-nayo-gold/60 transition-colors"
            />
            <button
              type="submit"
              className="btn-gold px-7 py-3.5 text-xs tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2 shrink-0"
            >
              Subscribe
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
