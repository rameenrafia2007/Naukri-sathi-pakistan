import { Briefcase, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { useState } from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'onboarding' | 'dashboard') => void;
}

export const Navbar = ({ onNavigate }: NavbarProps) => {
  const { lang, toggleLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navigate = (view: 'home' | 'onboarding' | 'dashboard') => {
    setIsOpen(false);
    onNavigate(view);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-20 px-4 md:px-12 flex items-center justify-between border-b border-slate-700/50 bg-[#0F172A]/80 backdrop-blur-md">
      <div 
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => navigate('home')}
      >
        <div className="bg-blue-600 p-2 rounded-lg">
          <Briefcase className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="block text-xl font-bold leading-none tracking-tight">Naukri Saathi</span>
          <span className="block text-sm font-medium text-blue-400 font-urdu leading-none mt-1">نوکری ساتھی</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium opacity-80">
        <button onClick={() => navigate('home')} className="hover:opacity-100 transition-opacity">Home</button>
        <button onClick={() => scrollTo('how-it-works')} className="hover:opacity-100 transition-opacity">How It Works</button>
        <button onClick={() => scrollTo('success-stories')} className="hover:opacity-100 transition-opacity">Success Stories</button>
        <div className="flex items-center space-x-2 border-l border-slate-700 pl-8 cursor-pointer" onClick={toggleLang}>
          <span className={lang === 'ur' ? "text-amber-500 font-urdu" : ""}>اردو</span>
          <span className="opacity-40">/</span>
          <span className={lang === 'en' ? "text-amber-500" : ""}>English</span>
        </div>
      </div>

      <div className="hidden md:block">
        <button 
          onClick={() => navigate('onboarding')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-amber-500/20 urdu-text flex items-center justify-center leading-none"
        >
          {lang === 'ur' ? 'اپنا سفر شروع کریں' : 'Start Your Journey'}
        </button>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleLang}>
            <span className={lang === 'ur' ? "text-amber-500 font-urdu text-xs" : "text-xs"}>UR</span>
            <span className="opacity-40 text-xs">/</span>
            <span className={lang === 'en' ? "text-amber-500 text-xs" : "text-xs"}>EN</span>
        </div>
        <button 
          className="p-2 text-slate-300 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer touch-manipulation z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0F172A] border-b border-slate-700 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300">
           <button onClick={() => navigate('home')} className="text-left font-bold text-lg">Home</button>
           <button onClick={() => scrollTo('how-it-works')} className="text-left font-bold text-lg">How It Works</button>
           <button onClick={() => scrollTo('success-stories')} className="text-left font-bold text-lg">Success Stories</button>
           <button 
            onClick={() => navigate('onboarding')}
            className="bg-amber-500 text-slate-900 font-black py-4 rounded-2xl text-center urdu-text"
           >
             {lang === 'ur' ? 'اپنا سفر شروع کریں' : 'Start Your Journey'}
           </button>
        </div>
      )}
    </nav>
  );
};
