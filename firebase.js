// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyDafN_kj2uOS7fQw5tIEQSbarGvS17ZIAE",

  authDomain: "fit-lms.firebaseapp.com",

  databaseURL: "https://fit-lms-default-rtdb.firebaseio.com",

  projectId: "fit-lms",

  storageBucket: "fit-lms.firebasestorage.app",

  messagingSenderId: "523650703056",

  appId: "1:523650703056:web:72845c5a1e2d51e95ec8d5"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Export Firebase services
export const auth = getAuth(app);

export const db = getFirestore(app);
