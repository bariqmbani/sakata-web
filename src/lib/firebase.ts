import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database';

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  rtdb: Database;
};

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

const missingFirebaseKeys = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let services: FirebaseServices | null = null;

export function getMissingFirebaseKeys(): string[] {
  return missingFirebaseKeys;
}

export function isFirebaseConfigured(): boolean {
  return missingFirebaseKeys.length === 0;
}

export function getFirebaseServices(): FirebaseServices {
  if (!isFirebaseConfigured()) {
    throw new Error(
      `Konfigurasi Firebase belum lengkap: ${missingFirebaseKeys.join(', ')}.`
    );
  }

  if (!services) {
    const app = getApps().length > 0 ? getApp() : initializeApp(requiredConfig);
    services = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      rtdb: getDatabase(app)
    };
  }

  return services;
}
