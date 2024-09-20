import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBswIUARLNVHGrYAKxAa5SW4Xns9ZQhbrk",
  authDomain: "task-cover-notification.firebaseapp.com",
  projectId: "task-cover-notification",
  storageBucket: "task-cover-notification.appspot.com",
  messagingSenderId: "588821095572",
  appId: "1:588821095572:web:b45719a6b4cef895b00081",
  measurementId: "G-XGRM15R8FV",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
