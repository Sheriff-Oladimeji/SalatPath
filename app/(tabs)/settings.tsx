import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/useThemeStore";

const SettingsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get theme from store
  const { colors, isDarkMode, toggleTheme } = useThemeStore();

  // Initialize theme on component mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      setIsLoading(false);
    };

    initialize();
  }, []);

  // Create styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: colors.text,
      marginBottom: 16,
    },
    sectionContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    loadingText: {
      textAlign: "center",
      color: colors.gray,
    },
    themeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    themeIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeIcon: {
      marginRight: 12,
    },
    themeText: {
      fontSize: 16,
      color: colors.text,
    },
    aboutText: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    versionText: {
      fontSize: 14,
      color: colors.gray,
      fontStyle: "italic",
    },
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        {/* Theme Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.themeRow}>
            <View style={styles.themeIconContainer}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={24}
                color={isDarkMode ? colors.gray : "#FFB800"}
                style={styles.themeIcon}
              />
              <Text style={styles.themeText}>
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>

          <Text style={styles.aboutText}>
            SalahTrack helps you track your five daily prayers and receive
            timely notifications.
          </Text>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
