import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";

const db = getFirestore();

/* ================= SAFE PAGE HIDE ================= */
document.documentElement.style.visibility = "hidden";

/* ================= INACTIVITY TIMER ================= */
let inactivityTimer;

function startInactivityTimer() {

    const resetTimer = () => {

        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(async () => {

            try {
                await signOut(auth);
                alert("Session expired due to inactivity.");
                window.location.replace("index.html");
            } catch (e) {
                console.log(e);
            }

        }, 10 * 60 * 1000); // 10 minutes
    };

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((event) => {
        window.addEventListener(event, resetTimer);
    });

    resetTimer();
}


/* ================= AUTH CHECK ================= */
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    try {

        const ref = doc(db, "users", user.uid);

        /* ================= REAL-TIME LISTENER ================= */
        const unsubscribe = onSnapshot(ref, async (snap) => {

            if (!snap.exists()) {
                await signOut(auth);
                window.location.replace("index.html");
                return;
            }

            const data = snap.data();

            /* ================= BLOCKED USER (INSTANT LOGOUT) ================= */
            if (data.status === "blocked") {

                await signOut(auth);
                alert("Your account has been blocked by admin.");
                window.location.replace("index.html");

                return;
            }

            /* ================= POLICY CHECK ================= */
            if (!data.policyAccepted) {
                window.location.replace("policy.html");
                return;
            }

            /* ================= ROLE SYSTEM ================= */
            const role = data.role || "user";

            if (role === "super_admin") {
                console.log("Super Admin detected");
            }
            else if (role === "admin") {
                console.log("Admin detected");
            }
            else {
                console.log("Normal user detected");
            }

            /* ================= ACCESS GRANTED ================= */
            console.log("Access granted:", user.uid);

            /* ================= SHOW PAGE ================= */
            document.documentElement.style.visibility = "visible";

            /* ================= START INACTIVITY TIMER ================= */
            startInactivityTimer();

        });

    } catch (error) {

        console.log("Security error:", error);

        await signOut(auth);
        window.location.replace("index.html");
    }

});
