import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

import { isFirebaseConfigured } from '@/lib/firebase';
import {
  ensureAnonymousUser,
  getAuthErrorMessage,
  subscribeToAuth
} from '@/services/auth.service';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }

    let isActive = true;
    const unsubscribe = subscribeToAuth((user) => {
      if (isActive) {
        setState({ user, isLoading: false, error: null });
      }
    });

    ensureAnonymousUser().catch((error: unknown) => {
      if (isActive) {
        setState({
          user: null,
          isLoading: false,
          error: getAuthErrorMessage(error)
        });
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  return state;
}
