import React from "react";
import { Stack } from "expo-router";

const authLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};

export default authLayout;
