import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Wine } from "../types"; // Importa el tipo Wine
import { Colors } from "@/src/constants/Colors";

type WineItemProps = {
  item: Wine;
};

export const WineItem = ({ item }: WineItemProps) => {
  const router = useRouter();
  const encodedUrl = encodeURI(item.imageUri);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/detailWine",
          params: {
            id: item.id,
            name: item.name,
            imageUri: encodedUrl,
            harvestYear: item.harvestYear.toDate().getFullYear(),
            description: item.description,
          },
        })
      }
    >
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
    </TouchableOpacity>
  );
};

// Estilos específicos para el componente WineItem
const styles = StyleSheet.create({
  wineItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.marshland[900],
    borderRadius: 8,
    marginVertical: 5,
  },
  wineImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  wineInfo: {
    flex: 1,
    justifyContent: "center",
  },
  wineName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  wineYear: {
    color: Colors.marshland[700],
    fontSize: 16,
  },
  wineDescription: {
    color: Colors.marshland[500],
    fontSize: 14,
  },
});
