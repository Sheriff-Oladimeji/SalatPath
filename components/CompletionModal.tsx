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
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card dark:bg-[#1E2A45] rounded-[20px] p-6 w-4/5 items-center border border-border dark:border-[#2D3A59] shadow-md">
          <Text className="text-2xl font-bold text-secondary mb-4 text-center">
            تَقَبَّلَ اللهُ صَلاتَكَ
          </Text>

          <Text className="text-base text-text dark:text-white text-center mb-6">
            May Allah accept your prayer
          </Text>

          <TouchableOpacity 
            onPress={onClose} 
            className="bg-success py-2.5 px-6 rounded-full"
          >
            <Text className="text-white font-semibold text-base">Alhamdulillah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;
