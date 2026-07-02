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
      <ol className="mt-2 flex flex-wrap items-center gap-1.5">
        {latestAnswers.map((answer, index) => (
          <li className="contents" key={`${answer.word}-${index}`}>
            <span
              className={`rounded-full border border-border px-4 py-1.5 text-xs font-bold leading-[18px] text-text-primary ${
                index === latestAnswers.length - 1
                  ? 'bg-[#e8fffa]'
                  : 'bg-[#fff1c2]'
              }`}
            >
              {answer.word}
            </span>
            {index < latestAnswers.length - 1 && (
              <span
                aria-hidden="true"
                className="text-sm font-bold leading-[18px] text-text-secondary"
              >
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
