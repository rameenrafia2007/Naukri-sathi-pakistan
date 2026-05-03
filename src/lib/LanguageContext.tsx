import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  lang: 'en' | 'ur';
  toggleLang: () => void;
  t: (en: string, ur: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'en' | 'ur'>('ur');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang(l => (l === 'en' ? 'ur' : 'en'));

  const t = (en: string, ur: string) => (lang === 'ur' ? ur : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
