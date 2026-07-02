type WordDisplayProps = {
  syllables: string[];
};

export function WordDisplay({ syllables }: WordDisplayProps) {
  const lastIndex = syllables.length - 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {syllables.map((syllable, index) => (
        <span
          className={
            index === lastIndex
              ? 'rounded-full border border-[#ddba5e] bg-accent px-5 py-2 text-sm font-bold leading-[18px] text-text-primary'
              : 'rounded-full border border-[#ffc1b4] bg-[#ffe2d9] px-5 py-2 text-sm font-bold leading-[18px] text-text-primary'
          }
          key={`${syllable}-${index}`}
        >
          {syllable}
        </span>
      ))}
    </div>
  );
}
