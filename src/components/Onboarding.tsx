import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Plus, Trash2, X, Sparkles, Loader2, 
  User, Briefcase, GraduationCap, Star, Info, 
  MapPin, Phone, Mail, Calendar, Linkedin, Award,
  CheckCircle2, Target, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { saveProfile, saveResult } from '../lib/firebase';

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 
  'Gujranwala', 'Bahawalpur'
];

const EDUCATIONS = [
  'Never Studied', 'Primary', 'Middle', 'Matric', 
  'Intermediate', 'Bachelor\'s', 'Master\'s', 'PhD'
];

const LANGUAGES_OPTIONS = ['Urdu', 'English', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi'];

interface OnboardingProps {
  initialStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
}

const getJobsByProfession = (profession: string) => {
  const jobsMap: Record<string, any[]> = {
    'Cook': [
      {
        title: "Head Chef",
        company: "Pearl Continental Hotel",
        city: "Lahore",
        salaryMin: 40000,
        salaryMax: 70000,
        matchPercent: 96,
        requiredSkills: ["Cooking", "Menu Planning"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-chef-cook",
        indeedLink: "https://pk.indeed.com/jobs?q=chef+cook&l=Pakistan",
        applySteps: "1. Click Apply\n2. Share your culinary portfolio\n3. Interview at PC Hotel"
      },
      {
        title: "Restaurant Cook",
        company: "Monal Restaurant",
        city: "Islamabad",
        salaryMin: 30000,
        salaryMax: 50000,
        matchPercent: 92,
        requiredSkills: ["Food Prep", "Hygiene"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-restaurant-cook",
        indeedLink: "https://pk.indeed.com/jobs?q=restaurant+cook&l=Pakistan",
        applySteps: "1. Visit Monal Islamabad\n2. Ask for Kitchen Manager\n3. Show your cooking skills"
      }
    ],
    'Mechanic': [
      {
        title: "Senior Mechanic",
        company: "Toyota Workshop",
        city: "Lahore",
        salaryMin: 35000,
        salaryMax: 60000,
        matchPercent: 94,
        requiredSkills: ["Engine Repair", "Diagnostics"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-mechanic",
        indeedLink: "https://pk.indeed.com/jobs?q=mechanic&l=Pakistan",
        applySteps: "1. Visit Toyota Workshop\n2. Share technical profile\n3. Hands-on test"
      }
    ],
    'Tailor': [
      {
        title: "Senior Tailor",
        company: "Gul Ahmed Textile",
        city: "Karachi",
        salaryMin: 30000,
        salaryMax: 55000,
        matchPercent: 95,
        requiredSkills: ["Stitching", "Pattern Making"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-tailor-darzi",
        indeedLink: "https://pk.indeed.com/jobs?q=tailor&l=Pakistan",
        applySteps: "1. Go to Gul Ahmed factory\n2. Show your stitching samples\n3. On-spot trial"
      }
    ],
    'Driver': [
      {
        title: "Professional Driver",
        company: "Careem/InDrive",
        city: "Lahore",
        salaryMin: 35000,
        salaryMax: 60000,
        matchPercent: 97,
        requiredSkills: ["Driving", "Navigation"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-driver",
        indeedLink: "https://pk.indeed.com/jobs?q=driver&l=Pakistan",
        applySteps: "1. Register on Driver app\n2. Submit documents\n3. Vehicle inspection"
      }
    ],
    'Electrician': [
      {
        title: "Senior Electrician",
        company: "LESCO / KESC",
        city: "Lahore",
        salaryMin: 35000,
        salaryMax: 65000,
        matchPercent: 93,
        requiredSkills: ["Wiring", "Electrical Work"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-electrician",
        indeedLink: "https://pk.indeed.com/jobs?q=electrician&l=Pakistan",
        applySteps: "1. Apply via Govt portal\n2. Electrical license verification\n3. Interview"
      }
    ],
    'Plumber': [
      {
        title: "Senior Plumber",
        company: "WASA",
        city: "Lahore",
        salaryMin: 30000,
        salaryMax: 55000,
        matchPercent: 91,
        requiredSkills: ["Pipe Fitting", "Repairs"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-plumber",
        indeedLink: "https://pk.indeed.com/jobs?q=plumber&l=Pakistan",
        applySteps: "1. Visit WASA office\n2. Submit experience letter\n3. Field test"
      }
    ],
    'Barber': [
      {
        title: "Senior Stylist",
        company: "Nabila Salon",
        city: "Karachi",
        salaryMin: 30000,
        salaryMax: 60000,
        matchPercent: 92,
        requiredSkills: ["Hair Cutting", "Styling"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-barber-stylist",
        indeedLink: "https://pk.indeed.com/jobs?q=barber+stylist&l=Pakistan",
        applySteps: "1. Visit Nabila Salon\n2. Show your hair styling skills\n3. Portfolio review"
      }
    ],
    'Delivery': [
      {
        title: "Delivery Rider",
        company: "Foodpanda / Daraz",
        city: "Karachi",
        salaryMin: 30000,
        salaryMax: 50000,
        matchPercent: 98,
        requiredSkills: ["Riding", "Navigation"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-delivery-rider",
        indeedLink: "https://pk.indeed.com/jobs?q=delivery+rider&l=Pakistan",
        applySteps: "1. Sign up on Rider portal\n2. Bike documents check\n3. Start delivering"
      }
    ],
    'Tutor': [
      {
        title: "Private Tutor",
        company: "Beaconhouse School",
        city: "Lahore",
        salaryMin: 35000,
        salaryMax: 70000,
        matchPercent: 93,
        requiredSkills: ["Teaching", "Subject Knowledge"],
        rozeeLink: "https://www.rozee.pk/job/jsearch/q-tutor-teacher",
        indeedLink: "https://pk.indeed.com/jobs?q=tutor&l=Pakistan",
        applySteps: "1. Submit academic certificates\n2. Demo class\n3. Interview"
      }
    ]
  };
  
  return jobsMap[profession] || jobsMap['Mechanic'];
};

const getProfessionalTitle = (profession: string) => {
  const titles: Record<string, string> = {
    'Cook': "Executive Chef",
    'Mechanic': "Senior Automotive Technician",
    'Tailor': "Master Fashion Tailor",
    'Driver': "Professional Chauffeur",
    'Electrician': "Senior Electrical Engineer",
    'Plumber': "Expert Pipe Systems Specialist",
    'Barber': "Senior Hair Stylist",
    'Delivery': "Logistics & Delivery Expert",
    'Tutor': "Expert Academic Tutor"
  };
  return titles[profession] || "Senior Specialist";
};

const getSkillTags = (profession: string) => {
  const skills: Record<string, string[]> = {
    'Cook': ["Food Safety", "Menu Planning", "Culinary Mastery", "Speed"],
    'Mechanic': ["Manual Diagnostics", "Engine Overhaul", "Precision", "Safety"],
    'Tailor': ["Pattern Design", "Stitching Precision", "Fabrics", "Finishing"],
    'Driver': ["Defensive Driving", "Route Mapping", "Punctuality", "Safety"],
    'Electrician': ["Wiring", "Circuit Repair", "Technical Safety", "Tools"],
    'Plumber': ["Piping", "Installation", "Repair", "Diagnostics"]
  };
  return skills[profession] || ["Reliability", "Technical Skills", "Work Ethic"];
};

export const Onboarding = ({ initialStep, onStepChange, onComplete }: OnboardingProps) => {
  const { lang, t } = useLanguage();
  const [loadingMsg, setLoadingMsg] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Unified Form State
  const [formData, setFormData] = useState({
    // Section A
    name: '',
    phone: '',
    email: '',
    city: 'Karachi',
    dob: '',
    // Section B
    profession: '',
    jobTitle: '',
    experienceYears: '',
    description: '',
    // Section C
    workHistory: [
      { company: '', title: '', startDate: '', endDate: '', isPresent: true, responsibilities: '' }
    ],
    // Section D
    education: {
      level: 'Matric',
      institute: '',
      year: '',
      certifications: ''
    },
    // Section E
    technicalSkills: [] as string[],
    softSkills: [] as string[],
    languages: ['Urdu'],
    // Section F
    linkedin: '',
    achievements: '',
    goals: [] as string[]
  });

  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [certInput, setCertInput] = useState('');

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors when user types
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const addJob = () => {
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, { company: '', title: '', startDate: '', endDate: '', isPresent: false, responsibilities: '' }]
    }));
  };

  const updateJob = (index: number, updates: any) => {
    const newHistory = [...formData.workHistory];
    newHistory[index] = { ...newHistory[index], ...updates };
    setFormData({ ...formData, workHistory: newHistory });
  };

  const removeJob = (index: number) => {
    setFormData({
      ...formData,
      workHistory: formData.workHistory.filter((_, i) => i !== index)
    });
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, boolean> = {};
    if (step === 1) { // Section A
       if (!formData.name) newErrors['name'] = true;
       if (!formData.phone) newErrors['phone'] = true;
       if (!formData.city) newErrors['city'] = true;
    }
    if (step === 2) { // Section B
        if (!formData.profession) newErrors['profession'] = true;
        if (!formData.jobTitle) newErrors['jobTitle'] = true;
        if (!formData.experienceYears) newErrors['experienceYears'] = true;
    }
    if (step === 3) { // Section D
        if (!formData.education.level) newErrors['eduLevel'] = true;
    }
    // Section C, E, F are more flexible but we can add validation if needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(initialStep)) {
      onStepChange(initialStep + 1);
    }
  };

  const goBack = () => {
    if (initialStep > 1) {
      onStepChange(initialStep - 1);
    } else {
      onStepChange(0); // back to home
    }
  };

  const handleSubmit = async () => {
    // Final validation
    const hasErrors = !formData.name || !formData.phone || !formData.jobTitle || !formData.experienceYears || !formData.profession;
    if (hasErrors) {
        alert(t("Please fill all required fields marked with *", "براہ کرم تمام ضروری خانوں کو پُر کریں جن پر * کا نشان ہے۔"));
        return;
    }

    setShowLoading(true);
    
    const msgs = [
      "Analyzing your skills... ⚙️",
      "Finding matching jobs... 🔍",
      "Building your CV... 📄",
      "Almost ready... ✨"
    ];
    let msgIndex = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => {
      msgIndex++;
      if (msgIndex < msgs.length) {
        setLoadingMsg(msgs[msgIndex]);
      }
    }, 2000);

    // Simulate API delay even in demo mode
    setTimeout(async () => {
      try {
        const profession = formData.profession;
        const DEMO_RESULT = {
          careerScore: 82,
          professionalTitle: getProfessionalTitle(profession),
          summary: `Experienced ${profession} with strong technical skills and ${formData.experienceYears} years of experience.`,
          strengths: [
            "Strong technical expertise",
            "Years of hands-on experience", 
            "Good problem solving skills",
            "Reliable and hardworking"
          ],
          improvements: [
            "Learn basic English",
            "Get certified training",
            "Build online presence"
          ],
          skillTags: getSkillTags(profession),
          cvSummary: `Dedicated ${profession} with proven experience in the field, seeking growth opportunities in a reputable organization. Highly skilled in ${profession}-related tasks and technical diagnostics.`,
          jobMatches: getJobsByProfession(profession),
          interviewQuestions: [
            {
              question: "Tell me about yourself?",
              sampleAnswer: `I am an experienced ${profession} with over ${formData.experienceYears} years of hands-on work. I specialize in ${formData.jobTitle} duties and related troubleshooting.`,
              tip: "Always start with your experience and key skills"
            },
            {
              question: `What are your strongest skills as a ${profession}?`,
              sampleAnswer: `My strongest skills revolve around the technical aspects of my profession. I can handle most ${profession} related problems independently.`,
              tip: "Give specific technical examples"
            },
            {
              question: "Why should we hire you?",
              sampleAnswer: "I bring years of practical experience, I am reliable, and I can work with minimum supervision. I also learn new techniques quickly.",
              tip: "Focus on what value you bring to them"
            }
          ],
          salaryData: {
            marketMin: 25000,
            marketAvg: 45000,
            marketMax: 80000,
            negotiationScript: `I have over ${formData.experienceYears} years of experience and my technical skills as a ${profession} make me worth Rs. 45,000 to 60,000 per month.`
          }
        };
        
        const profileToSave = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          dob: formData.dob,
          profession: formData.profession,
          jobTitle: formData.jobTitle,
          years: formData.experienceYears,
          skillsDescription: formData.description,
          experiences: formData.workHistory.map(job => ({
            title: job.title,
            company: job.company,
            duration: `${job.startDate} - ${job.isPresent ? 'Present' : job.endDate}`,
            responsibilities: job.responsibilities
          })),
          education: formData.education,
          technicalSkills: formData.technicalSkills,
          softSkills: formData.softSkills,
          languages: formData.languages,
          linkedin: formData.linkedin,
          achievements: formData.achievements,
          goals: formData.goals,
          referencesAvailable: true
        };
        
        await saveProfile(profileToSave as any);
        await saveResult(DEMO_RESULT);
        
        if (interval) clearInterval(interval);
        onComplete();
      } catch (error: any) {
        console.error('Demo submission error:', error);
        if (interval) clearInterval(interval);
        setShowLoading(false);
        
        let errorMsg = "Error loading results.";
        try {
          if (error && error.message) {
            const parsed = JSON.parse(error.message);
            if (parsed && parsed.error) errorMsg = `Database Error: ${parsed.error}`;
          }
        } catch (e) {
          errorMsg = error?.message || String(error);
        }
        
        alert(errorMsg);
      }
    }, 4000);
  };

  const renderInput = (label: string, field: string, type: string = 'text', placeholder: string = '', required: boolean = false) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={(formData as any)[field]} 
        onChange={e => updateFormData({ [field]: e.target.value })} 
        className={cn(
          "w-full bg-slate-900 border rounded-2xl p-4 text-white focus:border-amber-500 outline-none transition-all",
          errors[field] ? "border-red-500" : "border-white/5"
        )} 
      />
      {errors[field] && <p className="text-red-500 text-xs font-medium urdu-text pl-1">{t('This field is required', 'یہ خانہ ضروری ہے')}</p>}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] pt-32 pb-12 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative mb-12">
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
               />
               <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-amber-500 animate-pulse" />
            </div>
            <motion.h2 
              key={loadingMsg}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-black text-white urdu-text"
            >
              {loadingMsg}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <div className="w-full flex justify-between items-center mb-12 gap-2">
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2">
            <div className={cn("h-1.5 w-full rounded-full transition-all", initialStep >= s ? "bg-amber-500" : "bg-slate-800")} />
            <span className={cn("text-[9px] font-bold uppercase", initialStep === s ? "text-amber-500" : "text-slate-600")}>Section 0{s}</span>
          </div>
        ))}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* SECTION A: PERSONAL INFO */}
          {initialStep === 1 && (
            <motion.div key="a" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="glass-card p-10 rounded-[40px] border-t border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-amber-500/10 rounded-2xl"><User className="text-amber-500" /></div>
                <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Personal Information', 'ذاتی معلومات')}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {renderInput('Full Name', 'name', 'text', 'Saleem Ahmad', true)}
                {renderInput('Phone Number', 'phone', 'tel', '+92 XXX XXXXXXX', true)}
                {renderInput('Email Address', 'email', 'email', 'saleem@example.com')}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">City *</label>
                   <select 
                     value={formData.city} 
                     onChange={e => updateFormData({ city: e.target.value })}
                     className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-amber-500"
                   >
                     {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                {renderInput('Date of Birth', 'dob', 'date')}
              </div>

              <div className="mt-12 flex items-center gap-3 w-full">
                <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">
                   ← {t('Back', 'پیچھے')}
                </button>
                <button onClick={nextStep} className="flex-1 bg-amber-500 text-slate-900 px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center gap-2 group transition-all active:scale-[0.98]">
                  {t('Continue', 'اگے بڑھیں')} <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SECTION B: PROFESSIONAL SUMMARY */}
          {initialStep === 2 && (
             <motion.div key="b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-10 rounded-[40px] border-t border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-500/10 rounded-2xl"><Briefcase className="text-blue-500" /></div>
                  <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Professional Summary', 'پیشہ ورانہ خلاصہ')}</h2>
                </div>

                <div className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Profession *</label>
                         <select 
                           value={formData.profession} 
                           onChange={e => updateFormData({ profession: e.target.value })}
                           className={cn("w-full bg-slate-900 border rounded-2xl p-4 text-white", errors.profession ? "border-red-500" : "border-white/5")}
                         >
                            <option value="">Select Profession</option>
                            {['Mechanic', 'Cook', 'Driver', 'Electrician', 'Tailor', 'Plumber', 'Sales', 'Mason', 'Security'].map(p => <option key={p} value={p}>{p}</option>)}
                         </select>
                      </div>
                      {renderInput('Current Job Title', 'jobTitle', 'text', 'e.g. Senior Mechanic', true)}
                   </div>
                   {renderInput('Total Years of Experience', 'experienceYears', 'number', 'e.g. 5', true)}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Brief Description (2-3 lines)</label>
                      <textarea 
                        value={formData.description} 
                        onChange={e => updateFormData({ description: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white min-h-[100px]"
                        placeholder="I am an experienced auto technician with specialized skills in engine diagnostics..."
                      />
                   </div>
                </div>

                <div className="mt-12 flex items-center gap-3 w-full">
                  <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">← {t('Back', 'پیچھے')}</button>
                  <button onClick={nextStep} className="flex-1 bg-amber-500 text-slate-900 px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center transition-all active:scale-[0.98]">{t('Next', 'اگے')}</button>
                </div>
             </motion.div>
          )}

          {/* SECTION C: WORK EXPERIENCE */}
          {initialStep === 3 && (
            <motion.div key="c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="glass-card p-10 rounded-[40px] border-t border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl"><Calendar className="text-emerald-500" /></div>
                  <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Work Experience', 'کام کا تجربہ')}</h2>
                </div>

                <div className="space-y-8">
                   {formData.workHistory.map((job, idx) => (
                     <div key={idx} className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative group">
                        <button 
                          onClick={() => removeJob(idx)} 
                          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employer / Company Name</label>
                             <input type="text" placeholder="e.g. Toyota Motors" value={job.company} onChange={e => updateJob(idx, { company: e.target.value })} className="bg-slate-800 border border-white/5 rounded-xl p-4 w-full" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                             <input type="text" placeholder="e.g. Mechanic" value={job.title} onChange={e => updateJob(idx, { title: e.target.value })} className="bg-slate-800 border border-white/5 rounded-xl p-4 w-full" />
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date → End Date</label>
                             <div className="flex gap-2">
                                <input type="text" placeholder="2020" value={job.startDate} onChange={e => updateJob(idx, { startDate: e.target.value })} className="bg-slate-800 border border-white/5 rounded-xl p-4 flex-1" />
                                {!job.isPresent && <input type="text" placeholder="2022" value={job.endDate} onChange={e => updateJob(idx, { endDate: e.target.value })} className="bg-slate-800 border border-white/5 rounded-xl p-4 flex-1" />}
                             </div>
                           </div>
                           <div className="flex items-center gap-3 pt-6">
                              <input type="checkbox" checked={job.isPresent} onChange={e => updateJob(idx, { isPresent: e.target.checked })} className="w-6 h-6 accent-amber-500" id={`present-${idx}`} />
                              <label htmlFor={`present-${idx}`} className="text-sm font-bold text-slate-400 cursor-pointer">I currently work here</label>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Duties & Responsibilities</label>
                           <textarea placeholder="Tell us about your daily tasks..." value={job.responsibilities} onChange={e => updateJob(idx, { responsibilities: e.target.value })} className="bg-slate-800 border border-white/5 rounded-xl p-4 w-full min-h-[100px]" />
                        </div>
                     </div>
                   ))}
                   <button onClick={addJob} className="w-full py-6 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 font-bold hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" /> {t('Add Another Job', 'مزید کام کا تجربہ شامل کریں')}
                   </button>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 w-full">
                <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">← {t('Back', 'پیچھے')}</button>
                <button onClick={nextStep} className="flex-1 bg-amber-500 text-slate-900 px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center transition-all active:scale-[0.98]">{t('Next', 'اگے')}</button>
              </div>
            </motion.div>
          )}

          {/* SECTION D: EDUCATION */}
          {initialStep === 4 && (
             <motion.div key="d" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-10 rounded-[40px] border-t border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-purple-500/10 rounded-2xl"><GraduationCap className="text-purple-500" /></div>
                  <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Education', 'تعلیمی قابلیت')}</h2>
                </div>

                <div className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Highest Qualification *</label>
                         <select 
                           value={formData.education.level} 
                           onChange={e => updateFormData({ education: { ...formData.education, level: e.target.value } })}
                           className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white"
                         >
                            {EDUCATIONS.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Institute / School Name</label>
                         <input type="text" placeholder="Govt High School" value={formData.education.institute} onChange={e => updateFormData({ education: { ...formData.education, institute: e.target.value } })} className="bg-slate-900 border border-white/5 rounded-2xl p-4 w-full" />
                      </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Year of Completion</label>
                         <input type="text" placeholder="2018" value={formData.education.year} onChange={e => updateFormData({ education: { ...formData.education, year: e.target.value } })} className="bg-slate-900 border border-white/5 rounded-2xl p-4 w-full" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Extra Certificates / Courses</label>
                         <textarea placeholder="Short Course in Graphics..." value={formData.education.certifications} onChange={e => updateFormData({ education: { ...formData.education, certifications: e.target.value } })} className="bg-slate-900 border border-white/5 rounded-2xl p-4 w-full min-h-[80px]" />
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex items-center gap-3 w-full">
                  <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">← {t('Back', 'پیچھے')}</button>
                  <button onClick={nextStep} className="flex-1 bg-amber-500 text-slate-900 px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center transition-all active:scale-[0.98]">{t('Next', 'اگے')}</button>
                </div>
             </motion.div>
          )}

          {/* SECTION E: SKILLS & LANGUAGES */}
          {initialStep === 5 && (
             <motion.div key="e" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
               <div className="glass-card p-10 rounded-[40px] border-t border-white/10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-amber-500/10 rounded-2xl"><Star className="text-amber-500" /></div>
                    <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Skills & Languages', 'مہارتیں اور زبانیں')}</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Tag Inputs */}
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Technical Skills (Press Enter)</label>
                       <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-white/5 rounded-2xl min-h-[60px]">
                          {formData.technicalSkills.map((skill, idx) => (
                            <span key={`${skill}-${idx}`} className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                              {skill} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFormData({ technicalSkills: formData.technicalSkills.filter((s, i) => i !== idx) })} />
                            </span>
                          ))}
                          <input 
                            type="text" 
                            placeholder="Type skill..." 
                            value={techInput}
                            onChange={e => setTechInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && techInput.trim()) {
                                    updateFormData({ technicalSkills: [...formData.technicalSkills, techInput.trim()] });
                                    setTechInput('');
                                }
                            }}
                            className="bg-transparent border-none outline-none text-white text-sm flex-1 min-w-[120px]"
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Soft Skills (Press Enter)</label>
                       <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-white/5 rounded-2xl min-h-[60px]">
                          {formData.softSkills.map((skill, idx) => (
                            <span key={`${skill}-${idx}`} className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                              {skill} <X className="w-3 h-3 cursor-pointer" onClick={() => updateFormData({ softSkills: formData.softSkills.filter((s, i) => i !== idx) })} />
                            </span>
                          ))}
                          <input 
                            type="text" 
                            placeholder="e.g. Communication..." 
                            value={softInput}
                            onChange={e => setSoftInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && softInput.trim()) {
                                    updateFormData({ softSkills: [...formData.softSkills, softInput.trim()] });
                                    setSoftInput('');
                                }
                            }}
                            className="bg-transparent border-none outline-none text-white text-sm flex-1 min-w-[120px]"
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Languages</label>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {LANGUAGES_OPTIONS.map(l => (
                             <button 
                                key={l}
                                onClick={() => {
                                   const languages = formData.languages.includes(l) ? formData.languages.filter(lang => lang !== l) : [...formData.languages, l];
                                   updateFormData({ languages });
                                }}
                                className={cn(
                                    "p-4 rounded-xl border transition-all urdu-text font-bold",
                                    formData.languages.includes(l) ? "bg-amber-500/20 border-amber-500 text-amber-500" : "bg-white/5 border-white/5 text-slate-400"
                                )}
                             >
                                {l}
                             </button>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>

                <div className="flex items-center gap-3 w-full">
                  <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">← {t('Back', 'پیچھے')}</button>
                  <button onClick={nextStep} className="flex-1 bg-amber-500 text-slate-900 px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center transition-all active:scale-[0.98]">{t('Next', 'اگے')}</button>
                </div>
             </motion.div>
          )}

          {/* SECTION F: ADDITIONAL */}
          {initialStep === 6 && (
             <motion.div key="f" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="glass-card p-10 rounded-[40px] border-t border-white/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-500/10 rounded-2xl"><Award className="text-amber-500" /></div>
                  <h2 className="text-2xl md:text-3xl font-black urdu-text">{t('Additional Rewards', 'مزید تفصیلات')}</h2>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">LinkedIn URL (Optional)</label>
                       <div className="flex items-center bg-slate-900 border border-white/5 rounded-2xl px-4">
                          <Linkedin className="w-5 h-5 text-slate-500" />
                          <input type="text" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={e => updateFormData({ linkedin: e.target.value })} className="w-full bg-transparent p-4 outline-none text-white" />
                       </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Achievements or Awards</label>
                      <textarea placeholder="e.g. Employee of the Month 2023..." value={formData.achievements} onChange={e => updateFormData({ achievements: e.target.value })} className="bg-slate-900 border border-white/5 rounded-2xl p-4 w-full min-h-[120px]" />
                   </div>

                   <div className="space-y-4 pt-4">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">What are your goals?</label>
                      <div className="grid sm:grid-cols-2 gap-4">
                         {['Professional CV', 'Better Salary', 'Job Matches', 'Interview Training', 'Overseas Jobs'].map(goal => (
                            <button 
                                key={goal} 
                                onClick={() => {
                                    const goals = formData.goals.includes(goal) ? formData.goals.filter(g => g !== goal) : [...formData.goals, goal];
                                    updateFormData({ goals });
                                }}
                                className={cn(
                                    "p-4 rounded-xl border transition-all urdu-text font-bold text-sm",
                                    formData.goals.includes(goal) ? "bg-amber-500/20 border-amber-500 text-amber-500" : "bg-white/5 border-white/5 text-slate-400"
                                )}
                            >
                                {goal}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex items-center gap-3 w-full">
                  <button onClick={goBack} className="bg-white/5 text-slate-400 font-bold urdu-text px-4 sm:px-6 py-4 sm:py-5 rounded-2xl flex items-center gap-2 hover:text-white transition-colors border border-white/5 whitespace-nowrap text-sm sm:text-base">← {t('Back', 'پیچھے')}</button>
                  <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-amber-500 text-white px-6 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl urdu-text flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 active:scale-95 transition-all">
                    <Sparkles className="w-6 h-6 hidden sm:block" /> {t('Generate AI Report', 'AI رپورٹ حاصل کریں')}
                  </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
