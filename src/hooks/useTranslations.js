import { useLanguage } from '../context/LanguageContext';
import { en } from '../locales/en';
import { te } from '../locales/te';

const translations = {
  en,
  te,
};

export function useTranslations() {
  const { language } = useLanguage();
  return translations[language];
}
