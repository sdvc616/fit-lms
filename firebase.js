import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDt5kcl-Ib-MCskjiQMiD_yShIhsLgGd0",
  authDomain: "fit-lms.firebaseapp.com",
  projectId: "fit-lms",
  storageBucket: "fit-lms.firebasestorage.app",
  messagingSenderId: "523650703056",
  appId: "1:523650703056:web:72845c5a1e2d51e95ec8d5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
