import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import QiblaCompass from "../../components/QiblaCompass";
import { useThemeStore } from "../../src/store/useThemeStore";

const QiblaScreen: React.FC = () => {
  // Get theme colors
  const { colors } = useThemeStore();

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
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Qibla Direction</Text>

        <QiblaCompass />
      </View>
    </SafeAreaView>
  );
};

export default QiblaScreen;
