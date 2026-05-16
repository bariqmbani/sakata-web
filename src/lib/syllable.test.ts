import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearSyllableCache, splitWordByLastSyllable } from './syllable';
import type { SyllableApiRequestError } from './syllable';

describe('syllable client', () => {
  afterEach(() => {
    clearSyllableCache();
    vi.restoreAllMocks();
  });

  it('returns normalized syllable data from the worker', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          word: 'makan',
          lastSyllable: 'kan',
          parts: ['ma', 'kan']
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(splitWordByLastSyllable('makan')).resolves.toEqual({
      word: 'makan',
      lastSyllable: 'kan',
      parts: ['ma', 'kan']
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reuses cached results for repeated words', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          word: 'makan',
          lastSyllable: 'kan',
          parts: ['ma', 'kan']
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await splitWordByLastSyllable('makan');
    await splitWordByLastSyllable('makan');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws the worker error message for invalid input', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: 'EMPTY_INPUT',
            message: 'Kata wajib diisi.'
          }),
          { status: 400 }
        )
      )
    );

    await expect(splitWordByLastSyllable('!!!')).rejects.toMatchObject({
      message: 'Kata wajib diisi.',
      status: 400,
      code: 'EMPTY_INPUT'
    } satisfies Partial<SyllableApiRequestError>);
  });
});
