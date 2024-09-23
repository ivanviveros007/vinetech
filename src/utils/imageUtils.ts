import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";

export const pickImageFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  return !result.canceled ? result.assets[0].uri : null;
};

export const takePicture = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  return !result.canceled ? result.assets[0].uri : null;
};

export const uploadImage = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const ref = storage().ref(`images/${filename}`);
  await ref.put(blob);
  const downloadUrl = await ref.getDownloadURL();
  return downloadUrl;
};
