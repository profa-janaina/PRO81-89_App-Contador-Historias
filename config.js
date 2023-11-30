import { initializeApp, firebase } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence, signOut, signInWithEmailAndPassword } from "firebase/auth";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import "firebase/database";

// Your web app's Firebase configuration
//    >> USE YOUR CREDENTIALS <<
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

  // Initialize Firebase
  export const db = initializeApp(firebaseConfig);
  export const auth = getAuth(db);
  // export const auth = initializeAuth(db, {
  //   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  // });
  