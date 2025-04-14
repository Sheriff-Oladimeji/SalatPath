import React from "react";
import { View, Text } from "react-native";
import { Hadith } from "../src/types";
import { useThemeStore } from "../src/store/useThemeStore";

interface HadithDisplayProps {
  hadith: Hadith | null;
}

const HadithDisplay: React.FC<HadithDisplayProps> = ({ hadith }) => {
  if (!hadith) {
    return null;
  }

  const { colors } = useThemeStore();

  return (
    <View>
      <Text
        style={{ color: colors.text }}
        className="text-base text-center italic mb-3 leading-6"
      >
        "{hadith.text}"
      </Text>

      <Text style={{ color: colors.gray }} className="text-sm text-center">
        Source: {hadith.source}
      </Text>
    </View>
  );
};

export default HadithDisplay;
