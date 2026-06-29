import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'US' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JP' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'SA' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: 'PK' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'CN' },
];

const flagEmoji: Record<string, string> = {
  US: '🇺🇸',
  JP: '🇯🇵',
  SA: '🇸🇦',
  PK: '🇵🇰',
  CN: '🇨🇳',
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => i18n.language.startsWith(l.code)) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && languages.some(l => l.code === savedLang)) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{flagEmoji[currentLang.flag]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl z-[100] overflow-hidden"
          role="listbox"
        >
          <div className="py-1">
            {languages.map((lang) => {
              const isActive = i18n.language.startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-white'
                      : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="text-lg">{flagEmoji[lang.flag]}</span>
                  <span className="flex-1 text-left">
                    <span className="block font-medium">{lang.nativeName}</span>
                    <span className="block text-xs text-surface-500">{lang.name}</span>
                  </span>
                  {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
