import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const e = import.meta.env;
const c = {
  apiKey: e.VITE_FIREBASE_API_KEY,
  authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: e.VITE_FIREBASE_PROJECT_ID,
  appId: e.VITE_FIREBASE_APP_ID,
};
// If .env is not filled, site still works using defaults from config.js
export const configured = !!(c.apiKey && c.projectId);
const app = configured ? initializeApp(c) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
