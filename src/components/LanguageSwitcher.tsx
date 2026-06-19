import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 p-2 text-surface-400 hover:text-white transition-colors">
        <Globe className="h-5 w-5" />
        <span className="text-xs font-bold uppercase">{i18n.language.split('-')[0]}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl z-50 overflow-hidden hidden group-hover:block">
        <div className="py-1">
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              i18n.language.startsWith('en') ? 'bg-surface-800 text-white' : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('ja')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              i18n.language.startsWith('ja') ? 'bg-surface-800 text-white' : 'text-surface-400 hover:bg-surface-800/50 hover:text-white'
            }`}
          >
            日本語
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
