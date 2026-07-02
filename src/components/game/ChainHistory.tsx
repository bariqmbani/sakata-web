import type { GameAnswer } from '@/types/game.types';

type ChainHistoryProps = {
  answers: GameAnswer[];
};

export function ChainHistory({ answers }: ChainHistoryProps) {
  const latestAnswers = answers.filter((answer) => answer.isCorrect).slice(-4);

  if (latestAnswers.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xs font-bold leading-4 text-text-secondary">
        Rantai terbaru
      </h2>
      <div className="relative mt-2 h-9 overflow-hidden">
        <ol className="absolute right-0 top-0 flex flex-nowrap items-center gap-1.5">
          {latestAnswers.map((answer, index) => (
            <li className="contents" key={`${answer.word}-${index}`}>
              <span
                className={`shrink-0 whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-xs font-bold leading-5 text-text-primary ${
                  index === latestAnswers.length - 1
                    ? 'bg-secondary-soft'
                    : 'bg-surface-chip'
                }`}
                title={answer.word}
              >
                {answer.word}
              </span>
              {index < latestAnswers.length - 1 && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-sm font-bold leading-5 text-text-secondary"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
