import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import {
  getFirestore,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0Xr9BHuVg3g0HX_1RiDp3i4ilKXsGggQ",
  authDomain: "chathura-gym.firebaseapp.com",
  projectId: "chathura-gym",
  storageBucket: "chathura-gym.appspot.com",
  messagingSenderId: "280835109480",
  appId: "1:280835109480:web:8ae6d2050bf9e2a97901dd",
  measurementId: "G-TYLS33E9R6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {
  storage,
  auth,
  app,
  db,
  collection,
  setDoc,
  getDoc,
  addDoc,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
};
