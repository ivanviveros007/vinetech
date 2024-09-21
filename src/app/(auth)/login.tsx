

import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import { Colors } from "../../constants/Colors";

type FormData = {
  phoneNumber: string;
};

export default function Login() {
  const { control, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSendCode: SubmitHandler<FormData> = async (data) => {
    if (data.phoneNumber) {
      setLoading(true);
      try {
        const cleanPhoneNumber = data.phoneNumber.replace(/\D/g, '');
        const fullPhoneNumber = `+54${cleanPhoneNumber}`;
        
        const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
        
        router.push({
          pathname: '/(auth)/verifyCode',
          params: { verificationId: confirmation.verificationId }
        });
      } catch (error: any) {
        console.error("Error in onSendCode:", error);
        Alert.alert("Error", "Failed to send verification code. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please enter a phone number.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+54</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.marshland[400]}
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
          rules={{ required: true }}
          defaultValue=""
        />
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSendCode)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.marshland[950],
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.marshland[50],
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  prefix: {
    fontSize: 16,
    color: Colors.marshland[50],
    backgroundColor: Colors.marshland[800],
    padding: 15,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.marshland[800],
    color: Colors.marshland[50],
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.marshland[50],
    fontWeight: "bold",
    fontSize: 16,
  },
});

