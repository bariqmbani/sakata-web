import { useEffect, useState } from 'react';

import { loadWords } from '@/services/word.service';

type WordDictionaryState = {
  isLoading: boolean;
  error: string | null;
};

export function useWordDictionary(): WordDictionaryState {
  const [state, setState] = useState<WordDictionaryState>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isActive = true;

    loadWords()
      .then(() => {
        if (isActive) {
          setState({ isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Daftar kata gagal dimuat.'
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
