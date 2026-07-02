type CurrentWordCardProps = {
  word: string;
  syllables: string[];
  requiredSyllable: string;
};

export function CurrentWordCard({
  word,
  syllables,
  requiredSyllable
}: CurrentWordCardProps) {
  const lastIndex = syllables.length - 1;

  return (
    <section className="rounded-panel border border-border bg-surface-raised px-5 py-6 text-center shadow-warm-lg">
      <p className="text-xs font-bold leading-4 text-text-secondary">
        Kata sekarang
      </p>
      <h2 className="mt-2 max-w-full break-words text-game-word font-extrabold text-text-primary">
        {word}
      </h2>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {syllables.map((syllable, index) => (
          <span
            className={`max-w-full break-all rounded-full border px-5 py-2 text-sm font-bold leading-5 ${
              index === lastIndex
                ? 'border-border-strong bg-accent text-text-primary'
                : 'border-primary-border-soft bg-primary-soft text-text-primary'
            }`}
            key={`${syllable}-${index}`}
          >
            {syllable}
          </span>
        ))}
      </div>
      <p className="mt-3 text-caption font-semibold text-text-secondary">
        Mulai dengan suku kata:
      </p>
      <div className="mt-2 inline-flex min-h-12 min-w-32 max-w-full items-center justify-center break-all rounded-full border border-primary-pressed bg-primary px-7 text-required-syllable font-bold text-text-inverse shadow-warm-sm">
        {requiredSyllable}
      </div>
    </section>
  );
}
