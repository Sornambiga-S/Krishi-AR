import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEMO_USER_PROFILES } from '../data/mockData';
import { X, Sparkles, User, Lock, Mail, MapPin, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const TN_DISTRICTS = [
  'Thanjavur (Cauvery Delta)',
  'Coimbatore (Kongu Belt)',
  'Nilgiris (Ooty Hills)',
  'Salem (Sago & Mango Hub)',
  'Dindigul (Kodaikanal & Vegetables)',
  'Madurai (Jasmine & Paddy)',
  'Tiruchirappalli (Banana & Paddy)',
  'Dharmapuri (Millets & Tomato)',
  'Krishnagiri (Mango & Ragi)',
  'Perambalur (Small Onion Capital)',
  'Virudhunagar (Cotton & Pulses)',
  'Thoothukudi (Pearl Millet & Salt)',
  'Villupuram (Sugarcane & Groundnut)',
  'Cuddalore (Cashew & Sugarcane)',
  'Tiruvannamalai (Groundnut & Paddy)',
  'Erode (Turmeric & Banana)',
  'Tiruppur (Maize & Poultry)',
  'Namakkal (Poultry & Tapioca)',
  'Kanyakumari (Rubber & Banana)',
  'Theni (Grapes & Cardamom)'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Sign up form state
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Farmer');
  const [district, setDistrict] = useState(TN_DISTRICTS[0]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoLogin = (profile: UserProfile) => {
    playSuccessChime();
    localStorage.setItem('krishi_user_profile', JSON.stringify(profile));
    onLoginSuccess(profile);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email/phone and password.');
      return;
    }

    // Check if stored in localStorage
    const saved = localStorage.getItem('krishi_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.emailOrPhone === loginEmail || loginEmail.includes('demo') || loginEmail.includes('@')) {
          playSuccessChime();
          onLoginSuccess(parsed);
          onClose();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default dynamic login
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: loginEmail.split('@')[0] || 'Krishi User',
      emailOrPhone: loginEmail,
      role: 'Agri Student',
      district: 'Coimbatore (Kongu Belt)',
      diamonds: 10,
      totalScans: 5,
      avatar: '🎓',
      joinedDate: 'Nov 2026'
    };

    playSuccessChime();
    localStorage.setItem('krishi_user_profile', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const avatarMap: Record<UserProfile['role'], string> = {
      'Farmer': '👨‍🌾',
      'Agri Student': '🎓',
      'Agronomist': '🔬',
      'Researcher': '🧬',
      'Agri Enthusiast': '🌱'
    };

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      role,
      district,
      diamonds: 5, // Welcome bonus of 5 diamonds!
      totalScans: 0,
      avatar: avatarMap[role] || '👨‍🌾',
      joinedDate: 'Today'
    };

    playSuccessChime();
    localStorage.setItem('krishi_user_profile', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>KRISHI-ID · TAMIL NADU AGRICULTURAL PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {authMode === 'login' ? 'Welcome Back to KrishiAR' : 'Create Your Krishi-ID'}
          </h2>
          <p className="text-xs text-emerald-200/80">
            {authMode === 'login' 
              ? 'Log in to track your scans, collect Krishi Diamonds 💎, and view your agronomy progress.'
              : 'Sign up to collect 1 Krishi Diamond 💎 per diseased leaf scan and unlock expert TNAU guides!'}
          </p>
        </div>

        {/* Gamification Bonus Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-emerald-900/60 border border-emerald-400/30 flex items-center space-x-3">
          <span className="text-2xl">💎</span>
          <div className="text-xs text-emerald-200 leading-tight">
            <strong className="text-lime-300 font-bold block">Diamond Rewards Active:</strong>
            Earn <span className="text-white font-bold">+1 Diamond 💎</span> every time you scan an infected plant leaf with AI!
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs font-bold">
          <button
            onClick={() => { playClick(); setAuthMode('login'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'login' 
                ? 'bg-emerald-500 text-black shadow-md' 
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { playClick(); setAuthMode('signup'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition-all ${
              authMode === 'signup' 
                ? 'bg-emerald-500 text-black shadow-md' 
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Sign Up (+5 💎 Bonus)
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* =========================================================================
            CASE 1: LOGIN FORM
        ========================================================================== */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address or Mobile Number:</span>
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. farmer.selvam@gmail.com or 9840123456"
                className="w-full p-3 rounded-xl glass-input text-xs text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password:</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl glass-input text-xs text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Log In to KrishiAR</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </form>
        )}

        {/* =========================================================================
            CASE 2: SIGN UP FORM
        ========================================================================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Name:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Selvam Kumar / Priya Sundaram"
                className="w-full p-2.5 rounded-xl glass-input text-xs text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email or Mobile:</span>
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. selvam@cauverydelta.in"
                className="w-full p-2.5 rounded-xl glass-input text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your Role:</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white cursor-pointer"
                >
                  <option value="Farmer" className="bg-emerald-950 text-white">👨‍🌾 Farmer</option>
                  <option value="Agri Student" className="bg-emerald-950 text-white">🎓 Agri Student</option>
                  <option value="Agronomist" className="bg-emerald-950 text-white">🔬 Agronomist / Expert</option>
                  <option value="Researcher" className="bg-emerald-950 text-white">🧬 Researcher</option>
                  <option value="Agri Enthusiast" className="bg-emerald-950 text-white">🌱 Agri Enthusiast</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tamil Nadu District:</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white cursor-pointer"
                >
                  {TN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist} className="bg-emerald-950 text-white">
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create Password:</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full p-2.5 rounded-xl glass-input text-xs text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Account & Claim 5 💎</span>
              <Sparkles className="w-4 h-4 text-black" />
            </button>
          </form>
        )}

        {/* 1-Click Instant Demo Quick Accounts */}
        <div className="border-t border-emerald-500/20 pt-4 space-y-2">
          <div className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-wider flex items-center justify-between">
            <span>⚡ Or Instant 1-Click Demo Profiles:</span>
            <span className="text-[10px] text-lime-400">Pre-loaded with 💎</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_USER_PROFILES.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => handleQuickDemoLogin(prof)}
                className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/25 hover:border-emerald-400/60 hover:bg-emerald-900/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{prof.avatar}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-lime-300 truncate">
                      {prof.name}
                    </div>
                    <div className="text-[10px] text-emerald-300/70 truncate">
                      {prof.role}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono border-t border-emerald-500/20 pt-1 text-emerald-300">
                  <span>{prof.district.split('(')[0]}</span>
                  <span className="text-lime-400 font-bold">💎 {prof.diamonds}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
