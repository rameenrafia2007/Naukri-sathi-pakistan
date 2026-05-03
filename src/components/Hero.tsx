import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Play, Building2, UserCircle2, X, Sparkles, CheckCircle2, RotateCcw, Quote } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export const Hero = ({ onStart, hasReport, onShowReport }: { onStart: () => void, hasReport: boolean, onShowReport: () => void }) => {
  const { lang, t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const demoSteps = [
    { title: "Fill Your Details", icon: "📝", desc: "Enter your profession and skills" },
    { title: "AI Analyzes", icon: "🤖", desc: "Gemini AI processes your profile" },
    { title: "Get Your CV", icon: "📄", desc: "Professional CV generated instantly" },
    { title: "Find Jobs", icon: "💼", desc: "Real job matches with apply links" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldAnimate]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full max-w-7xl mx-auto min-h-[600px] pt-32 pb-16 px-4 md:px-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex-1 px-4 sm:px-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] sm:text-xs font-bold mb-6">
                <span className="mr-2">🇵🇰</span> Pakistan's First AI Career Platform
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white text-center sm:text-left">
                <span className="urdu-text block">{t('Unleash Your', 'آپ کی محنت کو')}</span> 
                <span className="urdu-text text-amber-500 block">{t('True Potential', 'پہچان دلائیں')}</span>
              </h1>
              
              <p className="text-sm md:text-base text-slate-400 mb-10 leading-relaxed max-w-lg font-sans text-center sm:text-left mx-auto sm:mx-0">
                <span className="urdu-text text-lg block mb-4 text-slate-300">
                  {t('Whether you are a shopkeeper, laborer, artisan or anyone — Naukri Saathi turns your skills into a formal career.', 'چاہے آپ دکاندار ہوں، مزدور، کاریگر یا کوئی بھی — Naukri Saathi آپ کی صلاحیتوں کو باقاعدہ کیریئر میں بدلتا ہے۔')}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                <button 
                  onClick={onStart}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-amber-500/30 transition-all cursor-pointer urdu-text flex items-center justify-center text-center leading-none"
                >
                  {t('Start Now', 'ابھی شروع کریں')}
                </button>
                {hasReport && (
                  <button 
                    onClick={onShowReport}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all urdu-text flex items-center justify-center text-center"
                  >
                    {t('View My CV', 'میرا CV دیکھیں')}
                  </button>
                )}
              </div>
            </motion.div>
        </div>

        <div className="relative z-10 flex-1 w-full max-w-xl" id="how-it-works" ref={sectionRef as any}>
           {/* Visual Mockup Card */}
           <div className="glass-card p-1 rounded-[40px] shadow-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <div className="bg-slate-950 rounded-[39px] p-8 min-h-[460px] flex flex-col">
                 <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">How It Works</span>
                 </div>

                 <div className="flex-1 flex flex-col items-center justify-center relative py-10">
                    <AnimatePresence mode="wait">
                       <motion.div 
                         key={activeStep}
                         initial={{ opacity: 0, scale: 0.9, y: 10 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 1.1, y: -10 }}
                         className="text-center"
                       >
                          <div className="text-8xl mb-8 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                             {demoSteps[activeStep].icon}
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">{demoSteps[activeStep].title}</h3>
                          <p className="text-slate-400 text-sm max-w-[240px] mx-auto">{demoSteps[activeStep].desc}</p>
                          
                          {/* Specific animations for each step */}
                          {activeStep === 0 && (
                             <div className="mt-6 flex flex-col gap-2 w-32 mx-auto">
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5 }} className="h-1 bg-slate-800 rounded-full" />
                                <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ delay: 1 }} className="h-1 bg-slate-800 rounded-full" />
                                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ delay: 1.5 }} className="h-1 bg-slate-800 rounded-full" />
                             </div>
                          )}
                          {activeStep === 1 && (
                             <motion.div 
                               animate={{ rotate: 360 }}
                               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                               className="mt-6 text-2xl"
                             >
                               ⚙️
                             </motion.div>
                          )}
                          {activeStep === 2 && (
                             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-6 flex justify-center">
                                <div className="w-16 h-20 bg-white rounded border border-slate-200 p-2 flex flex-col gap-1">
                                   <div className="h-1 w-full bg-slate-200" />
                                   <div className="h-1 w-2/3 bg-slate-200" />
                                   <div className="h-2 w-full bg-amber-200 mt-2" />
                                </div>
                             </motion.div>
                          )}
                          {activeStep === 3 && (
                             <div className="mt-6 flex justify-center gap-2">
                                <motion.div animate={{ x: [0, 5, 0] }} className="w-12 h-6 bg-blue-500/20 rounded border border-blue-500/50" />
                                <motion.div animate={{ x: [0, -5, 0] }} className="w-12 h-6 bg-emerald-500/20 rounded border border-emerald-500/50" />
                             </div>
                          )}
                       </motion.div>
                    </AnimatePresence>
                 </div>

                 <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex gap-3">
                       {[0, 1, 2, 3].map(i => (
                          <div 
                             key={i} 
                             className={cn(
                               "w-3 h-3 rounded-full transition-all duration-300",
                               activeStep === i ? "bg-amber-500 scale-125" : "bg-slate-800"
                             )} 
                          />
                       ))}
                    </div>
                    <button 
                      onClick={() => {
                        setShouldAnimate(false);
                        setActiveStep(0);
                        setTimeout(() => setShouldAnimate(true), 100);
                      }}
                      className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <RotateCcw className="w-3 h-3" /> Replay
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-24 bg-slate-900 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-16 text-white urdu-text">
               {t('How Naukri Saathi Helps', 'Naukri Saathi کیسے مدد کرتا ہے')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="glass-card p-10 rounded-[40px] group transition-all hover:translate-y-[-8px]">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-500/20 transition-all">
                     <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4">AI CV Builder</h3>
                  <p className="text-slate-400">Tell us what you do in your own words, and our AI creates a professional Resume instantly.</p>
               </div>

               <div className="glass-card p-10 rounded-[40px] group transition-all hover:translate-y-[-8px] border-amber-500/20">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-amber-500/20 transition-all">
                     <Search className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4">Smart Job Match</h3>
                  <p className="text-slate-400">Get matched with jobs that actually fit your skills, not just a job title.</p>
               </div>

               <div className="glass-card p-10 rounded-[40px] group transition-all hover:translate-y-[-8px]">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:bg-emerald-500/20 transition-all">
                     <UserCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4">Interview Coach</h3>
                  <p className="text-slate-400">Practice in Urdu with our AI interviewer to build confidence before the real thing.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 urdu-text">{t('Success Stories', 'کامیابی کی کہانیاں')}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Real people, real growth. See how Pakistan's informal workers are leveling up.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  name: "Ahmed Ali", 
                  role: "Motor Mechanic", 
                  before: "Rs. 25k", 
                  after: "Rs. 45k", 
                  story: "I had 10 years of experience but no degree. Naukri Saathi helped me build a technical profile that got me a job at a Toyota Dealership." 
                },
                { 
                  name: "Zainab Bibi", 
                  role: "Fashion Tailor", 
                  before: "Rs. 18k", 
                  after: "Rs. 35k", 
                  story: "As a domestic tailor, I didn't know my value. The AI-generated CV showcased my embroidery skills, and I now manage a team at a textile house." 
                },
                { 
                  name: "Bilal Khan", 
                  role: "Professional Driver", 
                  before: "Rs. 22k", 
                  after: "Rs. 40k", 
                  story: "Found out I was being underpaid. Using the salary negotiation script, I negotiated a better package with a corporate travel company." 
                }
              ].map((s, i) => (
                <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Quote className="w-20 h-20 text-white" />
                   </div>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20">👤</div>
                      <div>
                         <h4 className="text-xl font-bold text-white">{s.name}</h4>
                         <p className="text-amber-500 text-xs font-black uppercase tracking-widest">{s.role}</p>
                      </div>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">"{s.story}"</p>
                   <div className="flex gap-4 pt-6 border-t border-white/5">
                      <div className="flex-1">
                         <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Before</span>
                         <span className="text-red-400 font-bold">{s.before}</span>
                      </div>
                      <div className="flex-1 text-right">
                         <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">After</span>
                         <span className="text-emerald-400 font-bold">{s.after}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Problem Solver Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 urdu-text">{t('The Problem We Solve', 'وہ مسائل جن کا حل ہم لاتے ہیں')}</h2>
           </div>
           
           <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "No Formal CV", ur: "باضابطہ CV کی کمی", desc: "Most skilled workers don't have a professional document for companies." },
                { title: "Limited Exposure", ur: "محدود رسائی", desc: "Don't know about online sites like Rozee.pk or LinkedIn." },
                { title: "Low Confidence", ur: "اعتماد کی کمی", desc: "Fear of formal interviews held in offices or English." },
                { title: "Salary Traps", ur: "تنخواہ کے مسائل", desc: "Not knowing the actual market value of your unique skills." }
              ].map((p, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-white/5 transition-all">
                   <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-amber-500">0{i+1}</div>
                   <div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">{p.title}</h4>
                      <div className="urdu-text text-amber-500/80 mb-2 font-bold">{p.ur}</div>
                      <p className="text-slate-500 text-sm">{p.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};
