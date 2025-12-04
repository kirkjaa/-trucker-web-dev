import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { locales, localeNames, localeFlags, type Locale } from '../i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = i18n.language as Locale;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (locale: Locale) => {
    i18n.changeLanguage(locale);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('settings.language')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="language-switcher__flag">{localeFlags[currentLocale]}</span>
        <span className="language-switcher__name">{localeNames[currentLocale]}</span>
        <span className={`language-switcher__arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="language-switcher__dropdown" role="listbox">
          {locales.map((locale) => (
            <li key={locale}>
              <button
                className={`language-switcher__option ${locale === currentLocale ? 'active' : ''}`}
                onClick={() => changeLanguage(locale)}
                role="option"
                aria-selected={locale === currentLocale}
              >
                <span className="language-switcher__flag">{localeFlags[locale]}</span>
                <span className="language-switcher__name">{localeNames[locale]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSwitcher;

