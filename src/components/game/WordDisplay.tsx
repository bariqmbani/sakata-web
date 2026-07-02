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
              ? 'max-w-full break-all rounded-full border border-border-strong bg-accent px-5 py-2 text-sm font-bold leading-5 text-text-primary'
              : 'max-w-full break-all rounded-full border border-primary-border-soft bg-primary-soft px-5 py-2 text-sm font-bold leading-5 text-text-primary'
          }
          key={`${syllable}-${index}`}
        >
          {syllable}
        </span>
      ))}
    </div>
  );
}
