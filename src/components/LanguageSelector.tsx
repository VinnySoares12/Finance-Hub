import { useI18n } from '../i18n';
import type { Language } from '../i18n';

const languages: Array<{ code: Language; label: string }> = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

function Flag({ language }: { language: Language }) {
  if (language === 'pt') {
    return (
      <svg viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#229E45" />
        <path d="M14 3 24 10 14 17 4 10Z" fill="#F8DF3E" />
        <circle cx="14" cy="10" r="4" fill="#2B49A3" />
      </svg>
    );
  }

  if (language === 'en') {
    return (
      <svg viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#fff" />
        {[0, 4, 8, 12, 16].map((y) => <rect key={y} y={y} width="28" height="2" fill="#C9353D" />)}
        <rect width="12" height="11" fill="#28457C" />
        <g fill="#fff">
          <circle cx="2.5" cy="2.5" r=".7" />
          <circle cx="6" cy="2.5" r=".7" />
          <circle cx="9.5" cy="2.5" r=".7" />
          <circle cx="4.2" cy="5.5" r=".7" />
          <circle cx="7.8" cy="5.5" r=".7" />
          <circle cx="2.5" cy="8.5" r=".7" />
          <circle cx="6" cy="8.5" r=".7" />
          <circle cx="9.5" cy="8.5" r=".7" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#AA151B" />
      <rect y="5" width="28" height="10" fill="#F1BF00" />
      <rect x="7" y="8" width="2.5" height="5" rx=".5" fill="#AA151B" />
    </svg>
  );
}

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="language-selector" aria-label="Language">
      {languages.map((item) => (
        <button
          className={language === item.code ? 'is-active' : ''}
          type="button"
          key={item.code}
          onClick={() => setLanguage(item.code)}
          aria-label={item.label}
          title={item.label}
        >
          <Flag language={item.code} />
        </button>
      ))}
    </div>
  );
}
