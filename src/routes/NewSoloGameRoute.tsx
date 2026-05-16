import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import type { User } from 'firebase/auth';

import {
  DEFAULT_ALLOW_SKIP,
  DEFAULT_GAME_DURATION,
  GAME_DURATIONS
} from '@/constants/game';
import { Button } from '@/components/ui/Button';
import { RadioCard } from '@/components/ui/RadioCard';
import { createSoloGame } from '@/services/game.service';
import type { GameSettings } from '@/types/game.types';

type NewSoloGameRouteProps = {
  user: User | null;
};

export function NewSoloGameRoute({ user }: NewSoloGameRouteProps) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<GameSettings>({
    duration: DEFAULT_GAME_DURATION,
    allowSkip: DEFAULT_ALLOW_SKIP
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError('Pengguna belum siap.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gameId = await createSoloGame(user.uid, settings);
      void navigate(`/bermain/${gameId}`);
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Permainan gagal dibuat.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex min-h-16 items-center gap-3 text-xl font-bold">
        <Link
          aria-label="Kembali"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center"
          to="/"
        >
          <ArrowLeft size={28} />
        </Link>
        <span>Aturan Bermain</span>
      </header>
      <form
        className="mt-4 space-y-10"
        onSubmit={(event) => void onSubmit(event)}
      >
        <section>
          <h2 className="mb-4 text-lg font-bold underline">Durasi Permainan</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {GAME_DURATIONS.map((duration) => (
              <RadioCard
                checked={settings.duration === duration}
                key={duration}
                label={`${duration} detik`}
                name="duration"
                onChange={() =>
                  setSettings((current) => ({
                    ...current,
                    duration
                  }))
                }
                value={duration}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-bold underline">
            Dapat Melewati Kata
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <RadioCard
              checked={settings.allowSkip}
              label="Ya"
              name="allowSkip"
              onChange={() =>
                setSettings((current) => ({ ...current, allowSkip: true }))
              }
              value="yes"
            />
            <RadioCard
              checked={!settings.allowSkip}
              label="Tidak"
              name="allowSkip"
              onChange={() =>
                setSettings((current) => ({ ...current, allowSkip: false }))
              }
              value="no"
            />
          </div>
        </section>
        {error && (
          <p className="border-[3px] border-[#e76e54] bg-white p-4 text-sm text-[#9a3412]">
            {error}
          </p>
        )}
        <Button
          className="w-full sm:w-auto"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Memulai...' : 'Mulai'}
        </Button>
      </form>
    </div>
  );
}
