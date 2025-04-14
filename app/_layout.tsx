import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Appearance } from "react-native";
// Import Reanimated
import "react-native-reanimated";
import "../global.css";
// Import Zustand stores
import { useAlarmStore } from "../src/store/useAlarmStore";
import { useThemeStore } from "../src/store/useThemeStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// No need to configure notifications anymore, using audio alarms instead

export default function RootLayout() {
  // Access stores to initialize them
  const initializeAlarms = useAlarmStore((state) => state.initializeAlarms);
  const { isDarkMode, setThemeMode } = useThemeStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Hide splash screen
      SplashScreen.hideAsync();

      // Initialize alarms
      initializeAlarms();

      // Initialize theme based on system preference
      setThemeMode("system");

      // Listen for theme changes
      const subscription = Appearance.addChangeListener(() => {
        if (useThemeStore.getState().themeMode === "system") {
          setThemeMode("system");
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Create custom themes with our colors
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#FFFFFF",
      card: "#F5F7FA",
      text: "#121826",
      border: "#E1E5EB",
      primary: "#10b981",
      notification: "#FF6B6B",
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#121826",
      card: "#1E2A45",
      text: "#FFFFFF",
      border: "#2D3A59",
      primary: "#10b981",
      notification: "#FF8A8A",
    },
  };

  return (
    <ThemeProvider value={isDarkMode ? customDarkTheme : customLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </ThemeProvider>
  );
}
