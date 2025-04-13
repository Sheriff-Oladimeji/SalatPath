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
import "react-native-reanimated";
import "../global.css";
import * as Notifications from "expo-notifications";

// Import Zustand stores
import { usePrayerStore } from "../src/store/usePrayerStore";
import { useNotificationStore } from "../src/store/useNotificationStore";
import { useThemeStore } from "../src/store/useThemeStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  // Get system color scheme
  const colorScheme = Appearance.getColorScheme();

  // Access stores to initialize them
  const initializeNotifications = useNotificationStore(
    (state) => state.initializeNotifications
  );
  const prayerStore = usePrayerStore();
  const { isDarkMode, setThemeMode } = useThemeStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Hide splash screen
      SplashScreen.hideAsync();

      // Initialize notifications
      initializeNotifications();

      // Initialize theme based on system preference
      setThemeMode("system");

      // Listen for theme changes
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
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
