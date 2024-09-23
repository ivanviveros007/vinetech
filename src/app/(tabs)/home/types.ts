import { Timestamp } from "@react-native-firebase/firestore";

export type WineForm = {
  name: string;
  harvestYear: Date;
  description: string;
};

export type Wine = Omit<WineForm, "harvestYear"> & {
  id: string;
  imageUri: string;
  harvestYear: Timestamp;
  userId: string;
};
