import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { User } from 'firebase/auth';

import {
  DEFAULT_ALLOW_SKIP,
  DEFAULT_GAME_DURATION,
  GAME_DURATIONS
} from '@/constants/game';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { RadioCard } from '@/components/ui/RadioCard';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
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
      setError('Kamu belum siap.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gameId = await createSoloGame(user.uid, settings);
      void navigate(`/bermain/${gameId}`);
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'Gagal bikin permainan, coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Mulai Permainan" />
      <form
        className="flex flex-1 flex-col px-7 pb-10 pt-8"
        onSubmit={(event) => void onSubmit(event)}
      >
        <div>
          <h2 className="text-page-title font-extrabold text-text-primary">
            Pilih durasi ronde
          </h2>
          <p className="mt-1 text-body-copy font-medium text-text-secondary">
            Main singkat, kejar skor terbaikmu.
          </p>
        </div>

        <section className="mt-8 rounded-card border border-border bg-surface-raised p-5 shadow-warm-sm">
          <h3 className="text-sm font-bold leading-5 text-text-secondary">
            Durasi
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <RadioCard
              checked={settings.duration === GAME_DURATIONS[0]}
              className="col-span-2"
              label={`${GAME_DURATIONS[0]} detik`}
              name="duration"
              onChange={() =>
                setSettings((current) => ({
                  ...current,
                  duration: GAME_DURATIONS[0]
                }))
              }
              value={GAME_DURATIONS[0]}
            />
            {GAME_DURATIONS.slice(1).map((duration) => (
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

        <section className="mt-8 flex min-h-32 items-center justify-between gap-4 rounded-card border border-border bg-surface px-5 py-5 shadow-warm-sm">
          <div>
            <h3 className="text-base font-bold leading-5 text-text-primary">
              Izinkan Lewati Kata
            </h3>
            <p className="mt-2 text-caption font-medium text-text-secondary">
              Aktifin kalau mau bisa skip kata yang susah.
            </p>
          </div>
          <ToggleSwitch
            checked={settings.allowSkip}
            label="Izinkan lewati kata"
            onClick={() =>
              setSettings((current) => ({
                ...current,
                allowSkip: !current.allowSkip
              }))
            }
          />
        </section>

        {error && (
          <p className="mt-6 rounded-2xl border border-primary-border-soft bg-primary-soft p-4 text-sm font-bold leading-5 text-primary-pressed">
            {error}
          </p>
        )}

        <div className="mt-auto space-y-4 pt-10">
          <Button
            className="min-h-14 w-full"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Memulai...' : 'Mulai'}
          </Button>
          <Button
            className="w-full"
            onClick={() => void navigate('/')}
            type="button"
            variant="soft"
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
}
