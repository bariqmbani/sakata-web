type FeedbackBannerProps = {
  message: string;
  tone: 'success' | 'error';
};

export function FeedbackBanner({ message, tone }: FeedbackBannerProps) {
  const isSuccess = tone === 'success';

  return (
    <div
      aria-live="polite"
      className={`animate-feedback-pop flex min-h-[42px] items-center gap-3 rounded-[16px] border px-4 text-sm font-bold leading-[18px] ${
        isSuccess
          ? 'border-[#a8ebc8] bg-[#e8fff4] text-[#116b45]'
          : 'border-[#ffc1b4] bg-[#ffe2d9] text-primary-pressed'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-[18px] w-[18px] rounded-full ${
          isSuccess ? 'bg-success' : 'bg-error'
        }`}
      />
      <span>{message}</span>
    </div>
  );
}
