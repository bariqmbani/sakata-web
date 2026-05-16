import { splitLastSyllable } from '@bariqmbani/sakata-syllable-engine';
import type { SyllableApiResult } from '@/types/syllable.types';

export function splitWordByLastSyllable(
  word: string
): Promise<SyllableApiResult> {
  const normalizedInput = word.trim().toLowerCase();
  
  if (!normalizedInput) {
    return Promise.reject(new Error('Kata wajib diisi.'));
  }

  try {
    const result = splitLastSyllable(normalizedInput);
    return Promise.resolve({
      word: result.original,
      lastSyllable: result.last,
      parts: result.parts
    });
  } catch (error) {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

export async function getLastSyllableOf(word: string): Promise<string> {
  const result = await splitWordByLastSyllable(word);
  return result.lastSyllable;
}
