import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAVzHKDlv5bKBTgmbpwNYNPeDr8r6bOUNo",
  authDomain: "saas-387913.firebaseapp.com",
  projectId: "saas-387913",
  storageBucket: "saas-387913.firebasestorage.app",
  messagingSenderId: "617215876101",
  appId: "1:617215876101:web:45d8f0ccea7e8ae8a7d06c",
  measurementId: "G-TSE82HY83P"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
