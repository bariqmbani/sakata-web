import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '@/constants/storage';

import {
  getRandomWord,
  getWordStartsWith,
  isEligibleGeneratedWord,
  isWordExists,
  loadWords,
  resetWordsForTest,
  setWordsForTest
} from './word.service';

function mockResponse({
  ok = true,
  json
}: {
  ok?: boolean;
  json?: unknown;
}): Response {
  return {
    ok,
    body: null,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: vi.fn().mockResolvedValue(json)
  } as unknown as Response;
}

describe('word.service', () => {
  beforeEach(() => {
    localStorage.clear();
    resetWordsForTest();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    resetWordsForTest();
  });

  it('checks words against the loaded dictionary', async () => {
    setWordsForTest(['makan', 'kandidat']);

    await expect(isWordExists('makan')).resolves.toBe(true);
    await expect(isWordExists('hilang')).resolves.toBe(false);
  });

  it('filters generated words using legacy rules', () => {
    expect(isEligibleGeneratedWord('makan')).toBe(true);
    expect(isEligibleGeneratedWord('strok')).toBe(false);
    expect(isEligibleGeneratedWord('aa')).toBe(false);
    expect(isEligibleGeneratedWord('a tempo')).toBe(false);
    expect(isEligibleGeneratedWord('a.lar')).toBe(false);
  });

  it('selects words by starting syllable and falls back to any random word', async () => {
    setWordsForTest(['makan', 'kandidat', 'datar']);

    await expect(getWordStartsWith('kan')).resolves.toBe('kandidat');
    await expect(getRandomWord()).resolves.toMatch(/makan|kandidat|datar/);
  });

  it('retries after a transient dictionary loading failure', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse({ ok: false }))
      .mockResolvedValueOnce(mockResponse({ ok: false }))
      .mockResolvedValueOnce(mockResponse({ ok: false }))
      .mockResolvedValueOnce(
        mockResponse({ json: ['makan', 'kandidat'] })
      );

    vi.stubGlobal('fetch', fetchMock);

    await expect(loadWords()).rejects.toThrow(
      'Daftar kata gagal dimuat.'
    );
    await expect(loadWords()).resolves.toEqual(['makan', 'kandidat']);

    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('uses cached words when the version file is unavailable', async () => {
    localStorage.setItem(
      STORAGE_KEYS.WORDS_DATA,
      JSON.stringify(['makan', 'kandidat'])
    );
    localStorage.setItem(STORAGE_KEYS.WORDS_VERSION, 'cached-version');

    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'));

    vi.stubGlobal('fetch', fetchMock);

    await expect(loadWords()).resolves.toEqual(['makan', 'kandidat']);
    await expect(isWordExists('makan')).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('/data/words.version.json');
  });
});
