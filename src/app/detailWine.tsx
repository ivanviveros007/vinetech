import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Wine } from "@/src/types/wine";
import { Colors } from "@/src/constants/Colors";
import { Image } from "expo-image";

export default function WineDetail() {
  const params = useLocalSearchParams<Wine>();

  return (
    <ScrollView style={styles.container}>
      {params.imageUri ? (
        <Image
          source={{ uri: params.imageUri }}
          style={styles.image}
          contentFit="cover"
          onError={(error) => {
            console.error("Image loading error:", error);
          }}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{params.name}</Text>
        <Text style={styles.detail}>Variety: {params.variety}</Text>
        <Text style={styles.detail}>
          Harvest Year: {new Date(params.harvestYear).getFullYear()}
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
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
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
