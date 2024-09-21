import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { useForm, Controller } from "react-hook-form";
import { Colors } from "../constants/Colors";
import { useWineStore } from "../hooks/useWineStore";

interface WineUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

interface WineData {
  name: string;
  description: string;
  imageUrl: string; // Add this line
}

export default function WineUploadModal({
  visible,
  onClose,
}: WineUploadModalProps) {
  const { control, handleSubmit } = useForm();
  const addWine = useWineStore((state) => state.addWine);

  const onSubmit = async (data: WineData) => {
    await addWine(data);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={100} style={styles.blurContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Wine</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Wine Name"
              />
            )}
            name="name"
            rules={{ required: true }}
            defaultValue=""
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Description"
                multiline
              />
            )}
            name="description"
            rules={{ required: true }}
            defaultValue=""
          />
          {/* Add image picker here */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>Add Wine</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.marshland[800],
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.marshland[50],
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.marshland[700],
    color: Colors.marshland[50],
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.marshland[50],
    fontWeight: "bold",
  },
});
