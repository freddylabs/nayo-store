"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Truck, Send } from "lucide-react";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay },
});

export default function ContactPage() {
  return (
    <main className="relative bg-nayo-white min-h-screen">
      <Navbar />

      <div className="pt-[5.75rem] sm:pt-[6.5rem]">
        <section className="relative bg-nayo-green overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />
          <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
            <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
              Nayo Ltd.
            </p>
            <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mt-3">
              We would love to hear from you.
            </h1>
            <p className="mt-5 text-white/80 max-w-xl text-sm sm:text-base leading-relaxed">
              Questions about an order, a meal, apparel, or uniforms — send us
              a note and we will get back to you.
            </p>
          </div>
        </section>

        <div className="bg-[#F7F4EE] border-y border-nayo-green/10">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-nayo-gold text-[10px] tracking-[0.22em] uppercase font-semibold">
                Phone
              </p>
              <a
                href="tel:+12403083183"
                className="text-display text-2xl font-bold text-nayo-black mt-2 block hover:text-nayo-green"
              >
                +1 (240) 308-3183
              </a>
            </div>
            <div>
              <p className="text-nayo-gold text-[10px] tracking-[0.22em] uppercase font-semibold">
                Working hours
              </p>
              <p className="text-display text-2xl font-bold text-nayo-black mt-2">
                Mon, Fri &amp; Sat
              </p>
              <p className="text-sm text-nayo-black/55 mt-1">9:00 AM – 9:00 PM</p>
            </div>
            <div>
              <p className="text-nayo-gold text-[10px] tracking-[0.22em] uppercase font-semibold">
                How we fulfill
              </p>
              <p className="text-display text-2xl font-bold text-nayo-black mt-2">
                Pickup &amp; delivery
              </p>
              <p className="text-sm text-nayo-black/55 mt-1">
                During working hours only
              </p>
            </div>
          </div>
        </div>

        <section className="max-w-[1400px] mx-auto section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <motion.div {...fadeUp(0.05)} className="lg:col-span-5 space-y-8">
              <div>
                <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                  Get in touch
                </p>
                <h2 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black mt-3">
                  Reach the Nayo team
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-nayo-green/10 border border-nayo-green/20 flex items-center justify-center text-nayo-green shrink-0">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-nayo-gold">
                      Call us
                    </p>
                    <a
                      href="tel:+12403083183"
                      className="text-nayo-black font-medium mt-1 block"
                    >
                      +1 (240) 308-3183
                    </a>
                    <p className="text-sm text-nayo-black/50 mt-1">
                      Mondays, Fridays, and Saturdays, 9:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-nayo-green/10 border border-nayo-green/20 flex items-center justify-center text-nayo-green shrink-0">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-nayo-gold">
                      Email us
                    </p>
                    <a
                      href="mailto:hello@nayo.store"
                      className="text-nayo-black font-medium mt-1 block"
                    >
                      hello@nayo.store
                    </a>
                    <p className="text-sm text-nayo-black/50 mt-1">
                      We aim to reply within one working day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-nayo-green/10 border border-nayo-green/20 flex items-center justify-center text-nayo-green shrink-0">
                    <Clock size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-nayo-gold">
                      Working hours and days
                    </p>
                    <p className="text-nayo-black font-medium mt-1">
                      Mondays, Fridays, and Saturdays
                    </p>
                    <p className="text-sm text-nayo-black/50 mt-1">
                      9:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-nayo-green/10 border border-nayo-green/20 flex items-center justify-center text-nayo-green shrink-0">
                    <Truck size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-nayo-gold">
                      Pickup and delivery
                    </p>
                    <p className="text-nayo-black font-medium mt-1">
                      Pickup and delivery only
                    </p>
                    <p className="text-sm text-nayo-black/50 mt-1">
                      We are happy to prepare your order for collection, or to
                      bring it to you during working hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              {...fadeUp(0.12)}
              className="lg:col-span-7 rounded-2xl border border-nayo-gold/25 bg-nayo-white p-6 sm:p-10 space-y-5"
            >
              <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
                Send a message
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-[10px] uppercase tracking-widest text-nayo-black/60 font-semibold"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm text-nayo-black placeholder:text-nayo-black/30 focus:outline-none focus:border-nayo-gold"
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-[10px] uppercase tracking-widest text-nayo-black/60 font-semibold"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm text-nayo-black placeholder:text-nayo-black/30 focus:outline-none focus:border-nayo-gold"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-widest text-nayo-black/60 font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm text-nayo-black placeholder:text-nayo-black/30 focus:outline-none focus:border-nayo-gold"
                  placeholder="you@email.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="inquiry"
                  className="text-[10px] uppercase tracking-widest text-nayo-black/60 font-semibold"
                >
                  Subject
                </label>
                <select
                  id="inquiry"
                  className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm text-nayo-black focus:outline-none focus:border-nayo-gold"
                >
                  <option value="general">General inquiry</option>
                  <option value="order">An order</option>
                  <option value="apparel">NAYO Apparel</option>
                  <option value="foods">NAYO Foods</option>
                  <option value="health">NAYO Health</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-[10px] uppercase tracking-widest text-nayo-black/60 font-semibold"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm text-nayo-black placeholder:text-nayo-black/30 focus:outline-none focus:border-nayo-gold resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="button"
                className="btn-gold w-full py-3.5 flex justify-center items-center gap-2 tracking-[0.2em] uppercase font-bold text-xs mt-2"
              >
                Send message
                <Send size={16} />
              </button>
            </motion.form>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
