import { React, useState, useEffect, memo, useRef } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import setOnlineStatus from "./setOnlineStatus";

import { Route, useLocation, Redirect } from "react-router-dom";
import { useStateValue } from "./StateProvider";

import CircularProgress from "@material-ui/core/CircularProgress";

import db, {
  auth,
  provider,
  createTimestamp,
  messaging
} from "./firebase";

import { TransitionGroup, Transition, CSSTransition } from "react-transition-group";
import "./App.css";

import useRoomsData from "./useRoomsData";
import scalePage from "./scalePage";
import useFetchData from "./useFetchData.js";


// ---------------------------------------------
// Notification Configuration (compat syntax)
// ---------------------------------------------
const configureNotif = async (docID) => {
  try {
    await messaging?.requestPermission();
    const token = await messaging?.getToken();

    db.collection("users").doc(docID).set({ token }, { merge: true });
  } catch (e) {
    db.collection("users").doc(docID).set({ token: "" }, { merge: true });
  }
};


function App() {
  const [{ user, path, pathID, roomsData, page }, dispatch, actionTypes] = useStateValue();

  const [loader, setLoader] = useState(true);
  const [pwaEvent, setPwaEvent] = useState(undefined);
  const [updating, setUpdating] = useState(false);
  const [checkingVersion, setCheckingVersion] = useState(true);
  const [chats, setChats] = useState(null);
  const [chatsFetched, setChatsFetched] = useState();

  const location = useLocation();
  const [setRoomsData] = useRoomsData();

  const b = useRef([]);
  const menus = ["/rooms", "/search", "/users", "/chats"];


  // -------------------------------------------------
  // Fetch Rooms using compat query
  // -------------------------------------------------
  const roomsQuery = db.collection("rooms").orderBy("timestamp", "desc");

  const [rooms, fetchRooms] = useFetchData(
    30,
    roomsQuery,
    true,
    snap => {
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    "rooms"
  );


  // -------------------------------------------------
  // Fetch Users using compat query
  // -------------------------------------------------
  const usersQuery = db.collection("users").orderBy("timestamp", "desc");

  const [users, fetchUsers] = useFetchData(
    30,
    usersQuery,
    true,
    snap => {
      const arr = [];
      snap.docs.forEach((docx) => {
        if (docx.id !== user?.uid) {
          const id = docx.id > user.uid ? docx.id + user.uid : user.uid + docx.id;
          arr.push({
            ...docx.data(),
            id,
            userID: docx.id
          });
          setRoomsData(docx.id, id);
        }
      });
      return arr;
    },
    "users"
  );


  // -------------------------------------------------
  // Auth Listener
  // -------------------------------------------------
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async authUser => {

      if (authUser) {
        dispatch({ type: actionTypes.SET_USER, user: authUser });
        setLoader(false);

        // Push Notification setup
        if ("serviceWorker" in navigator && "PushManager" in window) {
          configureNotif(authUser.uid);
        }

        // Version check — wrapped in try-catch so Firestore permission errors don't block login
        try {
          const snap = await db.collection("version").doc("version").get();
          const version = snap.data()?.version;
          const prev = localStorage.getItem("version");

          if (prev && version && +prev !== version) {
            localStorage.setItem("version", version);
            setUpdating(true);
            auth.signOut();
            auth.signInWithPopup(provider).catch(e => console.error("Login Error:", e));
          } else {
            if (version) localStorage.setItem("version", version);
            setCheckingVersion(false);
          }
        } catch (e) {
          console.warn("Version check skipped:", e.code);
          setCheckingVersion(false);
        }

        // User doc update
        const userSnap = await db.collection("users").doc(authUser.uid).get();

        if (userSnap.exists && userSnap.data().timestamp) {
          await db.collection("users").doc(authUser.uid).set(
            {
              name: authUser.displayName,
              photoURL: authUser.photoURL
            },
            { merge: true }
          );
        } else {
          await db.collection("users").doc(authUser.uid).set(
            {
              name: authUser.displayName,
              photoURL: authUser.photoURL,
              timestamp: createTimestamp(),
            },
            { merge: true }
          );
        }

      } else {
        dispatch({ type: actionTypes.SET_USER, user: null });
        setLoader(false);

        try {
          const snap = await db.collection("version").doc("version").get();
          const version = snap.data()?.version;
          if (version) localStorage.setItem("version", version);
        } catch (e) {
          console.log("Could not fetch version:", e);
        }
        setCheckingVersion(false);
      }
    });

    return () => unsub();
  }, []);


  // -------------------------------------------------
  // PWA event
  // -------------------------------------------------
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPwaEvent(e);
    });

    window.addEventListener("resize", () => {
      dispatch({ type: "set_scale_page", page: scalePage() });
    });
  }, []);


  // -------------------------------------------------
  // Fetch Chats (compat)
  // -------------------------------------------------
  useEffect(() => {
    if (!user) return;

    const chatsRef = db.collection("users").doc(user.uid).collection("chats");
    const chatsQuery = chatsRef.orderBy("timestamp", "desc");

    const unsub = chatsQuery.onSnapshot(
      { includeMetadataChanges: true },
      snap => {
        if (snap.docs.length > 0) {
          snap.docChanges().forEach(change => {
            if (change.type === "added") {
              setRoomsData(change.doc.data().userID, change.doc.id);
            }
          });

          if (!snap.metadata.fromCache || (!navigator.onLine && snap.metadata.fromCache)) {
            setChats(
              snap.docs.map(cur => ({
                ...cur.data(),
                id: cur.id
              }))
            );
          }
        } else {
          setChats([]);
        }
      }
    );

    fetchRooms(() => null);
    fetchUsers(() => null);

    return () => unsub();
  }, [user]);


  // -------------------------------------------------
  // Wait until all chat rooms have lastMessage
  // -------------------------------------------------
  useEffect(() => {
    if (chats?.length > 0) {
      if (chats.every(c => roomsData[c.id]?.lastMessage)) {
        setChatsFetched(true);
      }
    } else if (chats?.length === 0) {
      setChatsFetched(true);
    }
  }, [chats, roomsData]);


  // -------------------------------------------------
  // Online status
  // -------------------------------------------------
  useEffect(() => {
    if (user) setOnlineStatus(user.uid);
  }, [user]);


  // -------------------------------------------------
  // pathID updater
  // -------------------------------------------------
  useEffect(() => {
    let id = location.pathname.replace("/room/", "");
    menus.forEach(cur => id = id.replace(cur, ""));
    dispatch({ type: "set_path_id", id });
  }, [location.pathname]);


  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------
  return (
    <div className="app" style={{ ...page }}>
      {page.width <= 760 ? <Redirect to="/chats" /> : <Redirect to="/" />}

      {!user && !loader && !checkingVersion && !updating ? (
        <Login />
      ) : user && !updating && chatsFetched ? (
        <div className="app__body">
          <Sidebar
            chats={chats}
            pwa={pwaEvent}
            rooms={rooms}
            fetchRooms={fetchRooms}
            users={users}
            fetchUsers={fetchUsers}
          />

          <TransitionGroup component={null}>
            {page.width <= 760 ? (
              <Transition
                key={location.pathname.replace("/image", "")}
                timeout={260}
              >
                {(state) => (
                  <Route location={location} path={`${path}/room/:roomID`}>
                    <Chat
                      b={b}
                      unreadMessages={
                        chats?.length > 0
                          ? chats.find((c) => c.id === pathID)?.unreadMessages
                          : 0
                      }
                      animState={state}
                    />
                  </Route>
                )}
              </Transition>
            ) : (
              <CSSTransition
                key={location.pathname.replace("/image", "")}
                timeout={1010}
                classNames="page"
              >
                {(state) => (
                  <Route location={location} path={`${path}/room/:roomID`}>
                    <Chat
                      b={b}
                      unreadMessages={
                        chats?.length > 0
                          ? chats.find((c) => c.id === pathID)?.unreadMessages
                          : 0
                      }
                      animState={state}
                    />
                  </Route>
                )}
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
      ) : (
        <div className="loader__container">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default memo(App);
