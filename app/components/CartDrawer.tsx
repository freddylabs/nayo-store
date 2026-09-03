"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    dispatch({ type: "CLOSE_CART" });
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" as any }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #F7F4EE 100%)",
              borderLeft: "1px solid rgba(199,154,46,0.25)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-6 border-b border-nayo-gold/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-nayo-gold" />
                <h2 className="text-display text-xl font-bold text-nayo-white">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-[11px] font-bold text-nayo-ink">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full glass-light border border-nayo-gold/20 flex items-center justify-center text-nayo-white/50 hover:text-nayo-gold hover:border-nayo-gold/50 transition-all duration-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
              <AnimatePresence initial={false}>
                {state.items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-5 text-center"
                  >
                    <div className="w-20 h-20 rounded-full glass-light border border-nayo-gold/15 flex items-center justify-center">
                      <ShoppingBag size={30} className="text-nayo-gold/40" />
                    </div>
                    <div>
                      <p className="text-nayo-white/60 font-medium">Your cart is empty</p>
                      <p className="text-nayo-white/30 text-sm mt-1">
                        Add something beautiful.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch({ type: "CLOSE_CART" });
                        document
                          .querySelector("#fashion")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="btn-gold px-6 py-2.5 text-xs tracking-widest uppercase font-bold"
                    >
                      Explore Shop
                    </button>
                  </motion.div>
                ) : (
                  state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" as any }}
                      className="flex gap-4 rounded-2xl p-4 border border-nayo-gold/10 bg-nayo-ink/[0.02]"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-nayo-gold/15">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-display text-nayo-white leading-tight line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-nayo-gold/60 tracking-widest uppercase mt-0.5">
                              {item.category}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              dispatch({ type: "REMOVE_ITEM", payload: item.id })
                            }
                            aria-label={`Remove ${item.name}`}
                            className="text-nayo-white/25 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                dispatch({ type: "DECREMENT", payload: item.id })
                              }
                              aria-label="Decrease quantity"
                              className="w-7 h-7 rounded-full border border-nayo-gold/25 flex items-center justify-center text-nayo-white/60 hover:border-nayo-gold hover:text-nayo-gold transition-all duration-200"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-bold text-nayo-white w-5 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                dispatch({ type: "INCREMENT", payload: item.id })
                              }
                              aria-label="Increase quantity"
                              className="w-7 h-7 rounded-full border border-nayo-gold/25 flex items-center justify-center text-nayo-white/60 hover:border-nayo-gold hover:text-nayo-gold transition-all duration-200"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          {/* Line price */}
                          <span className="text-sm font-bold text-display gold-text">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-7 py-6 border-t border-nayo-gold/10 space-y-5">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nayo-white/50 tracking-wider uppercase">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-display gold-text">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Shipping note */}
                <p className="text-xs text-nayo-white/30 text-center">
                  Shipping & taxes calculated at checkout.
                </p>

                {/* Checkout btn */}
                <button
                  onClick={handleCheckout}
                  className="btn-gold w-full py-4 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>

                {/* Continue shopping */}
                <button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="btn-outline w-full py-3 text-xs tracking-widest uppercase font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
