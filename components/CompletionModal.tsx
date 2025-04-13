import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface CompletionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-4/5 items-center shadow-lg">
          <Text className="text-xl font-bold text-green-600 mb-4">
            تَقَبَّلَ اللهُ صَلاتَكَ
          </Text>
          
          <Text className="text-base text-gray-700 text-center mb-6">
            May Allah accept your prayer
          </Text>
          
          <TouchableOpacity
            onPress={onClose}
            className="bg-green-500 py-2 px-6 rounded-full"
          >
            <Text className="text-white font-semibold">Alhamdulillah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;
