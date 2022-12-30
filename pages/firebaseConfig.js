// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirebase, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfC5sT3D2lPGh63BztrfAw-kzKWcC-aQk",
  authDomain: "treehoppers-test.firebaseapp.com",
  projectId: "treehoppers-test",
  storageBucket: "treehoppers-test.appspot.com",
  messagingSenderId: "1053273760365",
  appId: "1:1053273760365:web:0b17988407c4e8e97e1564",
  measurementId: "G-KHGDJFGW78"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);