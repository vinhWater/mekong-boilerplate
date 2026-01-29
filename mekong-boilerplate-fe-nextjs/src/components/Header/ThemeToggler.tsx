"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center"
        disabled
        aria-label="Loading theme"
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </button>
    );
  }

  const isDark = theme === "dark";
  
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center text-dark hover:text-primary dark:text-white dark:hover:text-primary transition-colors duration-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon for light mode */}
      <Sun
        className={`absolute h-4 w-4 text-primary transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      {/* Moon icon for dark mode */}
      <Moon
        className={`absolute h-4 w-4 text-white transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggler;
