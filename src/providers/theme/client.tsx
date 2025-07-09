"use client";

import { THEME_VARIANT } from "../../types/theme";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    theme: THEME_VARIANT;
    setTheme: VoidFunction;
    isDark: boolean;
};

let currentTheme: THEME_VARIANT = "light";
const listeners = new Set<(theme: THEME_VARIANT) => void>();

function toggleGlobalTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    if (typeof window !== "undefined") {
        localStorage.setItem("theme", currentTheme);
    }

    listeners.forEach(listener => listener(currentTheme));
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: currentTheme,
    setTheme: toggleGlobalTheme,
    isDark: false,
});

export function ThemeStateProvider() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as THEME_VARIANT | null;

        if (savedTheme) {
            currentTheme = savedTheme;
        } else if (window.matchMedia("(prefer-color-scheme: dark").matches) {
            currentTheme = "dark";
        }

        if (currentTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = (event: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                currentTheme = event.matches ? "dark" : "light";
                if (currentTheme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
                listeners.forEach(listener => listener(currentTheme));
            }
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, []);

    return null;
}

export function ThemeUIProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<THEME_VARIANT>(currentTheme);

    useEffect(() => {
        const handleThemeChange = (newTheme: THEME_VARIANT) => {
            setTheme(newTheme);
        };

        listeners.add(handleThemeChange);

        setTheme(currentTheme);

        return () => {
            listeners.delete(handleThemeChange);
        };
    }, []);

    const themeContextValue: ThemeContextType = {
        theme,
        setTheme: toggleGlobalTheme,
        isDark: theme === "dark",
    };

    return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}
