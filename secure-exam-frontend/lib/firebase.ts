import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRUPakOU6HTP2JyF8W26WMk7co1WGeKUM",
  authDomain: "hirepro-510b8.firebaseapp.com",
  projectId: "hirepro-510b8",
  storageBucket: "hirepro-510b8.firebasestorage.app",
  messagingSenderId: "1034330979145",
  appId: "1:1034330979145:web:0a2b03047f89622b2c3898",
  measurementId: "G-V4F38E0D1R"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
