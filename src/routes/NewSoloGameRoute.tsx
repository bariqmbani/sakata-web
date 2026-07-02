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
      <PageHeader title="Mulai Permainan" />
      <form
        className="flex flex-1 flex-col px-7 pb-10 pt-9"
        onSubmit={(event) => void onSubmit(event)}
      >
        <div>
          <h2 className="text-[25px] font-extrabold leading-[31px] text-text-primary">
            Pilih durasi ronde
          </h2>
          <p className="mt-1 text-[15px] font-medium leading-[22px] text-text-secondary">
            Main singkat, kejar skor terbaikmu.
          </p>
        </div>

        <section className="mt-9 rounded-[24px] border border-border bg-surface-raised p-5 shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
          <h3 className="text-sm font-bold leading-[18px] text-text-secondary">
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

        <section className="mt-8 flex min-h-[126px] items-center justify-between gap-5 rounded-[24px] border border-border bg-surface px-5 py-5 shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
          <div>
            <h3 className="text-[17px] font-bold leading-[22px] text-text-primary">
              Izinkan Lewati Kata
            </h3>
            <p className="mt-2 text-[13px] font-medium leading-[18px] text-text-secondary">
              Aktifkan jika kamu ingin bisa melewati kata yang sulit.
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
          <p className="mt-6 rounded-[16px] border border-[#ffc1b4] bg-[#ffe2d9] p-4 text-sm font-bold leading-5 text-primary-pressed">
            {error}
          </p>
        )}

        <div className="mt-auto space-y-4 pt-10">
          <Button
            className="min-h-[60px] w-full"
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
