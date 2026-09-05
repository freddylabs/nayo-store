"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  ReactNode,
} from "react";
import { createLineId } from "@/app/lib/checkout";

export interface CartItem {
  productId: string;
  lineId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
  note?: string;
  optionsKey?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        productId: string;
        name: string;
        price: number;
        image: string;
        category: string;
        note?: string;
        optionsKey?: string;
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "INCREMENT"; payload: string }
  | { type: "DECREMENT"; payload: string }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

const STORAGE_KEY = "nayo_cart_v3";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };
    case "ADD_ITEM": {
      const optionsKey = action.payload.optionsKey ?? "";
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          (i.optionsKey ?? "") === optionsKey
      );
      return {
        ...state,
        isOpen: true,
        items: existing
          ? state.items.map((i) =>
              i.productId === action.payload.productId &&
              (i.optionsKey ?? "") === optionsKey
                ? { ...i, qty: i.qty + 1 }
                : i
            )
          : [
              ...state.items,
              {
                productId: action.payload.productId,
                lineId: createLineId(action.payload.name),
                name: action.payload.name,
                price: action.payload.price,
                image: action.payload.image,
                category: action.payload.category,
                note: action.payload.note,
                optionsKey: action.payload.optionsKey,
                qty: 1,
              },
            ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.lineId !== action.payload),
      };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.lineId === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.lineId === action.payload ? { ...i, qty: i.qty - 1 } : i
          )
          .filter((i) => i.qty > 0),
      };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "CLEAR_CART":
      return { ...state, items: [], isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items, ready]);

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
