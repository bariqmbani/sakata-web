import { afterEach, describe, expect, it, vi } from 'vitest';
import { splitLastSyllable } from '@bariqmbani/sakata-syllable-engine';

import { splitWordByLastSyllable } from './syllable';

vi.mock('@bariqmbani/sakata-syllable-engine', () => ({
  splitLastSyllable: vi.fn()
}));

describe('syllable client wrapper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns mapped syllable data from the engine', async () => {
    vi.mocked(splitLastSyllable).mockReturnValue({
      original: 'makan',
      normalized: 'makan',
      prefix: 'ma',
      last: 'kan',
      parts: ['ma', 'kan'],
      ruleId: 'mock-rule',
      source: 'rule'
    });

    await expect(splitWordByLastSyllable('makan')).resolves.toEqual({
      word: 'makan',
      lastSyllable: 'kan',
      parts: ['ma', 'kan']
    });
    expect(splitLastSyllable).toHaveBeenCalledTimes(1);
    expect(splitLastSyllable).toHaveBeenCalledWith('makan');
  });

  it('throws an error for empty input', async () => {
    await expect(splitWordByLastSyllable('   ')).rejects.toThrow(
      'Kata wajib diisi.'
    );
  });

  it('forwards errors from the engine', async () => {
    vi.mocked(splitLastSyllable).mockImplementation(() => {
      throw new Error('Engine error');
    });

    await expect(splitWordByLastSyllable('invalid')).rejects.toThrow(
      'Engine error'
    );
  });
});
