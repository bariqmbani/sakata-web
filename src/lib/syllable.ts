import type {
  SyllableApiError,
  SyllableApiResult
} from '@/types/syllable.types';

const DEFAULT_SYLLABLE_API_URL =
  'https://sakata-syllable-engine.bariqmbani.workers.dev/api/syllable';

const cache = new Map<string, SyllableApiResult>();

export class SyllableApiRequestError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'SyllableApiRequestError';
    this.status = status;
    this.code = code;
  }
}

export function getSyllableApiUrl(): string {
  return import.meta.env.VITE_SYLLABLE_API_URL || DEFAULT_SYLLABLE_API_URL;
}

export function clearSyllableCache(): void {
  cache.clear();
}

export async function splitWordByLastSyllable(
  word: string
): Promise<SyllableApiResult> {
  const normalizedInput = word.trim().toLowerCase();
  const cached = cache.get(normalizedInput);

  if (cached) {
    return cached;
  }

  const url = new URL(getSyllableApiUrl());
  url.searchParams.set('word', word);

  const response = await fetch(url);
  const payload = (await response.json()) as
    | SyllableApiResult
    | SyllableApiError;

  if (!response.ok || 'error' in payload) {
    throw new SyllableApiRequestError(
      'message' in payload ? payload.message : 'Gagal memecah suku kata.',
      response.status,
      'error' in payload ? payload.error : 'UNKNOWN_ERROR'
    );
  }

  cache.set(normalizedInput, payload);
  return payload;
}

export async function getLastSyllableOf(word: string): Promise<string> {
  const result = await splitWordByLastSyllable(word);
  return result.lastSyllable;
}
