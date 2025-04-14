import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../src/store/useThemeStore";
import { PrayerName } from "../src/types";

interface AlarmModalProps {
  visible: boolean;
  prayerName: PrayerName | null;
  onDismiss: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  prayerName,
  onDismiss,
}) => {
  const { colors } = useThemeStore();

  // Format prayer name for display
  const formatPrayerName = (name: PrayerName | null): string => {
    if (!name) return "";
    const names: Record<PrayerName, string> = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    };
    
    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      width: "80%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 18,
      color: colors.text,
      textAlign: "center",
      marginBottom: 24,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
      flexDirection: "row",
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 16,
      marginLeft: 8,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="alarm" size={40} color="white" />
          </View>

          <Text style={styles.title}>
            {formatPrayerName(prayerName)} Prayer Time
          </Text>

          <Text style={styles.message}>
            It's time for {formatPrayerName(prayerName)} prayer. May Allah accept your prayers.
          </Text>

          <TouchableOpacity onPress={onDismiss} style={styles.button}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlarmModal;
