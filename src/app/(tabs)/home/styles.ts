import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

export const styles = StyleSheet.create({
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

  wineList: {
    flex: 1,
  },
});
