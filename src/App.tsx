import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { Key } from 'lucide-react';

function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const { lang, t } = useLanguage();

  const resetAllState = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden selection:bg-amber-500/30 font-sans">
      <Navbar onNavigate={(view) => {
        if (view === 'home') navigateToStep(0);
        if (view === 'onboarding') navigateToStep(1);
        if (view === 'dashboard') navigateToStep(9);
      }} />
      
      <main className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
             <motion.div
               key="home"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               <Hero onStart={() => navigateToStep(1)} hasReport={false} onShowReport={() => navigateToStep(9)} />
             </motion.div>
          )}

          {(currentStep >= 1 && currentStep <= 8) && (
             <motion.div
               key="onboarding"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
             >
               <Onboarding 
                 initialStep={currentStep} 
                 onStepChange={navigateToStep}
                 onComplete={() => navigateToStep(9)} 
               />
             </motion.div>
          )}

          {currentStep === 9 && (
             <motion.div
               key="dashboard"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
             >
               <Dashboard onReset={resetAllState} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simple Footer */}
      <footer className="bg-[#0F172A] py-12 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium mb-6">Built by Rafia Rameen 👩💻 | 🇵🇰 | #AISeekho2026</p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
             <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
