import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDob8sieP_XFfCFJRNs79a61lEtb3jBC8U",
  projectId: "cinia-polares",
  databaseURL: "https://cinia-polares-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const fs = getFirestore(app);
export const db = getDatabase(app);

// Realtime Database Connection Check (sin escritura)
const checkDatabaseConnection = async () => {
  try {
    const testRef = ref(db, "Users");
    const snapshot = await get(testRef);

    if (snapshot.exists()) {
      console.log("Connected");
    } else {
      console.log("Not connected");
    }
  } catch (error) {
    console.error("Realtime Database connection failed:", error);
  }
};

// Run connection checks
checkDatabaseConnection();
