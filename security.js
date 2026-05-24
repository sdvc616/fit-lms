import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";


const db = getFirestore();


onAuthStateChanged(auth, async (user) => {

    /* ================= NOT LOGGED IN ================= */
    if (!user) {
        window.location.replace("index.html");
        return;
    }

    try {

        /* ================= GET USER DATA ================= */
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        /* ================= USER NOT IN FIRESTORE ================= */
        if (!snap.exists()) {
            window.location.replace("index.html");
            return;
        }

        const data = snap.data();

        /* ================= POLICY CHECK ================= */
        if (!data.policyAccepted) {
            window.location.replace("policy.html");
            return;
        }

        /* ================= ROLE CHECK (OPTIONAL FUTURE USE) ================= */
        const role = data.role || "student";

        if (role === "admin") {
            console.log("Admin user detected");
        }

        /* ================= ACCESS GRANTED ================= */
        console.log("User authenticated:", user.uid);

    } catch (error) {

        console.log("Security error:", error);

        window.location.replace("index.html");

    }

});
