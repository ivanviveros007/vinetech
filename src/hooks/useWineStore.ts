import { create } from "zustand";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

interface Wine {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface WineStore {
  wines: Wine[];
  addWine: (wine: Omit<Wine, "id">) => Promise<void>;
  fetchWines: () => Promise<void>;
}

export const useWineStore = create<WineStore>((set) => ({
  wines: [],
  addWine: async (wine) => {
    const user = auth().currentUser;
    if (user) {
      const docRef = await firestore()
        .collection("users")
        .doc(user.uid)
        .collection("wines")
        .add(wine);
      set((state) => ({
        wines: [...state.wines, { id: docRef.id, ...wine }],
      }));
    }
  },
  fetchWines: async () => {
    const user = auth().currentUser;
    if (user) {
      const snapshot = await firestore()
        .collection("users")
        .doc(user.uid)
        .collection("wines")
        .get();
      const wines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Wine[];
      set({ wines });
    }
  },
}));
