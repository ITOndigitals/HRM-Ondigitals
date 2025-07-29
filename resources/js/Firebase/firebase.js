// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// hrm firebase
// const firebaseConfig = {
//     apiKey: import.meta.env.FIREBASE_APIKEY,
//     authDomain: "ods-hrm.firebaseapp.com",
//     databaseURL: "https://ods-hrm-default-rtdb.firebaseio.com",
//     projectId: "ods-hrm",
//     storageBucket: "ods-hrm.appspot.com",
//     messagingSenderId: "424959226657",
//     appId: "1:424959226657:web:06eb65d539ac9e32084460",
// };
// test firebase
const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_APIKEY,
    authDomain: "task-hrm.firebaseapp.com",
    databaseURL: "https://task-hrm-default-rtdb.firebaseio.com",
    projectId: "task-hrm",
    storageBucket: "task-hrm.firebasestorage.app",
    messagingSenderId: "1086495644018",
    appId: "1:1086495644018:web:c348f4385d5557af80a5eb",
    measurementId: "G-PQ1SV017KP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export the database instance
export const database = getDatabase(app);
