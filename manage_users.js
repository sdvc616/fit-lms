import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* ==============================
   LOAD USERS
============================== */
loadUsers(me, user.uid);


/* ==============================
   LOAD USERS TABLE
============================== */
async function loadUsers(me, currentUid) {
    try {

        /* ================= CURRENT USER ================= */
        const myRef = doc(db, "users", auth.currentUser.uid);
        const mySnap = await getDoc(myRef);

        if (!mySnap.exists()) {
            return;
        }

        const me = mySnap.data();

        /* ================= GET ALL USERS ================= */
        const snap = await getDocs(collection(db, "users"));

        let rows = "";

        snap.forEach((docSnap) => {

            const u = docSnap.data();
            const id = docSnap.id;

           const isSelf = id === currentUid;

            rows += `
            <tr>
                <td>${id}</td>
                <td>${u.username || ""}</td>
                <td>${u.email || ""}</td>
                <td>${u.role || "user"}</td>
                <td>${u.status || "active"}</td>
                <td>
            `;

            /* ================= BLOCK / UNBLOCK ================= */

            if (!isSelf) {

                /* SUPER ADMIN RULES */
                if (me.role === "super_admin") {

                    if (u.role !== "super_admin") {

                        if (u.status === "blocked") {
                            rows += `
                            <button class="unblock"
                            onclick="unblockUser('${id}')">
                            Unblock
                            </button>
                            `;
                        } else {
                            rows += `
                            <button class="block"
                            onclick="blockUser('${id}')">
                            Block
                            </button>
                            `;
                        }

                    }

                }

                /* ADMIN RULES */
                else if (me.role === "admin") {

                    if (u.role === "user") {

                        if (u.status === "blocked") {
                            rows += `
                            <button class="unblock"
                            onclick="unblockUser('${id}')">
                            Unblock
                            </button>
                            `;
                        } else {
                            rows += `
                            <button class="block"
                            onclick="blockUser('${id}')">
                            Block
                            </button>
                            `;
                        }

                    }

                }

            }

            /* ================= PROMOTE ================= */

            if (
                me.role === "super_admin" &&
                u.role === "user" &&
                !isSelf
            ) {

                rows += `
                <button class="promote"
                onclick="promoteUser('${id}')">
                Promote
                </button>
                `;
            }

            /* ================= DEMOTE ================= */

            if (
                me.role === "super_admin" &&
                u.role === "admin" &&
                !isSelf
            ) {

                rows += `
                <button class="demote"
                onclick="demoteUser('${id}')">
                Demote
                </button>
                `;
            }

            rows += `</td></tr>`;

        });

        document.getElementById("userTable").innerHTML = rows;

    } catch (error) {

        console.log(error);

    }

}


/* ==============================
   BLOCK USER
============================== */
window.blockUser = async (id) => {

    try {

        await updateDoc(doc(db, "users", id), {
            status: "blocked"
        });

        loadUsers();

    } catch (error) {

        console.log(error);

    }

};


/* ==============================
   UNBLOCK USER
============================== */
window.unblockUser = async (id) => {

    try {

        await updateDoc(doc(db, "users", id), {
            status: "active"
        });

        loadUsers();

    } catch (error) {

        console.log(error);

    }

};


/* ==============================
   PROMOTE USER
============================== */
window.promoteUser = async (id) => {

    try {

        await updateDoc(doc(db, "users", id), {
            role: "admin"
        });

        loadUsers();

    } catch (error) {

        console.log(error);

    }

};


/* ==============================
   DEMOTE USER
============================== */
window.demoteUser = async (id) => {

    try {

        await updateDoc(doc(db, "users", id), {
            role: "user"
        });

        loadUsers();

    } catch (error) {

        console.log(error);

    }

};
