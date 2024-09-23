import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export const subscribeToWines = (
  callback: (wines: any[]) => void,
  errorCallback: (error: any) => void
) => {
  const userId = auth().currentUser?.uid;
  if (!userId) {
    errorCallback(new Error("User not authenticated"));
    return () => {};
  }

  // Suscribirse a los cambios en tiempo real
  const unsubscribe = firestore()
    .collection("users")
    .doc(userId)
    .collection("wines")
    .onSnapshot(
      (snapshot) => {
        const wines = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(wines); // Llamamos al callback con los vinos
      },
      (error) => {
        errorCallback(error); // Manejamos errores
      }
    );

  // Devolvemos la función de cancelar la suscripción
  return unsubscribe;
};
