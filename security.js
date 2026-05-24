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

        /* ================= USER NOT FOUND ================= */
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

        /* ================= ROLE SYSTEM (FIXED) ================= */
        const role = data.role || "user";

        /* ================= ROLE-BASED CONTROL ================= */

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

    } catch (error) {

        console.log("Security error:", error);

        window.location.replace("index.html");

    }

});
