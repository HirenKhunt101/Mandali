// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5yPAlq8-eqPGF7ip4cuws9VSPsimewIA",
  authDomain: "mandali-fbf84.firebaseapp.com",
  projectId: "mandali-fbf84",
  storageBucket: "mandali-fbf84.appspot.com",
  messagingSenderId: "595595593551",
  appId: "1:595595593551:web:f47cbf5a7e8e7f5f6b273a",
  measurementId: "G-X4V4BL63LS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);