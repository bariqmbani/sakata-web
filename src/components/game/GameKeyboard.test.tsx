import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GameKeyboard } from './GameKeyboard';

describe('GameKeyboard', () => {
  it('calls the expected handlers for answer controls', async () => {
    const user = userEvent.setup();
    const onBackspace = vi.fn();
    const onKeyPress = vi.fn();
    const onSkip = vi.fn();
    const onSubmit = vi.fn();

    render(
      <GameKeyboard
        allowSkip
        disabled={false}
        helper="Enter = Kirim di desktop"
        onBackspace={onBackspace}
        onKeyPress={onKeyPress}
        onSkip={onSkip}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Tombol huruf A' }));
    await user.click(screen.getByRole('button', { name: 'Hapus satu huruf' }));
    await user.click(screen.getByRole('button', { name: 'Kirim jawaban' }));
    await user.click(screen.getByRole('button', { name: 'Lewati kata ini' }));

    expect(onKeyPress).toHaveBeenCalledWith('a');
    expect(onBackspace).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('disables skip when skipping is not allowed', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();

    render(
      <GameKeyboard
        allowSkip={false}
        disabled={false}
        helper="Enter = Kirim di desktop"
        onBackspace={vi.fn()}
        onKeyPress={vi.fn()}
        onSkip={onSkip}
        onSubmit={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Lewati kata ini' }));

    expect(onSkip).not.toHaveBeenCalled();
  });
});
