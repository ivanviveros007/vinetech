import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Platform } from "react-native";
import { Colors } from "../../constants/Colors";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import auth from "@react-native-firebase/auth";


type FormData = {
  phoneNumber?: string;
  code?: string;
};

export default function Login() {
  const { control, handleSubmit, watch } = useForm<FormData>();
  const [verificationId, setVerificationId] = useState("");

  const onSendCode: SubmitHandler<FormData> = async (data) => {
    if (data.phoneNumber) {
      try {
        // Remove any non-digit characters from the phone number
        const cleanPhoneNumber = data.phoneNumber.replace(/\D/g, '');
        const fullPhoneNumber = `+54${cleanPhoneNumber}`;
        console.log("Attempting to send code to:", fullPhoneNumber);
        
        // Log Firebase Auth state
        const currentUser = auth().currentUser;
        console.log("Current user:", currentUser ? currentUser.uid : "No user signed in");

       
        // Log device info
        console.log("Platform:", Platform.OS);
        console.log("Version:", Platform.Version);

        // Attempt to send verification code
        const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
        console.log("Confirmation received:", confirmation);
        setVerificationId(confirmation.verificationId || "");
      } catch (error: any) {
        console.error("Error in onSendCode:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);

        let errorMessage = "An error occurred while sending the verification code.";
        if (error.code === 'auth/invalid-phone-number') {
          errorMessage = "The phone number format is incorrect. Please enter a valid phone number.";
        } else if (error.code === 'auth/internal-error') {
          errorMessage = "An internal error occurred. Please check your internet connection and try again.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = "Phone number sign-in is not enabled for this project.";
        }
        Alert.alert("Error", errorMessage);
      }
    } else {
      Alert.alert("Error", "Please enter a phone number.");
    }
  };

  const onVerifyCode: SubmitHandler<FormData> = async (data) => {
    if (data.code) {
      try {
        console.log("Attempting to verify code:", data.code);
        const credential = auth.PhoneAuthProvider.credential(
          verificationId,
          data.code
        );
        const userCredential = await auth().signInWithCredential(credential);
        console.log("User signed in:", userCredential.user.uid);
        // Navigate to Home screen
      } catch (error: any) {
        console.error("Error in onVerifyCode:", error);
        let errorMessage = "An error occurred while verifying the code.";
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = "The verification code is invalid. Please try again.";
        } else if (error.code === 'auth/internal-error') {
          errorMessage = "An internal error occurred. Please check your internet connection and try again.";
        }
        Alert.alert("Error", errorMessage);
      }
    } else {
      Alert.alert("Error", "Please enter the verification code.");
    }
  };

  return (
    <View style={styles.container}>
      {!verificationId ? (
        <>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.prefix}>+54</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.phoneInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              )}
              name="phoneNumber"
              rules={{ required: true }}
              defaultValue=""
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Verification Code</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter verification code"
                keyboardType="number-pad"
              />
            )}
            name="code"
            rules={{ required: true }}
            defaultValue=""
          />
        </>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.marshland[50],
    marginBottom: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  prefix: {
    fontSize: 16,
    color: Colors.marshland[50],
    backgroundColor: Colors.marshland[800],
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.marshland[800],
    color: Colors.marshland[50],
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  input: {
    backgroundColor: Colors.marshland[800],
    color: Colors.marshland[50],
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
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
