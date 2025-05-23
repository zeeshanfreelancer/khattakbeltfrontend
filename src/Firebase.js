import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref as databaseRef,
  push, 
  onValue, 
  update, 
  remove 
} from 'firebase/database';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMaA07VOHFLvMKYI3-efPYu2WhK3PoWMc",
  authDomain: "khattak-belt.firebaseapp.com",
  projectId: "khattak-belt",
  databaseURL: "https://khattak-belt-default-rtdb.firebaseio.com/",
  storageBucket: "khattak-belt.appspot.com",
  messagingSenderId: "175513426003",
  appId: "1:175513426003:web:3117808c929c27e94ccea6",
  measurementId: "G-8E2CMFYEH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export all database references as 'dbRef' and storage references as 'storageRef'
export { 
  db, 
  auth,
  storage,
  databaseRef as dbRef, // Export database reference as dbRef
  storageRef, // Export storage reference separately
  push, 
  onValue,
  update,
  remove,
  uploadBytes,
  getDownloadURL,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};