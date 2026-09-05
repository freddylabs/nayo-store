"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TYPING_WORDS = ["Taste it", "Wear it", "Love it"];

function clearBootCover() {
  document.documentElement.classList.remove("nayo-loading");
  document.body.style.overflow = "auto";
}

export default function VideoLoader() {
  const [showLoader, setShowLoader] = useState(false);

  // Typing state
  const [phase, setPhase] = useState<"typing" | "logo">("typing");
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const shouldShow =
      document.documentElement.classList.contains("nayo-loading");
    if (shouldShow) {
      setShowLoader(true);
      document.body.style.overflow = "hidden";
    } else {
      clearBootCover();
    }
  }, []);

  useEffect(() => {
    if (!showLoader || phase !== "typing") return;

    if (wordIndex >= TYPING_WORDS.length) return;
    const currentWord = TYPING_WORDS[wordIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 600);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {
          if (wordIndex === TYPING_WORDS.length - 1) {
            setPhase("logo");
          } else {
            setIsDeleting(false);
            setWordIndex((prev) => prev + 1);
          }
        }
      }
    }, isDeleting ? 40 : 100);

    return () => clearTimeout(timer);
  }, [showLoader, text, isDeleting, phase, wordIndex]);

  useEffect(() => {
    if (!showLoader || phase !== "logo") return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [showLoader, phase]);

  const handleDismiss = () => {
    setShowLoader(false);
    sessionStorage.setItem("nayo_loader_seen", "true");
    clearBootCover();
  };

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[110] bg-nayo-white flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {phase === "typing" && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-full w-full absolute inset-0"
              >
                <div className="flex items-center h-16 sm:h-24">
                  <span className="text-display text-4xl sm:text-6xl font-bold text-nayo-gold tracking-wider">
                    {text}
                  </span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-[3px] sm:w-[4px] h-10 sm:h-14 bg-nayo-gold ml-2 sm:ml-4"
                  />
                </div>
              </motion.div>
            )}

            {phase === "logo" && (
              <motion.div
                key="logo"
                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 1.8, opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative w-[min(94vw,780px)] h-[min(90vh,836px)] absolute"
              >
                <Image
                  src="/Nayo_logo_white.jpeg"
                  alt="Nayo Logo Loader"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 94vw, 780px"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
