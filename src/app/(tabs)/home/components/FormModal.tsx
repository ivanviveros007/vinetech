import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { WineForm } from "../types";

type FormModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: (data: WineForm, image: string | null) => void;
  isLoading: boolean;
};

export const FormModal = ({
  modalVisible,
  setModalVisible,
  onSubmit,
  isLoading,
}: FormModalProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [rating, setRating] = useState(0);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WineForm>();

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    setValue("harvestYear", date);
    hideDatePicker();
  };

  const submitForm = (data: WineForm) => {
    if (!image) {
      Alert.alert("Error", "Please select an image for the wine.");
      return;
    }
    onSubmit({ ...data, rating }, image);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Reset form state here if needed
  };

  const handleRating = (selectedRating: number) => {
    if (rating === selectedRating) {
      // If tapping the same star, toggle between whole and half star
      setRating(selectedRating - 0.5);
    } else {
      setRating(selectedRating);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isHalfStar = rating === starValue - 0.5;
    const isFullStar = rating >= starValue;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleRating(starValue)}
        style={styles.starContainer}
      >
        <Ionicons
          name={isFullStar ? "star" : "star-outline"}
          size={30}
          color={Colors.marshland[500]}
        />
        {isHalfStar && (
          <Ionicons
            name="star-half"
            size={30}
            color={Colors.marshland[500]}
            style={styles.halfStar}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Ionicons name="close" size={24} color={Colors.marshland[100]} />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!image ? (
              <View style={styles.bottomSheet}>
                <TouchableOpacity style={styles.option} onPress={takePicture}>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={Colors.marshland[900]}
                  />
                  <Text style={styles.optionText}>Take a Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={pickImage}>
                  <Ionicons
                    name="image-outline"
                    size={24}
                    color={Colors.marshland[900]}
                  />
                  <Text style={styles.optionText}>Select from Gallery</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <Image source={{ uri: image }} style={styles.image} />

                <Text style={styles.label}>Wine Name</Text>
                <Controller
                  control={control}
                  rules={{ required: "Wine name is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter wine name"
                    />
                  )}
                  name="name"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}

                <Text style={styles.label}>Store Name</Text>
                <Controller
                  control={control}
                  rules={{ required: "Store name is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter store name"
                    />
                  )}
                  name="storeName"
                />
                {errors.storeName && (
                  <Text style={styles.errorText}>
                    {errors.storeName.message}
                  </Text>
                )}

                <Text style={styles.label}>Harvest Year</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                  <Text>
                    {control._formValues.harvestYear || "Select Year"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  display="spinner"
                  maximumDate={new Date()}
                />

                <Text style={styles.label}>Description</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter wine description"
                      multiline
                    />
                  )}
                  name="description"
                />

                <Text style={styles.label}>Rating</Text>
                <View style={styles.ratingContainer}>
                  {[0, 1, 2, 3, 4].map(renderStar)}
                </View>
                <Text style={styles.ratingText}>{rating.toFixed(1)}/5</Text>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit(submitForm)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.marshland[50]}
                      style={styles.loadingIndicator}
                    />
                  ) : null}
                  <Text style={styles.submitButtonText}>
                    {isLoading ? "Uploading..." : "Upload Wine"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: Colors.marshland[950],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 35,
    maxHeight: "80%",
  },
  bottomSheet: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    backgroundColor: Colors.marshland[100],
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.marshland[900],
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.marshland[100],
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.marshland[100],
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: Colors.marshland[900],
  },
  submitButton: {
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: Colors.marshland[50],
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginRight: 10,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  ratingText: {
    textAlign: "center",
    color: Colors.marshland[100],
    fontSize: 16,
    marginBottom: 15,
  },

  starContainer: {
    position: "relative",
    padding: 5,
  },
  halfStar: {
    position: "absolute",
    left: 5,
    top: 5,
  },
});
