import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";

import { useForm } from "react-hook-form";
import firestore from "@react-native-firebase/firestore";

import auth from "@react-native-firebase/auth";

import { EmptyWineList } from "./components/EmptyWineList";
import { FormModal } from "./components/FormModal";
import { uploadImage } from "@/src/utils/imageUtils";
import { subscribeToWines } from "@/src/utils/firestoreUtils";
import { Wine, WineForm } from "./types";
import { WineItem } from "./components/WineItem";

import { styles } from "./styles";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [wines, setWines] = useState<Wine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { reset } = useForm<WineForm>();

  useEffect(() => {
    const unsubscribe = subscribeToWines(
      (fetchedWines) => {
        setWines(fetchedWines);
      },
      (error) => {
        console.error("Error fetching wines in real-time:", error);
        Alert.alert("Error", "Failed to fetch wines in real-time");
      }
    );

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: WineForm, image: string | null) => {
    setIsLoading(true);
    try {
      const imageUrl = await uploadImage(image!);
      const newWine = {
        ...data,
        harvestYear: firestore.Timestamp.fromDate(data.harvestYear),
        imageUri: imageUrl, // Store the image URL
      };
      await firestore()
        .collection("users")
        .doc(auth().currentUser?.uid)
        .collection("wines")
        .add(newWine);

      reset();
      setImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error uploading wine:", error);
      Alert.alert("Error", "Failed to upload wine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Wine Collection</Text>
      <FlatList
        data={wines}
        renderItem={({ item }) => <WineItem item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.wineList}
        ListEmptyComponent={EmptyWineList}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Wine</Text>
      </TouchableOpacity>
      <FormModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}
