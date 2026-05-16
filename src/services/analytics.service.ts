import { logEvent } from 'firebase/analytics';

import { getFirebaseServices } from '@/lib/firebase';
import type { GameSettings } from '@/types/game.types';

export function logHomeView() {
  const { analytics } = getFirebaseServices();
  if (!analytics) return;

  logEvent(analytics, 'home_view');
}

export function logHowToPlayView() {
  const { analytics } = getFirebaseServices();
  if (!analytics) return;

  logEvent(analytics, 'how_to_play_view');
}

export function logGameStart(settings: GameSettings) {
  const { analytics } = getFirebaseServices();
  if (!analytics) return;

  logEvent(analytics, 'game_start', {
    duration_setting: settings.duration,
    allow_skip: settings.allowSkip
  });
}

export function logGameComplete(
  score: number,
  accuracy: number,
  performance: string,
  playtimeSeconds: number
) {
  const { analytics } = getFirebaseServices();
  if (!analytics) return;

  logEvent(analytics, 'game_complete', {
    score,
    accuracy,
    performance,
    playtime_seconds: playtimeSeconds
  });
}

export function logWordSubmitted(isCorrect: boolean, isFromSkip: boolean) {
  const { analytics } = getFirebaseServices();
  if (!analytics) return;

  logEvent(analytics, 'word_submitted', {
    is_correct: isCorrect,
    is_skipped: isFromSkip
  });
}
