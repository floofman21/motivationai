import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwe0KXGfwEnkAH8IVPujwAQ-p4Wwk2gyY",
  authDomain: "motivationalai-6a115.firebaseapp.com",
  projectId: "motivationalai-6a115",
  storageBucket: "motivationalai-6a115.appspot.com",
  messagingSenderId: "1089653261629",
  appId: "1:1089653261629:web:f505029b18683a25687154",
  measurementId: "G-X0D1QDDR6Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);