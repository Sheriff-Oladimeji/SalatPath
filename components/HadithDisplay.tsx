import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Hadith } from "../src/types";
import { useThemeStore } from "../src/store/useThemeStore";

interface HadithDisplayProps {
  hadith: Hadith | null;
}

const HadithDisplay: React.FC<HadithDisplayProps> = ({ hadith }) => {
  const { colors } = useThemeStore();

  if (!hadith) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    text: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      fontStyle: "italic",
      marginBottom: 12,
      lineHeight: 24,
    },
    source: {
      fontSize: 14,
      color: colors.gray,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>"{hadith.text}"</Text>

      <Text style={styles.source}>Source: {hadith.source}</Text>
    </View>
  );
};

export default HadithDisplay;
