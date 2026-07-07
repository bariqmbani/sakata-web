import { EXCLUDED_FIRST_WORDS } from '@/constants/game';

const GENERATED_WORD_PATTERN = /^[a-z-]+$/i;
const excludedFirstWords = new Set<string>(EXCLUDED_FIRST_WORDS);

let wordsPromise: Promise<string[]> | null = null;
let wordSet: Set<string> | null = null;

export async function loadWords(
  onProgress?: (percent: number) => void
): Promise<string[]> {
  if (!wordsPromise) {
    wordsPromise = fetch('/data/words.json').then(async (response) => {
      if (!response.ok) {
        throw new Error('Daftar kata gagal dimuat.');
      }

      const contentLength = Number(response.headers.get('content-length')) || 0;
      const reader = response.body?.getReader();

      if (!reader) {
        onProgress?.(100);
        const words = (await response.json()) as string[];
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
      const text = new TextDecoder().decode(merged);
      const words = JSON.parse(text) as string[];
      wordSet = new Set(words);
      return words;
    });
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
