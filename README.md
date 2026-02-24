# 💬 WhatsApp Clone — PWA Chat App

A real-time Progressive Web App (PWA) chat application built with React and Firebase, inspired by WhatsApp's design and functionality.

## ✨ Features

- **Google Authentication** — Sign in with your Google account
- **Real-time Messaging** — Instant text messaging powered by Firebase Firestore
- **Image Sharing** — Send and receive images with compression
- **Voice Messages** — Record and send audio messages
- **Online/Offline Status** — See when users are online in real-time
- **Push Notifications** — Background notifications for new messages
- **Rooms & Direct Messages** — Create group rooms or chat directly with users
- **Seen Indicators** — Know when your messages have been read
- **Typing Indicators** — See when someone is typing
- **PWA Support** — Installable as a native-like app on any device
- **Responsive Design** — Works on desktop and mobile

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 17** | Frontend UI framework |
| **Firebase Firestore** | Real-time NoSQL database |
| **Firebase RTDB** | Presence/online status tracking |
| **Firebase Auth** | Google sign-in authentication |
| **Firebase Storage** | Image and audio file storage |
| **Firebase Cloud Messaging** | Push notifications |
| **Material UI v4** | UI components and icons |
| **Anime.js** | Smooth scroll and chat animations |
| **Compressor.js** | Client-side image compression |

## 📁 Project Structure

```
PWA Chat App/
├── public/
│   ├── firebase-messaging-sw.js   # Service worker for push notifications
│   ├── index.html
│   └── manifest.webmanifest       # PWA manifest
├── src/
│   ├── App.js                     # Main app with auth & routing
│   ├── Chat.js                    # Chat room component
│   ├── ChatFooter.js              # Message input & voice recording
│   ├── Sidebar.js                 # Navigation & chat list
│   ├── SidebarChat.js             # Individual chat list items
│   ├── Login.js                   # Google sign-in page
│   ├── AudioPlayer.js             # Voice message playback
│   ├── ImagePreview.js            # Full-screen image viewer
│   ├── MediaPreview.js            # Image upload preview
│   ├── firebase.js                # Firebase configuration & exports
│   ├── StateProvider.js           # React Context for global state
│   ├── reducer.js                 # State management reducer
│   ├── setOnlineStatus.js         # Online/offline presence tracking
│   ├── useRoomsData.js            # Custom hook for room data
│   ├── useFetchData.js            # Custom hook for paginated data
│   └── recorder.js                # Audio recording utility
├── backend/
│   ├── index.js                   # Express server for notifications
│   └── sendNotif.js               # Push notification sender
└── functions/
    └── index.js                   # Firebase Cloud Functions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- A **Firebase project** with the following enabled:
  - Authentication (Google provider)
  - Firestore Database
  - Realtime Database
  - Storage
  - Cloud Messaging (optional, for push notifications)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Johhannn/Whatsapp_Clone.git
   cd "Whatsapp_Clone/PWA Chat App"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   Update `src/firebase.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Set Firebase Security Rules**

   **Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

   **Realtime Database Rules:**
   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in your browser

### Testing Messaging

To test real-time messaging between two users:
1. Open `http://localhost:3000` in a **normal browser window** — sign in as User A
2. Open `http://localhost:3000` in an **Incognito/Private window** — sign in as User B
3. Click the **Users tab** (👥) in the sidebar → click the other user
4. Send messages — they appear in real-time in both windows!

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Johan T R** — [@Johhannn](https://github.com/Johhannn)
