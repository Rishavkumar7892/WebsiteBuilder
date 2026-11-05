// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "website-builder-e89e2.firebaseapp.com",
  projectId: "website-builder-e89e2",
  storageBucket: "website-builder-e89e2.firebasestorage.app",
  messagingSenderId: "473072116931",
  appId: "1:473072116931:web:df2cad0d2b305b982cee76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
