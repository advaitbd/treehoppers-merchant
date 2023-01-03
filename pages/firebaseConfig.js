// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirebase, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPU4hsOOXzMJ7dkRYQHVsn_t-4WVJui2o",
  authDomain: "treehoppers-2d811.firebaseapp.com",
  projectId: "treehoppers-2d811",
  storageBucket: "treehoppers-2d811.appspot.com",
  messagingSenderId: "121650851156",
  appId: "1:121650851156:web:4c3046302f894cdc336cc1",
  measurementId: "G-3E4JJ06RHQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);