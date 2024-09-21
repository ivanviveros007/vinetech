import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Wine } from "@/src/types/wine";
import { Colors } from "@/src/constants/Colors";

export default function WineDetail() {
  const params = useLocalSearchParams<Wine>();
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("Image URI:", params.imageUri);

  const testImageUrl = "https://reactnative.dev/img/tiny_logo.png"; // Test image

  return (
    <ScrollView style={styles.container}>
      {/* Firebase Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: params.imageUri }}
          style={styles.image} 
          onError={(e) => {
            console.error("Firebase Image loading error:", e.nativeEvent.error);
            setImageError(true);
          }}
          onLoad={() => {
            console.log("Firebase Image loaded successfully");
            setLoading(false);
          }}
        />
        {loading && <ActivityIndicator size="large" color={Colors.marshland[300]} />}
      </View>

      {/* Test Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: testImageUrl }}
          style={styles.image} 
          onError={(e) => {
            console.error("Test Image loading error:", e.nativeEvent.error);
          }}
          onLoad={() => {
            console.log("Test Image loaded successfully");
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{params.name}</Text>
        <Text style={styles.detail}>Variety: {params.variety}</Text>
        <Text style={styles.detail}>
          Harvest Year: {new Date(params.hervestYear).getFullYear()}
        </Text>
        <Text style={styles.detail}>Rating: {params.rating}/5</Text>
        <Text style={styles.notes}>{params.notes}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.marshland[900],
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.marshland[100],
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: Colors.marshland[300],
    marginBottom: 5,
  },
  notes: {
    fontSize: 16,
    color: Colors.marshland[300],
    marginTop: 10,
  },
  placeholderImage: {
    backgroundColor: Colors.marshland[700],
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.marshland[300],
    fontSize: 16,
  },
});
