import { EXCLUDED_FIRST_WORDS } from '@/constants/game';
import { STORAGE_KEYS } from '@/constants/storage';

const GENERATED_WORD_PATTERN = /^[a-z-]+$/i;
const excludedFirstWords = new Set<string>(EXCLUDED_FIRST_WORDS);

let wordsPromise: Promise<string[]> | null = null;
let wordSet: Set<string> | null = null;

function getCachedWords(): { data: string[]; version: string } | null {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.WORDS_VERSION);
    const raw = localStorage.getItem(STORAGE_KEYS.WORDS_DATA);
    if (!version || !raw) return null;
    return { data: JSON.parse(raw) as string[], version };
  } catch {
    return null;
  }
}

function setCachedWords(words: string[], version: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS_DATA, JSON.stringify(words));
    localStorage.setItem(STORAGE_KEYS.WORDS_VERSION, version);
  } catch {
    // localStorage full or disabled — silently ignore
  }
}

async function computeHash(data: ArrayBuffer | Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function loadWords(
  onProgress?: (percent: number) => void
): Promise<string[]> {
  if (!wordsPromise) {
    wordsPromise = (async () => {
      const cached = getCachedWords();

      // Fetch version file (~60 bytes) — if missing, skip cache
      let hash: string | null = null;
      try {
        const versionRes = await fetch('/data/words.version.json');
        if (versionRes.ok) {
          const contentType = versionRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const versionData = (await versionRes.json()) as { hash?: string };
            hash = versionData.hash ?? null;
          }
        }
      } catch {
        // Version file unavailable — proceed without cache
      }

      // Cache hit — version matches
      if (hash && cached && cached.version === hash) {
        wordSet = new Set(cached.data);
        return cached.data;
      }

      // Cache miss — download full data
      const dataRes = await fetch('/data/words.json');
      if (!dataRes.ok) {
        throw new Error('Daftar kata gagal dimuat.');
      }

      const contentLength =
        Number(dataRes.headers.get('content-length')) || 0;
      const reader = dataRes.body?.getReader();

      if (!reader) {
        onProgress?.(100);
        const words = (await dataRes.json()) as string[];
        if (hash) {
          const actualHash = await computeHash(
            new TextEncoder().encode(JSON.stringify(words))
          );
          if (actualHash !== hash) {
            throw new Error('Data kata tidak valid.');
          }
        }
        if (hash) setCachedWords(words, hash);
        wordSet = new Set(words);
        return words;
      }

      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength > 0) {
          onProgress?.(Math.round((received / contentLength) * 100));
        }
      }

      onProgress?.(100);
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }

      const actualHash = await computeHash(merged);
      if (hash && actualHash !== hash) {
        throw new Error('Data kata tidak valid.');
      }

      const text = new TextDecoder().decode(merged);
      const words = JSON.parse(text) as string[];
      if (hash) setCachedWords(words, hash);
      wordSet = new Set(words);
      return words;
    })();
  }

  return wordsPromise;
}

export function setWordsForTest(words: string[]): void {
  wordsPromise = Promise.resolve(words);
  wordSet = new Set(words);
}

export function resetWordsForTest(): void {
  wordsPromise = null;
  wordSet = null;
}

export async function isWordExists(word: string): Promise<boolean> {
  await loadWords();
  return wordSet?.has(word.trim().toLowerCase()) ?? false;
}

export function isEligibleGeneratedWord(word: string): boolean {
  return (
    !excludedFirstWords.has(word) &&
    word.length >= 5 &&
    GENERATED_WORD_PATTERN.test(word) &&
    /^[a-z]/i.test(word.charAt(0))
  );
}

export async function getRandomWord(): Promise<string> {
  const words = await loadWords();
  const filtered = words.filter(isEligibleGeneratedWord);
  return pickRandomWord(filtered);
}

export async function getWordStartsWith(startsWith: string): Promise<string> {
  const words = await loadWords();
  const filtered = words.filter((word) => {
    return isEligibleGeneratedWord(word) && word.startsWith(startsWith);
  });

  return filtered.length > 0 ? pickRandomWord(filtered) : getRandomWord();
}

function pickRandomWord(words: string[]): string {
  if (words.length === 0) {
    throw new Error('Tidak ada kata yang tersedia.');
  }

  const word = words[Math.floor(Math.random() * words.length)];

  if (!word) {
    throw new Error('Tidak ada kata yang tersedia.');
  }

  return word;
}
