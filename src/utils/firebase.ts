import { initializeApp } from 'firebase-admin/app';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "tiffin-74cfe.firebaseapp.com",
  projectId: "tiffin-74cfe",
  storageBucket: "tiffin-74cfe.firebasestorage.app",
  messagingSenderId: "838483069469",
  appId: "1:838483069469:web:f6ffbc8da30b76ba8414f4",
  measurementId: "G-21ELRQM9R4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);