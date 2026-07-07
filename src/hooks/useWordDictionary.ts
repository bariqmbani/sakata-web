import { useCallback, useEffect, useRef, useState } from 'react';

import { loadWords } from '@/services/word.service';

type WordDictionaryState = {
  isLoading: boolean;
  progress: number;
  error: string | null;
};

export function useWordDictionary(): WordDictionaryState {
  const [state, setState] = useState<WordDictionaryState>({
    isLoading: true,
    progress: 0,
    error: null
  });

  const progressRef = useRef(0);

  const onProgress = useCallback((percent: number) => {
    progressRef.current = percent;
    setState((prev) =>
      percent > prev.progress ? { ...prev, progress: percent } : prev
    );
  }, []);

  useEffect(() => {
    let isActive = true;

    loadWords(onProgress)
      .then(() => {
        if (isActive) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            progress: 100,
            error: null
          }));
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            isLoading: false,
            progress: 0,
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
  }, [onProgress]);

  return state;
}
