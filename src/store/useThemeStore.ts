import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  // Theme mode
  themeMode: ThemeMode;

  // Derived actual theme (light or dark)
  isDarkMode: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Colors for the current theme
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    gray: string;
    lightGray: string;
  };
}

// Helper to get colors based on dark mode
const getColors = (isDark: boolean) => ({
  background: isDark ? "#121826" : "#FFFFFF",
  card: isDark ? "#1E2A45" : "#F5F7FA",
  text: isDark ? "#FFFFFF" : "#121826",
  border: isDark ? "#2D3A59" : "#E1E5EB",
  primary: "#10b981", // Green for both themes
  secondary: isDark ? "#FF8A8A" : "#FF6B6B", // Coral color from image
  accent: isDark ? "#3B82F6" : "#2563EB", // Blue
  success: "#10b981", // Green
  error: "#EF4444", // Red
  gray: isDark ? "#9BA1A6" : "#6B7280",
  lightGray: isDark ? "#2D3A59" : "#E1E5EB",
});

// Get initial system color scheme
const initialColorScheme = Appearance.getColorScheme() || "light";
const initialIsDark = initialColorScheme === "dark";

// Create the store with persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      return {
        // Initial state - use system theme by default
        themeMode: "system",

        // Derived state
        isDarkMode: initialIsDark,

        // Initial colors
        colors: getColors(initialIsDark),

        // Set theme mode
        setThemeMode: (mode: ThemeMode) => {
          // Get current system theme
          const systemColorScheme = Appearance.getColorScheme() || "light";
          const systemIsDark = systemColorScheme === "dark";

          // Determine if dark mode based on mode selection
          const isDark = mode === "system" ? systemIsDark : mode === "dark";

          set({
            themeMode: mode,
            isDarkMode: isDark,
            colors: getColors(isDark),
          });
        },

        // Toggle between light and dark
        toggleTheme: () => {
          const { themeMode } = get();
          const newMode: ThemeMode = themeMode === "light" ? "dark" : "light";
          get().setThemeMode(newMode);
        },
      };
    },
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
