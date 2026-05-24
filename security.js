import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth } from "./firebase.js";

const db = getFirestore();

/* ================= HIDE PAGE UNTIL CHECK ================= */
document.body.style.display = "none";

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
            await signOut(auth);
            window.location.replace("index.html");
            return;
        }

        const data = snap.data();

        /* ================= BLOCKED USER CHECK ================= */
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

        /* ================= SHOW PAGE AFTER SUCCESS ================= */
        document.body.style.display = "block";

    } catch (error) {

        console.log("Security error:", error);

        await signOut(auth);
        window.location.replace("index.html");
    }

});
