import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
getDocs,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ==============================
   AUTH CHECK (ADMIN ONLY)
============================== */
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        window.location.href = "index.html";
        return;
    }

    const me = snap.data();

    if (me.role !== "admin" && me.role !== "super_admin") {
        alert("Access Denied");
        window.location.href = "index.html";
        return;
    }

    loadUsers(me);
});


/* ==============================
   LOAD USERS TABLE
============================== */
async function loadUsers(me) {

    const snap = await getDocs(collection(db, "users"));

    let rows = "";

    snap.forEach((docSnap) => {

        const u = docSnap.data();
        const id = docSnap.id;

        const isSelf = id === auth.currentUser.uid;

        rows += `
        <tr>
            <td>${id}</td>
            <td>${u.username || ""}</td>
            <td>${u.email || ""}</td>
            <td>${u.role}</td>
            <td>${u.status}</td>
            <td>
        `;

        /* ================= BLOCK / UNBLOCK ================= */
        if (!isSelf) {

            if (u.status === "blocked") {
                rows += `<button class="unblock" onclick="unblockUser('${id}')">Unblock</button>`;
            } else {
                rows += `<button class="block" onclick="blockUser('${id}')">Block</button>`;
            }
        }

        /* ================= ROLE CONTROL ================= */
        if (me.role === "super_admin" && !isSelf) {

            if (u.role === "user") {
                rows += `<button class="promote" onclick="promoteUser('${id}')">Promote</button>`;
            }

            if (u.role === "admin") {
                rows += `<button class="demote" onclick="demoteUser('${id}')">Demote</button>`;
            }
        }

        rows += `</td></tr>`;
    });

    document.getElementById("userTable").innerHTML = rows;
}


/* ==============================
   ACTIONS
============================== */

window.blockUser = async (id) => {
    await updateDoc(doc(db, "users", id), {
        status: "blocked"
    });
};

window.unblockUser = async (id) => {
    await updateDoc(doc(db, "users", id), {
        status: "active"
    });
};

window.promoteUser = async (id) => {
    await updateDoc(doc(db, "users", id), {
        role: "admin"
    });
};

window.demoteUser = async (id) => {
    await updateDoc(doc(db, "users", id), {
        role: "user"
    });
};
