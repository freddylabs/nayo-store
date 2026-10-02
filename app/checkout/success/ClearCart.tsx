"use client";

import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";

export default function ClearCart() {
  const { dispatch, ready } = useCart();

  useEffect(() => {
    if (ready) dispatch({ type: "CLEAR_CART" });
  }, [dispatch, ready]);

  return null;
}
