"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStateContext } from "@/hooks/useStateContext";
import { cn } from "@/lib/utils";

interface ChatTooltipProps {
  text: string;
  delayMs?: number;
  durationMs?: number;
  hideAnimationDurationMs?: number;
  intervalMs?: number | null;
}

export const ChatTooltip = ({
  text,
  delayMs = 2000,
  durationMs = 4000,
  hideAnimationDurationMs = 400,
  intervalMs = null,
}: ChatTooltipProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let intervalTimer: ReturnType<typeof setInterval>;

    const runCycle = () => {
      showTimer = setTimeout(() => setVisible(true), 0);
      hideTimer = setTimeout(() => setVisible(false), durationMs);
    };

    showTimer = setTimeout(() => {
      setVisible(true);

      hideTimer = setTimeout(() => {
        setVisible(false);

        if (intervalMs !== null) {
          intervalTimer = setInterval(() => {
            runCycle();
          }, intervalMs);
        }
      }, durationMs);
    }, delayMs);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(intervalTimer);
    };
  }, [delayMs, durationMs, intervalMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 16, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{
            opacity: 0,
            x: 10,
            scale: 0.9,
            transition: {
              duration: hideAnimationDurationMs / 1000,
              ease: "easeIn",
            },
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div
            className="relative border border-white/15  text-[11px] font-medium rounded-2xl px-3.5 py-2 whitespace-nowrap shadow-xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            />
            <span className={`relative z-10 text-foreground`}>{text}</span>

            <span
              className="absolute right-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 border-r border-t border-white/15 rotate-45 rounded-[1px]"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
