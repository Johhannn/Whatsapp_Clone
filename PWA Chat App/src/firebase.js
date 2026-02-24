// Firebase Compat SDK — compatible with v8-style code used in all components.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/messaging";

// Your Firebase configuration

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const db = firebase.firestore();
const db2 = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Storage refs
const storage = firebase.storage().ref("images");
const audioStorage = firebase.storage().ref("audios");

// Messaging (only works in browser + HTTPS/PWA)
let messaging = null;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

// Timestamp helpers
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const createTimestamp2 = firebase.database.ServerValue.TIMESTAMP;
const fieldIncrement = firebase.firestore.FieldValue.increment;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

// Exports
export {
  auth,
  provider,
  createTimestamp,
  createTimestamp2,
  fieldIncrement,
  arrayUnion,
  storage,
  audioStorage,
  db2,
  messaging
};

export default db;
