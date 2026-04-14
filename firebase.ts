import { initializeApp } from 'firebase/app';
import { initializeFirestore, getDocFromServer, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling enabled to bypass potential WebSocket blocks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Test connection to Firestore
export async function testFirestoreConnection() {
  try {
    // Attempt to fetch a non-existent doc just to check connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'init'));
    console.log("Firestore connection established successfully.");
    return true;
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Firestore Error: Could not reach backend. This is often caused by AdBlockers or network restrictions blocking 'firestore.googleapis.com'.");
    } else {
      console.warn("Firestore connection test info:", error.message);
    }
    return false;
  }
}

// Don't block module load with the test
if (typeof window !== 'undefined') {
  testFirestoreConnection();
}
