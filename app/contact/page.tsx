"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative bg-nayo-black min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-nayo-white mb-6"
          >
            Contact <span className="gold-text italic">Nayo</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-nayo-white/60 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Whether you have a question about an order, our menu, or just want to connect with our family, we'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full max-w-6xl mx-auto">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-10"
          >
            <div>
              <h3 className="text-display text-2xl font-bold text-nayo-white mb-8">Get in Touch</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-nayo-white/5 border border-nayo-gold/20 rounded-full text-nayo-gold mt-1">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-nayo-white font-medium mb-1 tracking-wide uppercase text-xs">Email Us</h4>
                    <p className="text-nayo-white/70">hello@nayo.com</p>
                    <p className="text-nayo-white/50 text-sm mt-1">We aim to reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-nayo-white/5 border border-nayo-gold/20 rounded-full text-nayo-gold mt-1">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-nayo-white font-medium mb-1 tracking-wide uppercase text-xs">Call Us</h4>
                    <p className="text-nayo-white/70">+1 (555) 123-4567</p>
                    <p className="text-nayo-white/50 text-sm mt-1">Mon - Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-nayo-white/5 border border-nayo-gold/20 rounded-full text-nayo-gold mt-1">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-nayo-white font-medium mb-1 tracking-wide uppercase text-xs">Headquarters</h4>
                    <p className="text-nayo-white/70">128 5th Ave, New York, NY 10011</p>
                    <p className="text-nayo-white/50 text-sm mt-1">Visit our flagship concept store.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form className="glass p-6 sm:p-10 rounded-2xl border border-nayo-white/10 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full bg-nayo-black/50 border border-nayo-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-nayo-white placeholder:text-nayo-white/30 focus:outline-none focus:border-nayo-gold/50 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full bg-nayo-black/50 border border-nayo-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-nayo-white placeholder:text-nayo-white/30 focus:outline-none focus:border-nayo-gold/50 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-nayo-black/50 border border-nayo-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-nayo-white placeholder:text-nayo-white/30 focus:outline-none focus:border-nayo-gold/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="inquiry" className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">Subject</label>
                <select 
                  id="inquiry" 
                  className="w-full bg-nayo-black/50 border border-nayo-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-nayo-white focus:outline-none focus:border-nayo-gold/50 transition-colors appearance-none"
                >
                  <option value="general">General Inquiry</option>
                  <option value="apparel">NAYO Apparel</option>
                  <option value="foods">NAYO Foods & Catering</option>
                  <option value="press">Press & Partnerships</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] sm:text-xs uppercase tracking-widest text-nayo-white/70 font-semibold">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-nayo-black/50 border border-nayo-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-nayo-white placeholder:text-nayo-white/30 focus:outline-none focus:border-nayo-gold/50 transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full btn-gold py-3 sm:py-4 rounded-lg flex justify-center items-center gap-2 tracking-[0.2em] uppercase font-bold text-xs sm:text-sm mt-4"
              >
                Send Message
                <Send size={16} />
              </button>
            </form>
          </motion.div>
          
        </div>
      </div>
      
      <Footer />
      <CartDrawer />
    </main>
  );
}
