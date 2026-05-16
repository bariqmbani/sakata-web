import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  stats: {
    gamesPlayed: number;
    totalCorrectWords: number;
    bestStreak: number;
    averageAccuracy: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
