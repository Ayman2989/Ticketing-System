// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_gYeoiQGnUfceIZXhSbGBxEZ6hescSJg",
  authDomain: "ticketing-app-8dfdc.firebaseapp.com",
  projectId: "ticketing-app-8dfdc",
  storageBucket: "ticketing-app-8dfdc.firebasestorage.app",
  messagingSenderId: "129388713952",
  appId: "1:129388713952:web:7cd92010b6c3153141fd85",
  measurementId: "G-CQMHCYZDMB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
