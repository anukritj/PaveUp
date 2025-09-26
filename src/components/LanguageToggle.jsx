import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'en' ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('te')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'te' ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        తెలుగు
      </button>
    </div>
  );
}
