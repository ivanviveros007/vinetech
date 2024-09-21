import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { Colors } from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

type WineForm = {
  name: string;
  harvestYear: Date;
  description: string;
};

type Wine = WineForm & { id: string; imageUri: string };

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [wines, setWines] = useState<Wine[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WineForm>();

  useEffect(() => {
    fetchWines();
  }, []);

  const fetchWines = async () => {
    try {
      const snapshot = await firestore().collection("wines").get();
      const fetchedWines = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Wine)
      );
      setWines(fetchedWines);
    } catch (error) {
      console.error("Error fetching wines:", error);
      Alert.alert("Error", "Failed to fetch wines");
    }
  };

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setValue("harvestYear", date);
    hideDatePicker();
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const ref = storage().ref(`images/${filename}`);
    await ref.put(blob);
    return await ref.getDownloadURL();
  };

  const onSubmit = async (data: WineForm) => {
    if (!image) {
      Alert.alert("Error", "Please select an image for the wine.");
      return;
    }
    try {
      const imageUrl = await uploadImage(image);
      const newWine: Omit<Wine, "id"> = {
        imageUri: imageUrl,
        ...data,
        harvestYear: firestore.Timestamp.fromDate(data.harvestYear),
      };
      await firestore().collection("wines").add(newWine);
      await fetchWines(); // Refresh the wine list
      reset();
      setImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error uploading wine:", error);
      Alert.alert("Error", "Failed to upload wine");
    }
  };

  const renderWineItem = ({ item }: { item: Wine }) => (
    <View style={styles.wineItem}>
      <Image source={{ uri: item.imageUri }} style={styles.wineImage} />
      <View style={styles.wineInfo}>
        <Text style={styles.wineName}>{item.name}</Text>
        <Text style={styles.wineYear}>
          {item.harvestYear.toDate().getFullYear()}
        </Text>
        <Text style={styles.wineDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wine Collection</Text>
      <FlatList
        data={wines}
        renderItem={renderWineItem}
        keyExtractor={(item) => item.id}
        style={styles.wineList}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Wine</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
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

                  <Text style={styles.label}>Harvest Year</Text>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    style={styles.input}
                  >
                    <Text>
                      {control._formValues.harvestYear
                        ? control._formValues.harvestYear.getFullYear()
                        : "Select Year"}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
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

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <Text style={styles.submitButtonText}>Upload Wine</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.marshland[950],
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.marshland[50],
    marginBottom: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 30,
  },
  addButtonText: {
    color: Colors.marshland[50],
    fontWeight: "bold",
  },
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
  input: {
    backgroundColor: Colors.marshland[100],
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: Colors.marshland[900],
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.marshland[100],
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  wineList: {
    flex: 1,
  },
  wineItem: {
    flexDirection: "row",
    backgroundColor: Colors.marshland[900],
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  wineImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  wineInfo: {
    flex: 1,
    marginLeft: 10,
  },
  wineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.marshland[50],
  },
  wineYear: {
    fontSize: 14,
    color: Colors.marshland[200],
  },
  wineDescription: {
    fontSize: 14,
    color: Colors.marshland[100],
  },
});
