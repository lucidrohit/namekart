importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAfCum6x-mDrmHAYnPg2xDCWzXJegsxbto",
  authDomain: "tasky-60ec6.firebaseapp.com",
  projectId: "tasky-60ec6",
  storageBucket: "tasky-60ec6.firebasestorage.app",
  messagingSenderId: "897227068731",
  appId: "1:897227068731:web:80f4f828a9f71a5702931e",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Customize background notification handling here
messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
