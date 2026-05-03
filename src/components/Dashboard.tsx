import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Briefcase, GraduationCap, Award, CheckCircle2, 
  AlertTriangle, Download, Copy, Play, TrendingUp, 
  Target, Star, MessageSquare, Phone, MapPin, Mail, Globe, Linkedin, ShieldCheck,
  ArrowRight, ExternalLink, Info, X, Sparkles, User, LucideIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getResult, getProfile, UserProfile } from '../lib/firebase';
import { useLanguage } from '../lib/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const Dashboard = ({ onReset }: { onReset: () => void }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [appData, setAppData] = useState<{ user: UserProfile | null, ai: any }>({ user: null, ai: null });
  const [loading, setLoading] = useState(true);

  // Interview State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: "Assalam-o-Alaikum! I am Naukri Saathi AI. How can I help with your career today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, profile] = await Promise.all([getResult(), getProfile()]);
        setAppData({ user: profile as UserProfile, ai: result });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAIResponse = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('cv') || q.includes('resume')) {
      return "Your CV looks great! Make sure to highlight your years of experience and specific technical skills. Keep it to 1-2 pages maximum.";
    }
    if (q.includes('salary') || q.includes('pay') || q.includes('takhwa')) {
      return "For salary negotiation: Always research market rates first. Start by asking 20% higher than your target. Highlight your experience and unique skills.";
    }
    if (q.includes('interview')) {
      return "For interviews: Arrive 10 minutes early, dress professionally, bring printed copies of your CV, and prepare 3 examples of your best work.";
    }
    if (q.includes('job') || q.includes('naukri')) {
      return "For job search: Apply on Rozee.pk and Indeed Pakistan daily. Update your profile regularly. Follow up after applying within 1 week.";
    }
    return "I am here to help with your career! Ask me about CV tips, salary negotiation, interview preparation, or job search strategies.";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = getAIResponse(userMsg);
      setChatMessages(prev => [...prev, { role: 'ai', text: resp }]);
      setIsTyping(false);
    }, 1000);
  };

  const downloadCV = async () => {
    const element = document.getElementById('cv-download-area');
    if (!element || !appData.user) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedArea = clonedDoc.getElementById('cv-download-area');
          if (clonedArea) {
            clonedArea.style.color = '#000000';
            clonedArea.style.backgroundColor = '#ffffff';
            const elements = clonedArea.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i] as HTMLElement;
              const style = window.getComputedStyle(el);
              if (style.color.includes('oklch')) el.style.color = '#334155';
              if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'transparent';
              if (style.borderColor.includes('oklch')) el.style.borderColor = '#e2e8f0';
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${appData.user.name}_CV.pdf`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading || !appData.ai || !appData.user) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
        <p className="urdu-text text-xl animate-pulse">{t('Loading your dashboard...', 'آپ کا ڈیش بورڈ لوڈ ہو رہا ہے...')}</p>
      </div>
    );
  }

  const { ai, user } = appData;

  const TabButton = ({ idx, label, icon: Icon }: { idx: number, label: string, icon: LucideIcon }) => (
    <button 
      onClick={() => setActiveTab(idx)}
      className={cn(
        "flex-1 py-4 flex flex-col items-center gap-1 min-w-[100px] transition-all",
        activeTab === idx ? "text-amber-500 border-b-2 border-amber-500" : "text-slate-400 hover:text-slate-200"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto relative">
      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] h-[500px] glass-card shadow-2xl rounded-[32px] overflow-hidden flex flex-col border border-white/10 mb-4"
            >
              <div className="bg-amber-500 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="bg-slate-950/20 p-2 rounded-full">🤖</div>
                   <h4 className="text-slate-950 font-black">Naukri Saathi AI</h4>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-950 hover:bg-slate-950/10 p-1 rounded-lg"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
                {chatMessages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm font-medium",
                      m.role === 'user' ? "bg-amber-500 text-slate-950 rounded-tr-none" : "bg-slate-800 text-slate-100 rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none">
                       <span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-900 border-t border-white/5 space-y-4">
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                     placeholder="Type your question..."
                     className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                   />
                   <button onClick={handleSendMessage} className="bg-amber-500 text-slate-950 px-4 rounded-xl font-bold text-sm">Send</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['CV help?', 'Salary tips?', 'Interviews?'].map(q => (
                    <button key={q} onClick={() => { setChatInput(q); }} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md text-slate-400">"{q}"</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-amber-500 rounded-full shadow-2xl shadow-amber-500/40 flex flex-col items-center justify-center border-4 border-slate-950 hover:scale-110 active:scale-95 transition-all text-slate-950 font-black group"
        >
          <span className="text-xl">🤖</span>
          <span className="text-[8px] uppercase">Ask AI</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <button 
          onClick={onReset}
          className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border border-white/5"
        >
          ← Start New Profile
        </button>
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex items-center justify-center gap-2 flex-1 md:flex-none">
          <Info className="w-4 h-4 text-amber-500" />
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Demo Mode - Results are sample data</span>
        </div>
      </div>
      {/* Header Info */}
      <div className="glass-card rounded-[32px] p-8 mb-8 border-t border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
         <div className="relative w-32 h-32 flex-shrink-0">
            {/* CSS Circular Gauge */}
            <div className="w-full h-full rounded-full border-[8px] border-white/5 relative flex items-center justify-center">
               <div 
                  className="absolute inset-[-8px] rounded-full border-[8px] border-amber-500 transition-all duration-1000"
                  style={{ 
                    clipPath: `conic-gradient(white ${ai.careerScore}%, transparent 0)`,
                    transform: 'rotate(-90deg)'
                  }}
               />
               <span className="text-4xl font-black text-white">{ai.careerScore}</span>
            </div>
         </div>
         <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-bold mb-4">
               <Sparkles className="w-4 h-4 mr-2" /> {t('AI Report Generated', 'AI رپورٹ تیار ہے')}
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 leading-tight">{ai.professionalTitle}</h1>
            <p className="text-slate-400 font-medium text-lg italic pr-4 border-l-2 border-amber-500/30 pl-4">{ai.summary}</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl flex overflow-x-auto mb-8 sticky top-24 z-20 backdrop-blur-md">
         <TabButton idx={0} label="Profile Analysis" icon={Target} />
         <TabButton idx={1} label="CV Builder" icon={FileText} />
         <TabButton idx={2} label="Find Better Jobs" icon={Briefcase} />
         <TabButton idx={3} label="Interview Prep" icon={MessageSquare} />
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: PROFILE ANALYSIS */}
        {activeTab === 0 && (
           <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl border-t-2 border-emerald-500/30">
                 <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <Target className="text-emerald-400" /> {t('Key Strengths', 'آپ کی خوبیاں')}
                 </h3>
                 <div className="space-y-4">
                   {ai.strengths.map((item: string, i: number) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       <span className="text-slate-100 font-medium">{item}</span>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="glass-card p-8 rounded-3xl border-t-2 border-amber-500/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <AlertTriangle className="text-amber-400" /> {t('Areas to Improve', 'بہتری کی گنجائش')}
                </h3>
                <div className="space-y-4">
                   {ai.improvements.map((item: string, i: number) => (
                     <div key={`improve-${i}`} className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                       <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                       <span className="text-slate-100 font-medium">{item}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl md:col-span-2">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                   <Star className="text-amber-500" /> Recognized Skills
                 </h3>
                 <div className="flex flex-wrap gap-2">
                   {ai.skillTags.map((tag: string, i: number) => (
                     <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-amber-500 rounded-xl text-sm font-bold">
                       {tag}
                     </span>
                   ))}
                 </div>
              </div>
           </motion.div>
        )}

        {/* TAB 2: CV BUILDER */}
        {activeTab === 1 && (
           <motion.div key="cv" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
              <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-white/10">
                 <p className="text-white font-bold">{t('Download your professional CV in PDF format', 'اپنا پروفیشنل CV ڈاؤن لوڈ کریں')}</p>
                 <button onClick={downloadCV} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20">
                    <Download className="w-5 h-5" /> Download CV
                 </button>
              </div>

              <div className="flex justify-center bg-slate-950 p-8 rounded-3xl overflow-auto group">
                <div 
                  id="cv-download-area" 
                  className="w-[210mm] min-h-[297mm] bg-white text-black p-16 shadow-2xl relative"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#000000', backgroundColor: '#ffffff' }}
                >
                   {/* CV Header */}
                   <div className="border-b-4 border-black pb-8 mb-8">
                      <h1 className="text-5xl font-black uppercase mb-2">{user.name}</h1>
                      <h2 className="text-2xl font-bold tracking-widest uppercase mb-4" style={{ color: '#334155' }}>{ai.professionalTitle}</h2>
                      <div className="flex gap-6 text-sm font-bold" style={{ color: '#475569' }}>
                         <span className="flex items-center gap-1">📞 {user.phone}</span>
                         <span className="flex items-center gap-1">📍 {user.city}</span>
                         {user.email && <span className="flex items-center gap-1">📧 {user.email}</span>}
                      </div>
                   </div>

                   {/* CV Sections */}
                   <div className="space-y-8">
                      <section>
                         <h3 className="text-sm font-black text-white bg-black px-3 py-1 inline-block uppercase tracking-widest mb-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Professional Summary</h3>
                         <p className="leading-relaxed text-lg" style={{ color: '#1e293b' }}>{ai.cvSummary || ai.summary}</p>
                      </section>

                      <section>
                         <h3 className="text-sm font-black text-white bg-black px-3 py-1 inline-block uppercase tracking-widest mb-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Work Experience</h3>
                         <div className="space-y-6">
                            {user.experiences.map((exp: any, i: number) => (
                               <div key={i} className="border-l-2 pl-4" style={{ borderColor: '#e2e8f0' }}>
                                  <div className="flex justify-between font-bold mb-1">
                                     <span className="text-xl">{exp.title}</span>
                                     <span className="text-sm uppercase" style={{ color: '#64748b' }}>{exp.duration}</span>
                                  </div>
                                  <div className="font-bold mb-2 uppercase text-sm" style={{ color: '#0f172a' }}>{exp.company}</div>
                                  <p className="text-sm whitespace-pre-wrap" style={{ color: '#334155' }}>{exp.responsibilities}</p>
                               </div>
                            ))}
                         </div>
                      </section>

                      <div className="grid grid-cols-2 gap-12">
                         <section>
                            <h3 className="text-sm font-black text-white bg-black px-3 py-1 inline-block uppercase tracking-widest mb-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Skills</h3>
                            <div className="flex flex-wrap gap-2">
                               {ai.skillTags.map((tag: string, i: number) => (
                                  <span key={i} className="px-3 py-1 rounded border text-[10px] font-bold" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0', color: '#000000' }}>{tag}</span>
                               ))}
                            </div>
                         </section>

                         <section>
                            <h3 className="text-sm font-black text-white bg-black px-3 py-1 inline-block uppercase tracking-widest mb-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Education</h3>
                            <div className="mb-4">
                               <div className="font-bold">{user.education.level}</div>
                               <div className="text-sm italic" style={{ color: '#475569' }}>{user.education.institute}</div>
                               <div className="text-xs" style={{ color: '#94a3b8' }}>{user.education.year}</div>
                            </div>
                         </section>
                      </div>

                      <section>
                         <h3 className="text-sm font-black text-white bg-black px-3 py-1 inline-block uppercase tracking-widest mb-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Languages</h3>
                         <div className="flex gap-4">
                            {user.languages.map((l: string, i: number) => (
                               <span key={`${l}-${i}`} className="font-bold text-sm" style={{ color: '#000000' }}>✓ {l}</span>
                            ))}
                         </div>
                      </section>
                   </div>

                   <div className="absolute bottom-12 right-12 opacity-20 text-[10px] font-bold">Generated by Naukri Saathi AI</div>
                </div>
              </div>
           </motion.div>
        )}

        {/* TAB 3: FIND BETTER JOBS */}
        {activeTab === 2 && (
           <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-8">
                 {ai.jobMatches.map((job: any, i: number) => (
                    <div key={i} className="glass-card p-8 rounded-3xl border border-white/5 relative group hover:border-blue-500/50 transition-all">
                       <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase">
                          {job.matchPercent}% Match
                       </div>
                       
                       <div className="mb-6">
                          <h4 className="text-2xl font-black text-white mb-1">{job.title}</h4>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{job.company} • {job.city}</p>
                       </div>

                       <div className="bg-slate-900 rounded-2xl p-4 mb-6">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Salary</span>
                             <span className="text-amber-500 font-black">Rs. {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {job.requiredSkills?.map((s: string, j: number) => (
                                <span key={`${s}-${j}`} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-slate-400">{s}</span>
                             ))}
                          </div>
                       </div>

                       <div className="mb-8">
                          <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">📋 How to Apply:</h5>
                          <div className="space-y-2">
                             {job.applySteps.split('\n').map((step: string, j: number) => (
                                <p key={j} className="text-sm text-slate-300 flex gap-2">
                                   <span className="text-amber-500 font-black">{j+1}.</span> {step.replace(/^\d+\.\s*/, '')}
                                </p>
                             ))}
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <button 
                            onClick={() => window.open(job.rozeeLink, '_blank')}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/10"
                          >
                             Apply on Rozee.pk <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => window.open(job.indeedLink, '_blank')}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-bold transition-all"
                          >
                             Indeed <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Platform Guide */}
              <div className="pt-12 border-t border-white/5">
                 <h3 className="text-3xl font-black text-white text-center mb-12 urdu-text">Jobs Dhundhne Ke Platforms</h3>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Rozee.pk', desc: "Pakistan's #1 job portal for formal & informal sectors.", link: 'https://www.rozee.pk' },
                      { name: 'Indeed Pakistan', desc: "World's leading job site with thousands of local listings.", link: 'https://pk.indeed.com' },
                      { name: 'LinkedIn', desc: "Professional networking platform to find senior positions.", link: 'https://www.linkedin.com/jobs' },
                      { name: 'OLX Jobs', desc: "Best for immediate local city-level labor and tech jobs.", link: 'https://www.olx.com.pk/jobs' },
                    ].map((p, i) => (
                       <div key={i} className="glass-card p-6 rounded-3xl text-center flex flex-col items-center">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 font-black text-blue-400">
                             {p.name.charAt(0)}
                          </div>
                          <h4 className="font-bold text-white mb-2">{p.name}</h4>
                          <p className="text-slate-500 text-xs mb-6 line-clamp-2">{p.desc}</p>
                          <button onClick={() => window.open(p.link, '_blank')} className="mt-auto text-amber-500 font-bold hover:underline">Visit Site →</button>
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>
        )}

        {/* TAB 4: INTERVIEW PREP */}
        {activeTab === 3 && (
           <motion.div key="interview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-12">
                 {/* Question Flow */}
                 <div className="glass-card p-10 rounded-[32px] border-t border-white/5 flex flex-col min-h-[500px]">
                    {!interviewComplete ? (
                      <>
                        <div className="flex justify-between items-center mb-12">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {ai.interviewQuestions.length}</span>
                           <div className="flex gap-1">
                              {ai.interviewQuestions.map((_: any, i: number) => (
                                 <div key={`dot-${i}`} className={cn("w-6 h-1 rounded-full", i <= currentQuestionIdx ? "bg-amber-500" : "bg-slate-800")} />
                              ))}
                           </div>
                        </div>

                        <h4 className="text-3xl font-black text-white urdu-text mb-8 leading-relaxed">
                           {ai.interviewQuestions[currentQuestionIdx].question}
                        </h4>

                        {!showFeedback ? (
                           <div className="space-y-6 mt-auto">
                              <textarea 
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                                placeholder="Type your answer here in Urdu or English..."
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-white min-h-[150px] outline-none focus:border-amber-500 transition-all"
                              />
                              <button 
                                onClick={() => { if(userAnswer.trim()) setShowFeedback(true); }}
                                disabled={!userAnswer.trim()}
                                className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black text-xl urdu-text transition-all active:scale-95 disabled:opacity-50"
                              >
                                 Submit Answer / جواب دیں
                              </button>
                           </div>
                        ) : (
                           <div className="space-y-8 mt-auto">
                              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                                 <span className="text-[10px] font-black text-emerald-400 uppercase block mb-3">✅ Best Way to Answer:</span>
                                 <p className="urdu-text text-xl text-emerald-100 leading-relaxed italic">{ai.interviewQuestions[currentQuestionIdx].sampleAnswer}</p>
                              </div>
                              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                                 <span className="text-[10px] font-black text-blue-400 uppercase block mb-3 underline">💡 Pro Tip:</span>
                                 <p className="urdu-text text-xl text-blue-100">{ai.interviewQuestions[currentQuestionIdx].tip}</p>
                              </div>
                              <button 
                                onClick={() => {
                                   if (currentQuestionIdx < ai.interviewQuestions.length - 1) {
                                      setCurrentQuestionIdx(prev => prev + 1);
                                      setUserAnswer('');
                                      setShowFeedback(false);
                                   } else {
                                      setInterviewComplete(true);
                                   }
                                }}
                                className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xl urdu-text"
                              >
                                 Next Question →
                              </button>
                           </div>
                        )}
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                         <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-8 border border-amber-500/30">
                            <Star className="w-12 h-12 text-amber-500" />
                         </div>
                         <h3 className="text-4xl font-black text-white urdu-text mb-4">Interview Prep Complete! 🎉</h3>
                         <p className="text-slate-400 mb-10">You are now ready to face real employers. Good luck!</p>
                         <button 
                           onClick={() => {
                              setCurrentQuestionIdx(0);
                              setInterviewComplete(false);
                              setUserAnswer('');
                              setShowFeedback(false);
                           }}
                           className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold"
                         >
                            Practice Again 🔄
                         </button>
                      </div>
                    )}
                 </div>

                 {/* Salary Negotiation */}
                 <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[32px] border-t border-white/5 bg-gradient-to-br from-slate-900 to-indigo-950/40">
                       <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                          <TrendingUp className="text-amber-500" /> Salary Negotiation
                       </h3>
                       
                       <div className="space-y-8 mb-10">
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
                                <span>Market Scale</span>
                                <span>Rs. {ai.salaryData.marketMin.toLocaleString()} - {ai.salaryData.marketMax.toLocaleString()}</span>
                             </div>
                             <div className="h-6 w-full bg-slate-950 rounded-full overflow-hidden flex relative">
                                <div className="absolute inset-y-0 left-[20%] w-[60%] bg-gradient-to-r from-blue-500 to-amber-500 opacity-20" />
                                <div className="z-10 h-full w-[2px] bg-white absolute" style={{ left: '50%' }} />
                                <div className="absolute bottom-[-20px] left-[50%] -translate-x-1/2 text-[8px] font-black uppercase text-white">Average</div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                             <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="block text-[10px] text-slate-500 font-bold mb-1">MIN</span>
                                <span className="font-black text-white text-sm">{ai.salaryData.marketMin.toLocaleString()}</span>
                             </div>
                             <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <span className="block text-[10px] text-amber-500 font-bold mb-1">AVERAGE</span>
                                <span className="font-black text-white text-sm">{ai.salaryData.marketAvg.toLocaleString()}</span>
                             </div>
                             <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="block text-[10px] text-slate-500 font-bold mb-1">MAX</span>
                                <span className="font-black text-white text-sm">{ai.salaryData.marketMax.toLocaleString()}</span>
                             </div>
                          </div>
                       </div>

                       <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 relative">
                          <div className="p-1 px-3 bg-amber-500 text-slate-900 absolute -top-3 left-6 rounded-md text-[10px] font-black uppercase">Negotiation Script</div>
                          <p className="urdu-text text-xl text-slate-200 leading-relaxed font-medium italic pt-2">
                             "{ai.salaryData.negotiationScript}"
                          </p>
                          <button 
                            onClick={() => {
                               navigator.clipboard.writeText(ai.salaryData.negotiationScript);
                               alert("Script copied!");
                            }}
                            className="mt-6 flex items-center gap-2 text-amber-500 font-bold text-xs hover:underline"
                          >
                             <Copy className="w-3 h-3" /> Copy Script
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg 
    className={cn("animate-spin", className)} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
