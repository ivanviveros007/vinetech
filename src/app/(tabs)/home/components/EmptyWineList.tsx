import { View, StyleSheet } from "react-native";
import { ThemedText as Text } from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/Colors";

export const EmptyWineList = () => (
  <View style={styles.emptyList}>
    <Text style={styles.emptyListEmoji}>🍷</Text>
    <Text style={styles.emptyListText}>No wines added yet.</Text>
    <Text style={styles.emptyListSubText}>
      Tap the "Add Wine" button to get started!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyListEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.marshland[100],
    textAlign: "center",
  },
  emptyListSubText: {
    fontSize: 14,
    color: Colors.marshland[300],
    textAlign: "center",
    marginTop: 10,
  },
});
