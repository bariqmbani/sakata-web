import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CornerDownLeft, SkipForward } from 'lucide-react';
import { Navigate, useParams } from 'react-router';

import { GameOverModal } from '@/components/game/GameOverModal';
import { WordDisplay } from '@/components/game/WordDisplay';
import { IconButton } from '@/components/ui/IconButton';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useSoloGame } from '@/hooks/useSoloGame';
import { appendSoloAnswer, finishSoloGame } from '@/services/game.service';
import {
  createAnswer,
  getCurrentGameAnswer,
  getLastSyllableFromAnswer
} from '@/services/game-rules.service';
import { getWordStartsWith } from '@/services/word.service';

export function SoloGameRoute() {
  const { gameId } = useParams();
  const { game, isLoading, error } = useSoloGame(gameId);
  const remaining = useGameTimer(game);
  const [answerWord, setAnswerWord] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const finishRequestedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFinished = game ? remaining <= 0 || game.finishedAtMs !== null : false;

  const currentAnswer = game ? getCurrentGameAnswer(game.answers) : null;
  const currentLastSyllable = currentAnswer
    ? getLastSyllableFromAnswer(currentAnswer)
    : '';

  useEffect(() => {
    if (currentLastSyllable && !answerWord) {
      setAnswerWord(currentLastSyllable);
    }
  }, [answerWord, currentLastSyllable]);

  useEffect(() => {
    if (!game || remaining > 0 || finishRequestedRef.current) {
      return;
    }

    finishRequestedRef.current = true;
    finishSoloGame(game).catch(() => {
      finishRequestedRef.current = false;
    });
    inputRef.current?.blur();
  }, [game, remaining]);

  useEffect(() => {
    if (!isSubmitting && !isFinished) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, isFinished]);

  useEffect(() => {
    if (!alertMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setAlertMessage(''), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [alertMessage]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="panel text-sm font-bold">Memuat permainan</p>
      </div>
    );
  }

  if (error) {
    return <div className="panel text-sm">{error}</div>;
  }

  if (!game || !currentAnswer) {
    return <Navigate to="/bermain" replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!game || isFinished || isSubmitting) {
      return;
    }

    await submitAnswer(answerWord, false);
  }

  async function onSkip() {
    if (!game || isFinished || isSubmitting) {
      return;
    }

    const word = await getWordStartsWith(currentLastSyllable);
    setAnswerWord(word);
    await submitAnswer(word, true);
  }

  async function submitAnswer(word: string, isFromSkip: boolean) {
    if (!game) {
      return;
    }

    setIsSubmitting(true);
    setAlertMessage('');

    try {
      inputRef.current?.classList.remove('animate-shake');

      const answer = await createAnswer(game, word, isFromSkip);
      await appendSoloAnswer(game, answer);

      if (!answer.isCorrect) {
        setAlertMessage(answer.note ?? 'kata tidak valid.');
        setTimeout(() => inputRef.current?.classList.add('animate-shake'), 10);
        return;
      }

      const nextLastSyllable = getLastSyllableFromAnswer(answer);
      setAnswerWord(nextLastSyllable);
    } catch (error_) {
      setAlertMessage(
        error_ instanceof Error ? error_.message : 'Jawaban gagal dikirim.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex flex-1 flex-col">
      {isFinished && <GameOverModal game={game} />}
      <section className="flex flex-1 flex-col items-center justify-center pb-24">
        <h1 className="mb-20 text-6xl font-black tabular-nums">{remaining}</h1>
        <div className="flex w-full items-center justify-center gap-4">
          <WordDisplay syllables={currentAnswer.syllables} />
          {game.settings.allowSkip && (
            <IconButton
              disabled={isFinished || isSubmitting}
              label="Lewati kata"
              onClick={() => void onSkip()}
            >
              <SkipForward size={28} />
            </IconButton>
          )}
        </div>
        <form
          className="mt-16 w-full max-w-sm"
          onSubmit={(event) => void onSubmit(event)}
        >
          <div className="relative">
            <input
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              autoFocus
              className="focus-ring pixel-box w-full bg-white px-4 py-4 pr-16 text-sm font-bold disabled:bg-zinc-200"
              disabled={isFinished || isSubmitting}
              id="answer-word"
              name="answer-word"
              onChange={(event) => setAnswerWord(event.target.value)}
              ref={inputRef}
              spellCheck={false}
              type="text"
              value={answerWord}
            />
            <button
              aria-label="Kirim jawaban"
              className="focus-ring absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center disabled:opacity-50"
              disabled={isFinished || isSubmitting}
              type="submit"
            >
              <CornerDownLeft size={28} />
            </button>
          </div>
        </form>
        {alertMessage && (
          <div className="pixel-box mt-12 bg-[#e76e54] px-5 py-4 text-center text-xs font-bold text-white sm:text-sm">
            {alertMessage}
          </div>
        )}
      </section>
    </div>
  );
}
