import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router';

import { AnswerDisplay } from '@/components/game/AnswerDisplay';
import { FeedbackBanner } from '@/components/game/FeedbackBanner';
import { GameKeyboard } from '@/components/game/GameKeyboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameStatusBar } from '@/components/game/GameStatusBar';
import { TimerBar } from '@/components/game/TimerBar';
import { WordChain } from '@/components/game/WordChain';
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
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const [isInvalidAnswer, setIsInvalidAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const finishRequestedRef = useRef(false);

  const isFinished = game
    ? remaining <= 0 || game.finishedAtMs !== null
    : false;

  const currentAnswer = game ? getCurrentGameAnswer(game.answers) : null;
  const currentLastSyllable = currentAnswer
    ? getLastSyllableFromAnswer(currentAnswer)
    : '';
  const combo = game ? getCurrentCombo(game.answers) : 0;

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
  }, [game, remaining]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const clearAnswer = useCallback(() => {
    setAnswerWord(currentLastSyllable);
  }, [currentLastSyllable]);

  const appendLetter = useCallback(
    (letter: string) => {
      if (isFinished || isSubmitting) {
        return;
      }

      setAnswerWord((current) => `${current}${letter}`);
    },
    [isFinished, isSubmitting]
  );

  const deleteLetter = useCallback(() => {
    if (isFinished || isSubmitting) {
      return;
    }

    setAnswerWord((current) =>
      current.length <= currentLastSyllable.length
        ? currentLastSyllable
        : current.slice(0, -1)
    );
  }, [currentLastSyllable, isFinished, isSubmitting]);

  const submitAnswer = useCallback(
    async (word: string, isFromSkip: boolean) => {
      if (!game) {
        return;
      }

      setIsSubmitting(true);
      setFeedback(null);
      setIsInvalidAnswer(false);

      try {
        const answer = await createAnswer(game, word, isFromSkip);
        await appendSoloAnswer(game, answer);

        if (!answer.isCorrect) {
          setFeedback({
            message: answer.note ?? 'kata tidak valid.',
            tone: 'error'
          });
          setTimeout(() => setIsInvalidAnswer(true), 10);
          return;
        }

        const nextLastSyllable = getLastSyllableFromAnswer(answer);
        setAnswerWord(nextLastSyllable);
        setFeedback({
          message: isFromSkip
            ? 'Kata dilewati. Rantai lanjut.'
            : 'Benar! Kata masuk ke rantai.',
          tone: 'success'
        });
      } catch (error_) {
        setFeedback({
          message:
            error_ instanceof Error ? error_.message : 'Jawaban gagal dikirim.',
          tone: 'error'
        });
        setTimeout(() => setIsInvalidAnswer(true), 10);
      } finally {
        setIsSubmitting(false);
        window.setTimeout(() => setIsInvalidAnswer(false), 350);
      }
    },
    [game]
  );

  const submitCurrentAnswer = useCallback(async () => {
    if (!game || isFinished || isSubmitting) {
      return;
    }

    await submitAnswer(answerWord, false);
  }, [answerWord, game, isFinished, isSubmitting, submitAnswer]);

  const skipCurrentWord = useCallback(async () => {
    if (!game || isFinished || isSubmitting) {
      return;
    }

    const word = await getWordStartsWith(currentLastSyllable);
    setAnswerWord(word);
    await submitAnswer(word, true);
  }, [currentLastSyllable, game, isFinished, isSubmitting, submitAnswer]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isFinished || isSubmitting) {
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        appendLetter(event.key.toLowerCase());
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLetter();
        return;
      }

      if (event.key === 'Enter') {
        // Enter must still activate whatever control has focus, or the on-screen
        // keyboard is unusable for anyone navigating by keyboard.
        const target = event.target as HTMLElement | null;

        if (target?.closest('a[href], button, [role="button"]')) {
          return;
        }

        event.preventDefault();
        void submitCurrentAnswer();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        clearAnswer();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    appendLetter,
    clearAnswer,
    deleteLetter,
    isFinished,
    isSubmitting,
    submitCurrentAnswer
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-7">
        <p className="rounded-control border border-border bg-surface px-5 py-4 text-sm font-bold shadow-warm-sm">
          Menyiapkan kata...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-7">
        <FeedbackBanner message={error} tone="error" />
      </div>
    );
  }

  if (!game || !currentAnswer) {
    return <Navigate to="/bermain" replace />;
  }

  return (
    <div className="relative flex h-[100dvh] min-h-0 w-full flex-none flex-col overflow-hidden sm:h-[844px]">
      {isFinished && <GameOverModal game={game} />}
      <h1 className="sr-only">Permainan Sa-Kata sedang berlangsung</h1>
      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-5"
        inert={isFinished}
      >
        <div className="shrink-0">
          <GameStatusBar
            combo={combo}
            remaining={remaining}
            score={game.score}
          />
          <div className="mt-2">
            <TimerBar duration={game.settings.duration} remaining={remaining} />
          </div>
        </div>
        {/* mt-auto rather than justify-end: keeps the chain next to the answer
            field while staying scrollable once it outgrows the space. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-1">
          <div className="mt-auto pt-3">
            <WordChain answers={game.answers} />
          </div>
        </div>
        <div className="shrink-0 pt-3">
          <div className="min-h-11">
            {feedback && (
              <FeedbackBanner message={feedback.message} tone={feedback.tone} />
            )}
          </div>
          <div className="mt-3">
            <AnswerDisplay
              answer={answerWord}
              disabled={isFinished || isSubmitting}
              helper={`Mulai dengan "${currentLastSyllable}"`}
              isInvalid={isInvalidAnswer}
              onClear={clearAnswer}
            />
          </div>
        </div>
        <div className="shrink-0 pt-3">
          <GameKeyboard
            allowSkip={game.settings.allowSkip}
            disabled={isFinished || isSubmitting}
            helper="Enter = Kirim di desktop"
            onBackspace={deleteLetter}
            onKeyPress={appendLetter}
            onSkip={() => void skipCurrentWord()}
            onSubmit={() => void submitCurrentAnswer()}
          />
        </div>
      </section>
    </div>
  );
}

function getCurrentCombo(
  answers: { isAutoGenerated: boolean; isCorrect: boolean }[]
) {
  let combo = 0;

  for (let index = answers.length - 1; index >= 0; index -= 1) {
    const answer = answers[index];

    if (!answer || answer.isAutoGenerated) {
      continue;
    }

    if (!answer.isCorrect) {
      break;
    }

    combo += 1;
  }

  return combo;
}
