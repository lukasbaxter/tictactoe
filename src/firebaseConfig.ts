// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBosY-iTy0nwjqR8odKHcm-krW1fVjhMyg",
  authDomain: "tictactoe-8f6d8.firebaseapp.com",
  databaseURL: "https://tictactoe-8f6d8-default-rtdb.firebaseio.com",
  projectId: "tictactoe-8f6d8",
  storageBucket: "tictactoe-8f6d8.firebasestorage.app",
  messagingSenderId: "436463121609",
  appId: "1:436463121609:web:ff65dab7d8b2083fff8918",
  measurementId: "G-0BQ3KH97G3"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);
export const db = getDatabase(firebaseApp);