type FeedbackBannerProps = {
  message: string;
  tone: 'success' | 'error';
};

export function FeedbackBanner({ message, tone }: FeedbackBannerProps) {
  const isSuccess = tone === 'success';

  return (
    <div
      aria-live="polite"
      className={`animate-feedback-pop flex min-h-11 items-center gap-3 rounded-2xl border px-4 text-sm font-bold leading-5 ${
        isSuccess
          ? 'border-success-border bg-success-soft text-success-strong'
          : 'border-primary-border-soft bg-primary-soft text-primary-pressed'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-5 w-5 shrink-0 rounded-full ${
          isSuccess ? 'bg-success' : 'bg-error'
        }`}
      />
      <span>{message}</span>
    </div>
  );
}
