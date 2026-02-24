/* eslint-disable no-restricted-globals */
// Firebase Compat SDK for Service Worker
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Your web app's Firebase configuration
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

const messaging = firebase.messaging();

// Detect the website origin
const href = self.location.origin;

// Background notifications
messaging.onBackgroundMessage((payload) => {
  const title = payload.data.title;

  const options = payload.data.image
    ? {
      badge: "icon.png",
      image: payload.data.image,
      body: payload.data.body,
    }
    : {
      badge: "icon.png",
      body: payload.data.body,
    };

  self.registration.showNotification(title, options);
});

// When user clicks notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(href));
});
