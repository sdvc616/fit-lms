// security.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { auth } from "./firebase.js";

export function requireLogin(callback) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            callback(user);
        }
    });
}