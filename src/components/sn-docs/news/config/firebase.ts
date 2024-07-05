import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAe2IUOUKB6UnbAa45JZkP3psHe0zKTpvQ",
  authDomain: "d4tmp3-reactjs-7195d.firebaseapp.com",
  projectId: "d4tmp3-reactjs-7195d",
  storageBucket: "d4tmp3-reactjs-7195d.appspot.com",
  messagingSenderId: "278324459087",
  appId: "1:278324459087:web:cd5aa4d5f1fccd2e149c3a",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
