import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 24,
            width: "80%",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.secondary,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            تَقَبَّلَ اللهُ صَلاتَكَ
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.text,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            May Allah accept your prayer
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: colors.success,
              paddingVertical: 10,
              paddingHorizontal: 24,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
              Alhamdulillah
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;
