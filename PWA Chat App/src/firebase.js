// Firebase Compat SDK — compatible with v8-style code used in all components.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1v8HZSghsL9D4iF8F8LshkMwdwW0yrzo",
  authDomain: "johncy-chat-app.firebaseapp.com",
  databaseURL: "https://johncy-chat-app-default-rtdb.firebaseio.com",
  projectId: "johncy-chat-app",
  storageBucket: "johncy-chat-app.firebasestorage.app",
  messagingSenderId: "627719347098",
  appId: "1:627719347098:web:c1d648b41cc099432eb823",
  measurementId: "G-HH0W4F7JY3"
};

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
