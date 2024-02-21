// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7gusJoTsDDs4kpSXrsz_MUBs1QwWnE6Y",
    authDomain: "barproject-be8a4.firebaseapp.com",
    projectId: "barproject-be8a4",
    storageBucket: "barproject-be8a4.appspot.com",
    messagingSenderId: "390524666335",
    appId: "1:390524666335:web:fb7b512291082695c4846a",
    measurementId: "G-GBMHZ1W55W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics}