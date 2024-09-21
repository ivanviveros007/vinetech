import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { Colors } from "../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(auth().currentUser);
  const [name, setName] = useState(user?.displayName || "");
  const [imageUri, setImageUri] = useState(user?.photoURL || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber || "Not set"
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.displayName || "");
      setImageUri(currentUser.photoURL || "");
      setPhoneNumber(currentUser.phoneNumber || "Not set");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setName(userData?.name || "");
          setImageUri(userData?.profileImage || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const updateUserData = async (
    newData: Partial<{ name: string; profileImage: string }>
  ) => {
    const user = auth().currentUser;
    console.log("Current user:", user);
    if (user) {
      try {
        const userRef = firestore().collection("users").doc(user.uid);
        console.log("Updating document:", userRef.path);

        // Use set with merge option instead of update
        await userRef.set(newData, { merge: true });

        console.log("Update successful");
        setUser({ ...user, ...newData });
      } catch (error) {
        console.error("Error updating user data:", error);
        Alert.alert("Error", "Failed to update user data. Please try again.");
      }
    } else {
      console.error("No authenticated user found");
      Alert.alert("Error", "You must be logged in to update your profile.");
    }
  };

  const handleNameChange = async () => {
    setIsEditingName(false);
    await updateUserData({ name });
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIsUploadingPhoto(true);
      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop();

      // Uploading the image to Firebase Storage
      const reference = storage().ref(
        `profileImages/${user?.uid || "anonymous"}/${filename}`
      );

      try {
        await reference.putFile(localUri);
        const downloadURL = await reference.getDownloadURL();

        // Update Firestore and local state with the new image URL
        setImageUri(downloadURL);
        await updateUserData({ profileImage: downloadURL });
      } catch (error) {
        console.error("Error uploading image: ", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        {isUploadingPhoto ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={{ uri: imageUri || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.changePhotoText}>Change photo</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          {isEditingName ? (
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={handleNameChange}
              style={styles.input}
              autoFocus
            />
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditingName(true)}
              style={styles.nameContainer}
            >
              <Text style={styles.infoText}>{name || "Set your name"}</Text>
              <MaterialIcons
                name="edit"
                size={20}
                color="#007AFF"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.infoText}>{phoneNumber}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.marshland[950],
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoText: {
    marginTop: 10,
    color: "#007AFF",
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    minWidth: 100,
    textAlign: "right",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
