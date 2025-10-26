import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzzwd98YoYGqp94p3q5DWaep0Z-lB9dx8",
  authDomain: "exam-browser-1a754.firebaseapp.com",
  projectId: "exam-browser-1a754",
  storageBucket: "exam-browser-1a754.firebasestorage.app",
  messagingSenderId: "906758370253",
  appId: "1:906758370253:web:f9e11dd5e3bb259ee30a84",
  measurementId: "G-9BWYLH87N3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
