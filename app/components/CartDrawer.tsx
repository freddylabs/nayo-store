"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const router = useRouter();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: "easeOut" as any }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-nayo-white border-l border-nayo-gold/30"
          >
            <div className="flex items-center justify-between px-7 py-6 border-b border-nayo-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-nayo-gold" />
                <h2 className="text-display text-xl font-bold text-nayo-black">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-[11px] font-bold text-nayo-black">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full bg-nayo-white border border-nayo-gold/30 flex items-center justify-center text-nayo-black/50 hover:text-nayo-gold hover:border-nayo-gold/50 transition-all duration-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
              <AnimatePresence initial={false}>
                {state.items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-5 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-nayo-white border border-nayo-gold/25 flex items-center justify-center">
                      <ShoppingCart size={30} className="text-nayo-gold/40" />
                    </div>
                    <div>
                      <p className="text-nayo-black/60 font-medium">Your cart is empty</p>
                      <p className="text-nayo-black/40 text-sm mt-1">
                        Add something beautiful.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch({ type: "CLOSE_CART" });
                        router.push("/fashion");
                      }}
                      className="btn-gold px-6 py-2.5 text-xs tracking-widest uppercase font-bold"
                    >
                      Explore Shop
                    </button>
                  </motion.div>
                ) : (
                  state.items.map((item) => (
                    <motion.div
                      key={item.lineId}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" as any }}
                      className="flex gap-4 rounded-2xl p-4 border border-nayo-gold/20 bg-nayo-white"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F4F6]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-nayo-black leading-tight line-clamp-1">
                              {item.name}
                            </p>
                            {item.note && (
                              <p className="text-[11px] text-nayo-black/50 mt-0.5 leading-snug line-clamp-2">
                                {item.note}
                              </p>
                            )}
                            <p className="text-[10px] text-nayo-black/40 tracking-wider uppercase mt-0.5 font-mono">
                              {item.lineId}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              dispatch({ type: "REMOVE_ITEM", payload: item.lineId })
                            }
                            aria-label={`Remove ${item.name}`}
                            className="text-nayo-black/30 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                dispatch({ type: "DECREMENT", payload: item.lineId })
                              }
                              aria-label="Decrease quantity"
                              className="w-7 h-7 rounded-full border border-nayo-gold/35 flex items-center justify-center text-nayo-black/60 hover:border-nayo-gold hover:text-nayo-gold transition-all duration-200"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-bold text-nayo-black w-5 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                dispatch({ type: "INCREMENT", payload: item.lineId })
                              }
                              aria-label="Increase quantity"
                              className="w-7 h-7 rounded-full border border-nayo-gold/35 flex items-center justify-center text-nayo-black/60 hover:border-nayo-gold hover:text-nayo-gold transition-all duration-200"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
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

            {state.items.length > 0 && (
              <div className="px-7 py-6 border-t border-nayo-gold/20 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nayo-black/50 tracking-wider uppercase">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-display gold-text">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    dispatch({ type: "CLOSE_CART" });
                    router.push("/checkout");
                  }}
                  className="btn-gold w-full py-4 text-sm tracking-widest uppercase font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Proceed to Checkout
                </button>

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
