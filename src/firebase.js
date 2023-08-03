import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_XHRd1YIZQE3EZVXVQ4ScXjS3a2eW2qI",
  authDomain: "chat-app-a6c5a.firebaseapp.com",
  projectId: "chat-app-a6c5a",
  storageBucket: "chat-app-a6c5a.appspot.com",
  messagingSenderId: "680853470671",
  appId: "1:680853470671:web:de1b43ae2ac4cf67e3a6ba",
  measurementId: "G-6LLS59J530"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
