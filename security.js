import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";

const db = getFirestore();

/* ================= SAFE PAGE HIDE ================= */
document.documentElement.style.visibility = "hidden";

/* ================= INACTIVITY TIMER ================= */
let inactivityTimer;

function startInactivityTimer() {

    const reset = () => {

        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(async () => {
            await signOut(auth);
            alert("Session expired due to inactivity.");
            window.location.href = "index.html";
        }, 10 * 60 * 1000); // 10 min
    };

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(ev => {
        window.addEventListener(ev, reset);
    });

    reset();
}


/* ================= AUTH CHECK ================= */
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "users", user.uid);

    /* ================= REAL-TIME LISTENER ================= */
    onSnapshot(ref, async (snap) => {

        if (!snap.exists()) {
            await signOut(auth);
            window.location.href = "index.html";
            return;
        }

        const data = snap.data();

        /* ================= BLOCKED USER (INSTANT LOGOUT) ================= */
        if (data.status === "blocked") {
            await signOut(auth);
            alert("Your account has been blocked by admin.");
            window.location.href = "index.html";
            return;
        }

        /* ================= POLICY CHECK ================= */
        if (!data.policyAccepted) {
            window.location.href = "policy.html";
            return;
        }

        /* ================= ROLE ================= */
        const role = data.role || "user";

        console.log("Role:", role);

        /* ================= SHOW PAGE ================= */
        document.documentElement.style.visibility = "visible";

        /* ================= START INACTIVITY ================= */
        startInactivityTimer();

    });

});
