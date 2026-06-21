"use client";

import { useAppearance } from "@/hooks/useAppearance";
import { Moon, Sun } from "lucide-react";

const SwitchThemeButton = () => {
  const { updateAppearance, appearance } = useAppearance();

  const isDark = appearance === "dark";

  return (
    <button
      suppressHydrationWarning
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => updateAppearance(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-16 items-center rounded-4xl border border-border bg-muted p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        className={[
          "absolute flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300",
          isDark ? "translate-x-8" : "translate-x-0",
        ].join(" ")}
      >
        {isDark ? (
          <Moon size={14} className="text-foreground" />
        ) : (
          <Sun size={14} className="text-foreground" />
        )}
      </span>

      <Sun
        size={12}
        className={[
          "ml-1.5 transition-opacity duration-200",
          isDark ? "opacity-40" : "opacity-0",
        ].join(" ")}
        aria-hidden
      />
      <Moon
        size={12}
        className={[
          "ml-auto mr-1.5 transition-opacity duration-200",
          isDark ? "opacity-0" : "opacity-40",
        ].join(" ")}
        aria-hidden
      />
    </button>
  );
};

export default SwitchThemeButton;
