import { describe, expect, it } from 'vitest';

import { getAuthErrorMessage, isExistingCredentialError } from './auth.service';

describe('auth.service', () => {
  it('maps Firebase auth errors to Indonesian messages', () => {
    expect(
      getAuthErrorMessage({ code: 'auth/admin-restricted-operation' })
    ).toContain('Anonymous Authentication');
    expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe(
      'Akun nggak valid.'
    );
    expect(getAuthErrorMessage({ code: 'auth/popup-closed-by-user' })).toBe(
      'Login dibatalin.'
    );
  });

  it('detects existing credential errors for merge flows', () => {
    expect(
      isExistingCredentialError({ code: 'auth/credential-already-in-use' })
    ).toBe(true);
    expect(
      isExistingCredentialError({
        code: 'auth/account-exists-with-different-credential'
      })
    ).toBe(true);
    expect(isExistingCredentialError({ code: 'auth/invalid-credential' })).toBe(
      false
    );
  });
});
