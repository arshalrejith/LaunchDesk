"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  // Non-httpOnly cookie so server components could read it later if needed,
  // and so the blocking init script has a value even before localStorage
  // hydrates on a fresh tab (rare race, cheap safety net).
  document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const syncTheme = (nextTheme: "dark" | "light") => {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key !== "theme" || (event.newValue !== "dark" && event.newValue !== "light")) return;
      syncTheme(event.newValue);
    };
    const syncFromEvent = (event: Event) => {
      const nextTheme = (event as CustomEvent<string>).detail;
      if (nextTheme === "dark" || nextTheme === "light") syncTheme(nextTheme);
    };
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("themechange", syncFromEvent);

    // Reads the class the pre-hydration ThemeScript already applied, so this
    // never flashes the wrong icon — it only reconciles React state with what
    // is already on the DOM.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("themechange", syncFromEvent);
    };
  }, []);

  if (theme === null) {
    // Avoid a hydration mismatch / layout jump — reserve the space silently.
    return <span className={`inline-block h-8 w-8 ${className}`} aria-hidden />;
  }

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`btn btn-ghost h-8 w-8 !p-0 rounded-full ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          size={16}
          strokeWidth={2}
          className={`absolute transition-all duration-300 ${
            theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          size={16}
          strokeWidth={2}
          className={`absolute transition-all duration-300 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
