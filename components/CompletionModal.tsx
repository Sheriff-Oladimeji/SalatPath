import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../src/store/useThemeStore";

interface CompletionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useThemeStore();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    arabicText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 16,
      textAlign: "center",
    },
    translationText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginBottom: 24,
    },
    button: {
      backgroundColor: colors.success,
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 30,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 16,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.arabicText}>تَقَبَّلَ اللهُ صَلاتَكَ</Text>

          <Text style={styles.translationText}>
            May Allah accept your prayer
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Alhamdulillah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;
