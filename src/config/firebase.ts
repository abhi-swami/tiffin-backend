import { initializeApp } from 'firebase-admin/app';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "my-new-tiffin.firebaseapp.com",
  projectId: "my-new-tiffin",
  storageBucket: "my-new-tiffin.firebasestorage.app",
  messagingSenderId: "167966303278",
  appId: "1:167966303278:web:9c5f21f3c49e924d75ebbf",
  measurementId: "G-516HQR6W1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);