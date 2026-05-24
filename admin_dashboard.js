import { auth, db } from "./firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* =========================
   LOAD DASHBOARD
========================= */
loadDashboard();


/* =========================
   DASHBOARD FUNCTION
========================= */
async function loadDashboard(){

    try{

        /* ================= USERS ================= */
        const userSnap = await getDocs(collection(db,"users"));

        let users = 0;

        userSnap.forEach(() => {
            users++;
        });

        const userCountEl = document.getElementById("userCount");

        if(userCountEl){
            userCountEl.innerText = users;
        }

        /* ================= STAFF ================= */
        const staffSnap = await getDocs(collection(db,"staff"));

        let staff = 0;
        let deleted = 0;

        staffSnap.forEach((docSnap) => {

            const data = docSnap.data();

            if(data.deleted === true){
                deleted++;
            }
            else{
                staff++;
            }

        });

        const staffCountEl = document.getElementById("staffCount");
        const binCountEl = document.getElementById("binCount");

        if(staffCountEl){
            staffCountEl.innerText = staff;
        }

        if(binCountEl){
            binCountEl.innerText = deleted;
        }

        /* ================= DEPARTMENTS ================= */
        const deptSnap = await getDocs(collection(db,"departments"));

        const deptCountEl = document.getElementById("deptCount");

        if(deptCountEl){
            deptCountEl.innerText = deptSnap.size || 0;
        }

    }
    catch(error){

        console.log("Dashboard error:", error);

    }

}


/* =========================
   LOGOUT
========================= */
window.logout = async function(){

    try{

        await signOut(auth);

        window.location.href = "login.html";

    }
    catch(error){

        console.log("Logout error:", error);

    }

};
