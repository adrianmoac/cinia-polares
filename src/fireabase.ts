import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDob8sieP_XFfCFJRNs79a61lEtb3jBC8U",
  // authDomain: "todoapp-eeeb7.firebaseapp.com",
  projectId: "cinia-polares",
  // messagingSenderId: "1072574112522",
  // appId: "1:1072574112522:web:65fc4e184aed9894dc90f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const fs = getFirestore(app);
export default app;