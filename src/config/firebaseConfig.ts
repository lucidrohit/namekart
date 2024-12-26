import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getMessaging, Messaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAfCum6x-mDrmHAYnPg2xDCWzXJegsxbto",
  authDomain: "tasky-60ec6.firebaseapp.com",
  projectId: "tasky-60ec6",
  storageBucket: "tasky-60ec6.firebasestorage.app",
  messagingSenderId: "897227068731",
  appId: "1:897227068731:web:80f4f828a9f71a5702931e",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const messaging = getMessaging(app);

export { messaging };
