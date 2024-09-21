import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import auth from "@react-native-firebase/auth";
import { View, Text, ActivityIndicator } from "react-native";
import "@react-native-firebase/app";

export default function InitialScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const [authState, setAuthState] = useState<
    "loading" | "loggedIn" | "loggedOut"
  >("loading");

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setAuthState("loggedIn");
      } else {
        setUser(null);
        setAuthState("loggedOut");
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return authState === "loggedIn" ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
