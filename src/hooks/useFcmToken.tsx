// import { useEffect, useState } from "react";
// import { getMessaging, getToken } from "firebase/messaging";
// import { app } from "@/config/firebaseConfig"; // Ensure this is correctly configured

// const useFcmToken = () => {
//   const [fcmToken, setFcmToken] = useState("");
//   const [notificationPermissionStatus, setNotificationPermissionStatus] =
//     useState("default");

//   useEffect(() => {
//     const retrieveToken = async () => {
//       try {
//         if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//           // Request notification permission
//           const permission = await Notification.requestPermission();
//           setNotificationPermissionStatus(permission);

//           if (permission === "granted") {
//             const messaging = getMessaging(app);

//             // Register the service worker if not already done
//             await navigator.serviceWorker.register("/firebase-messaging-sw.js");

//             const token = await getToken(messaging, {
//               vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//             });
//             if (token) {
//               setFcmToken(token);
//             } else {
//               console.log("No FCM token retrieved. Check configuration.");
//             }
//           } else {
//             console.log("Notification permission not granted.");
//           }
//         }
//       } catch (error) {
//         console.error("Error retrieving FCM token:", error);
//       }
//     };

//     retrieveToken();
//   }, []);

//   return { fcmToken, notificationPermissionStatus };
// };

// export default useFcmToken;
