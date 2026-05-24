import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
getFirestore,
doc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";

const db = getFirestore();

/* ================= PREVENT FLICKER ================= */
document.documentElement.style.visibility = "hidden";

/* ================= GLOBAL STATE ================= */
let unsubscribeUser = null;
let inactivityTimer = null;

/* ================= INACTIVITY SYSTEM ================= */
function startInactivityTimer() {

    const reset = () => {

        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(async () => {

            try {
                if (auth.currentUser) {
                    await signOut(auth);
                }
                alert("Session expired due to inactivity.");
                window.location.href = "index.html";
            } catch (e) {
                console.log(e);
            }

        }, 10 * 60 * 1000); // 10 min
    };

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(evt => {
        window.addEventListener(evt, reset);
    });

    reset();
}

/* ================= AUTH LISTENER ================= */
onAuthStateChanged(auth, (user) => {

    /* CLEAN OLD LISTENER */
    if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
    }

    if (!user) {
        document.documentElement.style.visibility = "visible";
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "users", user.uid);

    /* ================= REALTIME USER LISTENER ================= */
    unsubscribeUser = onSnapshot(ref, async (snap) => {

        if (!snap.exists()) {
            await signOut(auth);
            window.location.href = "index.html";
            return;
        }

        const data = snap.data();

        /* ================= BLOCK CHECK (REALTIME) ================= */
        if (data.status === "blocked") {

            await signOut(auth);
            alert("Your account has been blocked by admin.");
            window.location.href = "index.html";
            return;
        }

        /* ================= POLICY ================= */
        if (!data.policyAccepted) {
            window.location.href = "policy.html";
            return;
        }

        /* ================= ROLE ================= */
        const role = data.role || "user";

        console.log("Role:", role);

        /* ================= SHOW PAGE ONCE ================= */
        document.documentElement.style.visibility = "visible";

        /* ================= START TIMER ONLY ONCE ================= */
        if (!window.__inactivityStarted) {
            window.__inactivityStarted = true;
            startInactivityTimer();
        }

    });

});
