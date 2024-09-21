import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Colors } from "../../constants/Colors";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import firestore from '@react-native-firebase/firestore';

const CELL_COUNT = 6;

export default function VerifyCode() {
  const { verificationId } = useLocalSearchParams<{ verificationId: string }>();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [loading, setLoading] = useState(false);

  const onVerifyCode = async () => {
    if (value.length === CELL_COUNT) {
      setLoading(true);
      try {
        const credential = auth.PhoneAuthProvider.credential(
          verificationId,
          value
        );
        const userCredential = await auth().signInWithCredential(credential);
        
        // Get the user's UID
        const uid = userCredential.user.uid;
        const userRef = firestore().collection('users').doc(uid);
        
        // Check if the user document already exists
        const doc = await userRef.get();
        
        if (!doc.exists) {
          // If the document doesn't exist, create it with initial data
          await userRef.set({
            name: userCredential.user.displayName || 'New User',
            phoneNumber: userCredential.user.phoneNumber,
            profileImage: userCredential.user.photoURL || 'https://example.com/default-profile-image.jpg',
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          // If the document exists, only update the last login time
          await userRef.update({
            lastLoginAt: firestore.FieldValue.serverTimestamp(),
          });
        }

        router.push("/home");
      } catch (error: any) {
        console.error("Error in onVerifyCode:", error);
        let errorMessage = "An error occurred while verifying the code.";
        if (error.code === "auth/invalid-verification-code") {
          errorMessage = "The verification code is invalid. Please try again.";
        }
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      onVerifyCode();
    }
  }, [value]);

  const getCellBackgroundColor = (index: number) => {
    if (index < value.length) {
      return {
        backgroundColor: Colors.marshland[200],
      };
    }
    return {};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your phone
      </Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[
              styles.cell,
              isFocused && styles.focusCell,
              getCellBackgroundColor(index),
            ]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onVerifyCode}
        disabled={loading || value.length !== CELL_COUNT}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify Code"}
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.marshland[200],
    marginBottom: 30,
    textAlign: "center",
  },
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 30,
  },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    borderWidth: 2,
    borderColor: Colors.marshland[400],
    borderRadius: 8,
    backgroundColor: Colors.marshland[800],
    textAlign: "center",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCell: {
    borderColor: Colors.marshland[200],
  },
  cellText: {
    color: Colors.marshland[950],
    fontSize: 24,
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
