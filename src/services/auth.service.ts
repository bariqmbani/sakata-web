import {
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type Auth,
  type AuthCredential,
  type Unsubscribe,
  type User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';

import { getFirebaseServices } from '@/lib/firebase';
import type { UserProfile } from '@/types/user.types';

export function subscribeToAuth(
  onChange: (user: User | null) => void
): Unsubscribe {
  const { auth } = getFirebaseServices();
  return onAuthStateChanged(auth, onChange);
}

export async function ensureAnonymousUser(): Promise<User> {
  const { auth } = getFirebaseServices();
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;

  await ensureUserProfile(user);
  return user;
}

export async function ensureUserProfile(user: User): Promise<void> {
  const { db } = getFirebaseServices();
  const profileRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    await updateDoc(profileRef, {
      displayName: getDisplayName(user),
      isAnonymous: user.isAnonymous,
      updatedAt: serverTimestamp()
    });
    return;
  }

  const profile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
    uid: user.uid,
    displayName: getDisplayName(user),
    isAnonymous: user.isAnonymous,
    stats: {
      gamesPlayed: 0,
      totalCorrectWords: 0,
      bestStreak: 0,
      averageAccuracy: 0
    }
  };

  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function linkAnonymousUser(
  auth: Auth,
  credential: AuthCredential
): Promise<User> {
  if (!auth.currentUser) {
    throw new Error('Pengguna belum masuk.');
  }

  return (await linkWithCredential(auth.currentUser, credential)).user;
}

export function makeGoogleCredential(idToken: string): AuthCredential {
  return GoogleAuthProvider.credential(idToken);
}

export async function logout(): Promise<void> {
  const { auth } = getFirebaseServices();
  await signOut(auth);
}

function getDisplayName(user: User): string {
  return user.displayName || (user.isAnonymous ? 'Pemain Tamu' : 'Pemain');
}
