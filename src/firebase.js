import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKBIzHHr8AKX1xX0ibGLRCNK_GHKqwW40",
    authDomain: "dustshelf.firebaseapp.com",
    projectId: "dustshelf",
    storageBucket: "dustshelf.firebasestorage.app",
    messagingSenderId: "641718944462",
    appId: "1:641718944462:web:18613397f85d1de41a069f",
    measurementId: "G-X2GSSQ9L7H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
