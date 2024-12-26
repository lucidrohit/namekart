"use client";
import { useEffect } from "react";
import { register } from "@/serviceWorker";
import useFcmToken from "@/hooks/useFcmToken";
import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "@/config/firebaseConfig";

register();

export default function PushNotificationProvider({ children }: any) {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  // Use the token as needed
  fcmToken && console.log("FCM token:", fcmToken);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload);
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return children;
}
