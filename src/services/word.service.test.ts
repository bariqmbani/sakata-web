import { afterEach, describe, expect, it } from 'vitest';

import {
  getRandomWord,
  getWordStartsWith,
  isEligibleGeneratedWord,
  isWordExists,
  resetWordsForTest,
  setWordsForTest
} from './word.service';

describe('word.service', () => {
  afterEach(() => {
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
});
