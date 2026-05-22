import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABUYh5HaWwZ3hCLO6xKLQ5zxiQ19H-drg",
  authDomain: "fit-lms.firebaseapp.com",
  projectId: "fit-lms",
  storageBucket: "fit-lms.appspot.com",
  messagingSenderId: "523650703056",
  appId: "1:523650703056:web:72845c5a1e2d51e95ec8d5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
