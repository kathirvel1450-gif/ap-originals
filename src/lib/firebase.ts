import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "ap-originals.firebaseapp.com",
    projectId: "ap-originals",
    storageBucket: "ap-originals.firebasestorage.app",
    messagingSenderId: "XXXX",
    appId: "XXXX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);