import React, { useState } from 'react';
import { CandidateType } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import { clientAuthService } from '../../services/firebaseAuth';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Check,
  RotateCcw
} from 'lucide-react';

interface AuthFlowProps {
  onComplete: () => void;
}

type AuthStep = 
  | 'splash'
  | 'onboarding'
  | 'welcome'
  | 'login'
  | 'register'
  | 'otp_verify'
  | 'forgot_password';

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome');
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [candidateType, setCandidateType] = useState<CandidateType>('fresher');
  const [currentLocation, setCurrentLocation] = useState('Hyderabad');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Hyderabad', 'Mysuru']);
  const [degree, setDegree] = useState('B.E.');
  const [branch, setBranch] = useState('Computer Science');
  const [cgpa, setCgpa] = useState('8.2');
  const [skillsInput, setSkillsInput] = useState('Java, Python, SQL, DSA');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [registerError, setRegisterError] = useState('');

  // OTP state
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpSentTo, setOtpSentTo] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);

  // Forgot password
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Onboarding slides data
  const onboardingSlides = [
    {
      title: 'Discover Coordinated Opportunities',
      subtitle: 'Exclusive hiring drives directly coordinated with enterprise partners like Excelsoft Technologies.',
      tag: 'Smart Matching',
      icon: Briefcase
    },
    {
      title: 'Showcase Multi-Tier Verified Skills',
      subtitle: 'Distinguish your capabilities through self-declared, resume-extracted, and HR-verified skill badges.',
      tag: 'Skill Transparency',
      icon: GraduationCap
    },
    {
      title: 'Never Miss With Proactive Standby',
      subtitle: 'Dynamic waitlists and real-time replacement slot allocations keep you in the recruitment pipeline.',
      tag: 'Rapid Allocation',
      icon: Sparkles
    }
  ];

  const [isLoading, setIsLoading] = useState(false);

  const handleQuickDemoLogin = (personaKey: string) => {
    recruitmentService.switchPersona(personaKey);
    onComplete();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setLoginError('');
    try {
      await clientAuthService.login(loginEmail, loginPassword);
      onComplete();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      setRegisterError('All mandatory fields are required.');
      return;
    }
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }
    if (!termsAccepted) {
      setRegisterError('You must agree to the privacy policy and terms.');
      return;
    }

    setOtpSentTo(phone);
    setCurrentStep('otp_verify');
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setRegisterError('');
    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const candidateData = {
        fullName,
        email,
        phone,
        password,
        candidateType,
        currentLocation,
        preferredLocations,
        degree,
        branch,
        cgpa: parseFloat(cgpa) || 7.5,
        skills: skillsArray.length > 0 ? skillsArray : ['Java', 'SQL', 'Python']
      };

      // 1. Candidate Registration & Authentication
      await clientAuthService.register(candidateData);

      // 2. Synchronize in-memory candidate profile
      recruitmentService.registerNewCandidate(candidateData);

      onComplete();
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed.');
      setCurrentStep('register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setLoginError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await clientAuthService.resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err: any) {
      setLoginError(err.message || 'Failed to dispatch password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreferredLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      if (preferredLocations.length > 1) {
        setPreferredLocations(preferredLocations.filter((l) => l !== loc));
      }
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  // 1. WELCOME SCREEN
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white">
        <div className="pt-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-xl">
            <span className="font-extrabold text-3xl tracking-wider text-white">N</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">NIYOJAN</h1>
          <p className="text-xs text-indigo-200 uppercase tracking-widest mt-1 font-semibold">
            Intelligent Hiring. Seamless Opportunities.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-indigo-200 mt-4">
            <span>Official Hiring Partner:</span>
            <strong className="text-white">Excelsoft Technologies</strong>
          </div>
        </div>

        <div className="my-auto py-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
            <div className="flex items-start gap-3 text-xs text-indigo-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Multi-location preferences (Hyderabad, Mysuru, Bengaluru)</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-indigo-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Automated interview slot allocation & QR attendance check-in</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-indigo-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Dynamic waitlist and real-time replacement standby invitations</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-4">
          <button
            onClick={() => setCurrentStep('onboarding')}
            className="w-full h-12 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStep('login')}
            className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center border border-white/20 active:scale-[0.99] transition-all"
          >
            Candidate Sign In
          </button>

          {/* Quick Demo Switcher Section */}
          <div className="pt-2 text-center">
            <span className="text-[10px] text-indigo-300 uppercase tracking-wider block mb-2 font-medium">
              Or Jump In As Demo Persona:
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                onClick={() => handleQuickDemoLogin('confirmed')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white border border-white/10 transition-colors"
              >
                <div className="font-semibold text-emerald-300">Rohan Sharma</div>
                <div className="text-[10px] text-indigo-200">Confirmed Slot & QR</div>
              </button>
              <button
                onClick={() => handleQuickDemoLogin('replacement_offered')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white border border-white/10 transition-colors"
              >
                <div className="font-semibold text-amber-300">Sneha Reddy</div>
                <div className="text-[10px] text-indigo-200">Replacement Slot Offer</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ONBOARDING SLIDES
  if (currentStep === 'onboarding') {
    const slide = onboardingSlides[onboardingSlide];
    const SlideIcon = slide.icon;

    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-white text-slate-900">
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              N
            </div>
            <span className="font-extrabold text-xs text-slate-900 tracking-tight">NIYOJAN</span>
          </div>
          <button
            onClick={() => setCurrentStep('login')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Skip
          </button>
        </div>

        <div className="my-auto py-8 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
            <SlideIcon className="w-12 h-12 stroke-[1.7]" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3">
            {slide.tag}
          </span>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug max-w-xs">
            {slide.title}
          </h2>

          <p className="text-xs text-slate-600 mt-2.5 max-w-xs leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Dots indicator */}
          <div className="flex items-center gap-2 mt-8">
            {onboardingSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setOnboardingSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  onboardingSlide === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pb-4">
          <button
            onClick={() => {
              if (onboardingSlide < onboardingSlides.length - 1) {
                setOnboardingSlide(onboardingSlide + 1);
              } else {
                setCurrentStep('register');
              }
            }}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
          >
            <span>{onboardingSlide < onboardingSlides.length - 1 ? 'Continue' : 'Create Candidate Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStep('login')}
            className="w-full h-10 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    );
  }

  // 3. LOGIN SCREEN
  if (currentStep === 'login') {
    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-slate-50 text-slate-900">
        <div className="pt-4">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm">
            N
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Candidate Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your recruitment applications, scheduled slots, and standby invitations.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="my-auto py-4 space-y-3.5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          {loginError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. rohan.sharma@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentStep('forgot_password')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-[0.99] transition-all"
          >
            Sign In to NIYOJAN
          </button>
        </form>

        <div className="space-y-3 pb-2 text-center">
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-50 px-2 text-slate-400 font-semibold">Demo Quick Logins</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              onClick={() => handleQuickDemoLogin('confirmed')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-indigo-500"
            >
              Confirmed (Rohan)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('waitlisted')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-indigo-500"
            >
              Waitlist (Ananya)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('standby')}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-indigo-500"
            >
              Standby (Vikram)
            </button>
          </div>

          <p className="text-xs text-slate-600 pt-2">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentStep('register')}
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Register Here
            </button>
          </p>
        </div>
      </div>
    );
  }

  // 4. REGISTRATION SCREEN (Fresher / Experienced + Preferences)
  if (currentStep === 'register') {
    return (
      <div className="min-h-full flex flex-col justify-between p-5 bg-slate-50 text-slate-900 overflow-y-auto">
        <div className="pt-2">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-3 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <h2 className="text-xl font-extrabold text-slate-900">Candidate Registration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create your recruitment profile for Excelsoft Technologies hiring drives.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="my-3 space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {registerError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {registerError}
            </div>
          )}

          {/* Candidate Type Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Candidate Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCandidateType('fresher')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  candidateType === 'fresher'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className={`w-4 h-4 shrink-0 mt-0.5 ${candidateType === 'fresher' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Fresher</div>
                  <div className="text-[10px] text-slate-500">2026 Graduating Batch</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCandidateType('experienced')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  candidateType === 'experienced'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <Briefcase className={`w-4 h-4 shrink-0 mt-0.5 ${candidateType === 'experienced' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Experienced</div>
                  <div className="text-[10px] text-slate-500">1+ Years Work Exp</div>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sushmita Jena"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Create Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Location Preferences */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Preferred Hiring Locations *
              </label>
              <span className="text-[10px] text-slate-400">Select multiple</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Hyderabad', 'Mysuru', 'Bengaluru', 'Pune', 'Chennai'].map((loc) => {
                const isSelected = preferredLocations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => togglePreferredLocation(loc)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{loc}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education & CGPA */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Degree</label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none"
              >
                <option value="B.E.">B.E.</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">CGPA (10)</label>
              <input
                type="number"
                step="0.01"
                min="5"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Technical Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Java, Python, SQL, DSA, React"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Consent */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-600 leading-tight">
                I declare all educational and experience records are authentic and accept the recruitment drive guidelines & absence policies of Excelsoft Technologies.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all mt-2"
          >
            Verify Mobile & Complete Registration
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 pb-2">
          Already registered?{' '}
          <button
            onClick={() => setCurrentStep('login')}
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Sign In
          </button>
        </p>
      </div>
    );
  }

  // 5. OTP VERIFICATION SCREEN
  if (currentStep === 'otp_verify') {
    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-white text-slate-900">
        <div className="pt-4">
          <button
            onClick={() => setCurrentStep('register')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-3 border border-indigo-100">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Verify Mobile Number</h2>
          <p className="text-xs text-slate-500 mt-1">
            We sent a 6-digit verification code to <span className="font-semibold text-slate-800">{otpSentTo || '+91 98765 43210'}</span>
          </p>
        </div>

        <div className="my-auto py-6">
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 mb-6 text-center">
            <span className="text-[11px] text-indigo-800 font-medium">
              Demo Test Code: <span className="font-mono font-bold tracking-widest text-indigo-950">849201</span>
            </span>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={otpCode[idx]}
                onChange={(e) => {
                  const val = e.target.value;
                  const newArr = [...otpCode];
                  newArr[idx] = val;
                  setOtpCode(newArr);
                }}
                className="w-11 h-12 rounded-xl border border-slate-300 text-center font-mono font-bold text-lg text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOtpCode(['8', '4', '9', '2', '0', '1'])}
            className="mx-auto block text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Auto-fill demo OTP (849201)
          </button>
        </div>

        <div className="space-y-3 pb-4">
          <button
            onClick={handleVerifyOtp}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Enter NIYOJAN</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => alert('New verification code sent!')}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resend code</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. FORGOT PASSWORD
  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-white text-slate-900">
      <div className="pt-4">
        <button
          onClick={() => setCurrentStep('login')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1"
        >
          ← Back to Login
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="my-auto py-6">
        {resetSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Reset Link Dispatched
            </div>
            <p>
              We've dispatched a secure password reset link to <strong>{resetEmail}</strong>. Please check your inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <button
              onClick={handleForgotPasswordSubmit}
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? 'Sending...' : 'Send Password Reset Link'}
            </button>
          </div>
        )}
      </div>

      <div className="pb-4">
        <button
          onClick={() => setCurrentStep('login')}
          className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};
