"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    // Only handle system theme changes (initial and runtime)
    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            // Apply system theme immediately
            const applySystemTheme = (matches: boolean) => {
                const root = document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(matches ? "dark" : "light");
                console.log("💻 System theme applied:", matches ? "dark" : "light");
            };

            // Apply initial system theme
            applySystemTheme(mediaQuery.matches);

            // Listen for system theme changes
            const listener = (e: MediaQueryListEvent) => {
                applySystemTheme(e.matches);
            };

            mediaQuery.addEventListener("change", listener);
            return () => mediaQuery.removeEventListener("change", listener);
        }
        // For "light" or "dark" themes, useTheme hook handles DOM updates immediately
    }, [theme]);

    return <>{children}</>;
}
