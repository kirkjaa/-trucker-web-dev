"use client";

import { useTransition, useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  locales,
  localeNames,
  localeFlags,
  defaultLocale,
  type Locale,
} from "@/i18n/config";

interface LanguageSwitcherProps {
  collapsed?: boolean;
}

export function LanguageSwitcher({ collapsed = false }: LanguageSwitcherProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Get locale from cookie on mount
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
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    setLocale(newLocale);

    startTransition(() => {
      router.refresh();
    });
  };

  const currentIndex = locales.indexOf(locale);
  const nextLocale = locales[(currentIndex + 1) % locales.length];

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          collapsed && "justify-center"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-neutral-04 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-sidebar-bg-hover transition-colors",
        collapsed && "justify-center",
        isPending && "opacity-50 pointer-events-none"
      )}
      onClick={() => handleLanguageChange(nextLocale)}
      title={`Switch to ${localeNames[nextLocale]}`}
    >
      {/* Globe/Language Icon */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        <span className="text-lg leading-none">{localeFlags[locale]}</span>
      </div>

      {/* Label */}
      {!collapsed && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-08 dark:text-neutral-08 hover:text-secondary-caribbean-green-main transition-colors">
            {localeNames[locale]}
          </span>
          <svg
            className="w-3 h-3 text-neutral-05"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Optional: Dropdown version for more explicit selection
export function LanguageSwitcherDropdown({
  collapsed = false,
}: LanguageSwitcherProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);
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
    if (newLocale === locale) return;

    setCookie("NEXT_LOCALE", newLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    setLocale(newLocale);

    startTransition(() => {
      router.refresh();
    });
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          collapsed && "justify-center"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-neutral-04 animate-pulse" />
      </div>
    );
  }

  if (collapsed) {
    return (
      <div
        className="flex items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-sidebar-bg-hover transition-colors"
        onClick={() => {
          const currentIndex = locales.indexOf(locale);
          const nextLocale = locales[(currentIndex + 1) % locales.length];
          handleLanguageChange(nextLocale);
        }}
        title="Change language"
      >
        <span className="text-lg">{localeFlags[locale]}</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-sidebar-bg-hover transition-colors",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="text-sm text-neutral-08 dark:text-neutral-08">
          {localeNames[locale]}
        </span>
        <svg
          className="w-3 h-3 text-neutral-05 ml-auto"
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
      </div>

      {/* Dropdown menu */}
      <div className="absolute left-0 bottom-full mb-1 w-full bg-white dark:bg-[#2d323b] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-neutral-03 dark:border-[#3d4451]">
        {locales.map((loc) => (
          <div
            key={loc}
            className={cn(
              "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-neutral-02 dark:hover:bg-[#3d4451] first:rounded-t-lg last:rounded-b-lg transition-colors",
              loc === locale && "bg-neutral-02 dark:bg-[#3d4451]"
            )}
            onClick={() => handleLanguageChange(loc)}
          >
            <span className="text-lg">{localeFlags[loc]}</span>
            <span className="text-sm text-neutral-08 dark:text-white">
              {localeNames[loc]}
            </span>
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
          </div>
        ))}
      </div>
    </div>
  );
}
