import { initializeApp } from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import "@react-native-firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7NRxWpkMrNlRq2kvckW5A0d3-BSRi92g",
  authDomain: "vinetech-ia.firebaseapp.com",
  projectId: "vinetech-ia",
  storageBucket: "vinetech-ia.appspot.com",
  messagingSenderId: "981054077247",
  appId: "1:981054077247:web:8196c121ea26f15fe07b8a",
};

const app = initializeApp(firebaseConfig);

export default app;
