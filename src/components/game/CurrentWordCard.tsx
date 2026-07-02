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
    <section className="rounded-[28px] border border-border bg-surface-raised px-5 py-7 text-center shadow-[0_8px_9px_rgba(139,94,0,0.18)]">
      <p className="text-xs font-bold leading-4 text-text-secondary">
        Kata sekarang
      </p>
      <h2 className="mt-3 text-[38px] font-extrabold leading-[44px] text-text-primary">
        {word}
      </h2>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {syllables.map((syllable, index) => (
          <span
            className={`rounded-full border px-5 py-2 text-sm font-bold leading-[18px] ${
              index === lastIndex
                ? 'border-[#ddba5e] bg-accent text-text-primary'
                : 'border-[#ffc1b4] bg-[#ffe2d9] text-text-primary'
            }`}
            key={`${syllable}-${index}`}
          >
            {syllable}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[13px] font-semibold leading-[18px] text-text-secondary">
        Mulai dengan suku kata:
      </p>
      <div className="mt-3 inline-flex min-h-11 min-w-[120px] items-center justify-center rounded-full border border-primary-pressed bg-primary px-7 text-[25px] font-bold leading-[30px] text-text-inverse shadow-[0_4px_5px_rgba(139,94,0,0.14)]">
        {requiredSyllable}
      </div>
    </section>
  );
}
