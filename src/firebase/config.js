// src/firebase/config.js
// ------------------------------------------------------------
// IMPORTANT: After you download google-services.json from Firebase
// console, copy the values below from that file.
// ------------------------------------------------------------
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config for project: My OneApp (my-oneapp-f72c0)
const firebaseConfig = {
  apiKey: 'AIzaSyDKYMGCqbcTzddzCzVG-E8Gq8ctPPKOeMI',
  authDomain: 'my-oneapp-f72c0.firebaseapp.com',
  projectId: 'my-oneapp-f72c0',
  storageBucket: 'my-oneapp-f72c0.firebasestorage.app',
  messagingSenderId: '82179915616',
  appId: '1:82179915616:android:1fce214ac2382ad3f4e805',
};

// Prevent duplicate app initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Already initialized
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
