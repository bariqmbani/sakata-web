type WordDisplayProps = {
  syllables: string[];
};

export function WordDisplay({ syllables }: WordDisplayProps) {
  const lastIndex = syllables.length - 1;

  return (
    <div className="flex flex-wrap items-end justify-center gap-1 text-2xl font-bold sm:text-3xl">
      {syllables.map((syllable, index) => (
        <span
          className={
            index === lastIndex
              ? 'border-b-4 border-dotted border-amber-700 pb-1 text-amber-700'
              : undefined
          }
          key={`${syllable}-${index}`}
        >
          {syllable}
        </span>
      ))}
    </div>
  );
}
