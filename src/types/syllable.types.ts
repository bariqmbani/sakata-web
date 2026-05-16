export type SyllableApiResult = {
  word: string;
  lastSyllable: string;
  parts: string[];
};

export type SyllableApiError = {
  error: string;
  message: string;
};
