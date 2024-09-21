import React, { useState } from "react";

import { Colors } from "../../constants/Colors";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import auth from "@react-native-firebase/auth";

type FormData = {
  phoneNumber?: string;
  code?: string;
};

export default function Login() {
  const { control, handleSubmit } = useForm<FormData>();
  const [verificationId, setVerificationId] = useState("");

  const onSendCode: SubmitHandler<FormData> = async (data) => {
    if (data.phoneNumber) {
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          data.phoneNumber
        );
        setVerificationId(confirmation.verificationId || "");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onVerifyCode: SubmitHandler<FormData> = async (data) => {
    if (data.code) {
      try {
        const credential = auth.PhoneAuthProvider.credential(
          verificationId,
          data.code
        );
        await auth().signInWithCredential(credential);
        // Navigate to Home screen
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!verificationId ? (
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          )}
          name="phoneNumber"
          rules={{ required: true }}
          defaultValue=""
        />
      ) : (
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Verification Code"
              keyboardType="number-pad"
            />
          )}
          name="code"
          rules={{ required: true }}
          defaultValue=""
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(verificationId ? onVerifyCode : onSendCode)}
      >
        <Text style={styles.buttonText}>
          {verificationId ? "Verify Code" : "Send Code"}
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
  input: {
    backgroundColor: Colors.marshland[800],
    color: Colors.marshland[50],
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.marshland[500],
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.marshland[50],
    fontWeight: "bold",
  },
});
