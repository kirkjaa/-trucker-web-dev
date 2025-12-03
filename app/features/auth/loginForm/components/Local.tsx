"use client";

import { useEffect, useState, useTransition } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import {
  defaultLocale,
  type Locale,
  localeFlags,
  localeNames,
  locales,
} from "@/i18n/config";
import { cn } from "@/lib/utils";

export default function Local() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    const cookieLocale = getCookie("NEXT_LOCALE") as Locale;
    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocale(cookieLocale);
    }
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setCookie("NEXT_LOCALE", newLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    setLocale(newLocale);
    setIsOpen(false);

    startTransition(() => {
      router.refresh();
    });
  };

  if (!mounted) {
    return (
      <div className="flex justify-end pt-4 pr-4">
        <div className="w-24 h-8 bg-neutral-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex justify-end pt-4 pr-4 relative">
      <button
        className={cn(
          "flex gap-2 items-center px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors",
          isPending && "opacity-50 pointer-events-none"
        )}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="text-2xl">{localeFlags[locale]}</span>
        <p className="body1">{localeNames[locale]}</p>
        <svg
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-4 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 min-w-[140px]">
          {locales.map((loc) => (
            <button
              key={loc}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 first:rounded-t-lg last:rounded-b-lg transition-colors",
                loc === locale && "bg-neutral-100"
              )}
              onClick={() => handleLanguageChange(loc)}
              type="button"
            >
              <span className="text-xl">{localeFlags[loc]}</span>
              <span className="text-sm">{localeNames[loc]}</span>
              {loc === locale && (
                <svg
                  className="w-4 h-4 text-secondary-caribbean-green-main ml-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
