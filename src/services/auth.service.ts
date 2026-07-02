import {
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
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

export function subscribeToUserProfile(
  uid: string,
  onChange: (profile: UserProfile | null) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const { db } = getFirebaseServices();

  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      onChange(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
    },
    onError
  );
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

export async function linkCurrentUserWithGoogle(): Promise<User> {
  const { auth } = getFirebaseServices();

  if (!auth.currentUser) {
    throw new Error('Pengguna belum masuk.');
  }

  const result = await linkWithPopup(auth.currentUser, createGoogleProvider());
  await ensureUserProfile(result.user);
  return result.user;
}

export async function signInWithGoogle(): Promise<User> {
  const { auth } = getFirebaseServices();
  const result = await signInWithPopup(auth, createGoogleProvider());
  await ensureUserProfile(result.user);
  return result.user;
}

export async function updateCurrentUserDisplayName(
  displayName: string
): Promise<User> {
  const { auth } = getFirebaseServices();
  const normalizedDisplayName = displayName.trim();

  if (!auth.currentUser) {
    throw new Error('Pengguna belum masuk.');
  }

  if (!normalizedDisplayName) {
    throw new Error('Nama pemain wajib diisi.');
  }

  await updateProfile(auth.currentUser, { displayName: normalizedDisplayName });
  await ensureUserProfile(auth.currentUser);
  return auth.currentUser;
}

export async function logout(): Promise<void> {
  const { auth } = getFirebaseServices();
  await signOut(auth);
}

export function isExistingCredentialError(error: unknown): boolean {
  const code = getFirebaseErrorCode(error);
  return (
    code === 'auth/credential-already-in-use' ||
    code === 'auth/account-exists-with-different-credential'
  );
}

export function getAuthErrorMessage(error: unknown): string {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case 'auth/admin-restricted-operation':
      return 'Anonymous Authentication belum diaktifkan di Firebase.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Proses masuk dibatalkan.';
    case 'auth/operation-not-allowed':
      return 'Metode masuk ini belum diaktifkan di Firebase.';
    case 'auth/credential-already-in-use':
    case 'auth/account-exists-with-different-credential':
      return 'Akun sudah ada. Masuk untuk menggabungkan progres.';
    case 'auth/invalid-credential':
      return 'Kredensial akun tidak valid.';
    case 'auth/provider-already-linked':
      return 'Metode masuk ini sudah terhubung.';
    case 'auth/requires-recent-login':
      return 'Silakan masuk ulang sebelum mengubah akun.';
    default:
      return error instanceof Error ? error.message : 'Aksi akun gagal.';
  }
}

function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

function getFirebaseErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const { code } = error;
  return typeof code === 'string' ? code : null;
}

function getDisplayName(user: User): string {
  return user.displayName || (user.isAnonymous ? 'Pemain Tamu' : 'Pemain');
}
