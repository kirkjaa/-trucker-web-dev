export const locales = ["th", "en", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";

export const localeNames: Record<Locale, string> = {
  th: "ไทย",
  en: "English",
  ko: "한국어",
};

export const localeFlags: Record<Locale, string> = {
  th: "🇹🇭",
  en: "🇺🇸",
  ko: "🇰🇷",
};
