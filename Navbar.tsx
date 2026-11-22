import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, UserProfile } from '../types';
import { 
  Home, 
  Scan, 
  Glasses, 
  Clock, 
  FlaskConical, 
  Wheat, 
  HelpCircle, 
  Award, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Play, 
  Menu, 
  X,
  SplitSquareVertical,
  User,
  LogOut,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartGuidedTour: () => void;
  userXp: number;
  diamonds: number;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onStartGuidedTour,
  userXp,
  diamonds,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClick();
  };

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'doctor' as ActiveTab, label: 'AI Farm Doctor', icon: Scan },
    { id: 'ar-learning' as ActiveTab, label: 'AR Learning', icon: Glasses },
    { id: 'time-machine' as ActiveTab, label: 'Time Machine', icon: Clock },
    { id: 'comparison' as ActiveTab, label: 'Compare', icon: SplitSquareVertical },
    { id: 'virtual-lab' as ActiveTab, label: 'Virtual Lab', icon: FlaskConical },
    { id: 'crop-explorer' as ActiveTab, label: 'Crops', icon: Wheat },
    { id: 'learn-path' as ActiveTab, label: 'Journey', icon: BookOpen },
    { id: 'ask-ai' as ActiveTab, label: 'Ask AI', icon: HelpCircle },
    { id: 'quiz' as ActiveTab, label: 'Quiz', icon: Award },
    { id: 'progress' as ActiveTab, label: 'Progress', icon: Award },
  ];

  return (
    <>
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            
            {/* Logo & Branding */}
            <div 
              onClick={() => { playClick(); setActiveTab('home'); }} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 p-0.5 shadow-lg shadow-emerald-900/40 group-hover:shadow-emerald-500/30 transition-all duration-300">
                <div className="w-full h-full bg-[#081813] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/10 radar-sweep opacity-40"></div>
                  {/* Leaf + AI Circuit + AR reticle icon */}
                  <span className="text-xl relative z-10">🌱</span>
                  <div className="absolute inset-1 border border-emerald-400/30 rounded-lg pointer-events-none"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-lime-200 to-teal-200 bg-clip-text text-transparent">
                    KrishiAR
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 uppercase tracking-widest hidden sm:inline-block">
                    AI + AR
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400/70 font-medium tracking-tight hidden md:inline-block">
                  See Agriculture. Understand Nature. Learn Smarter.
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playClick();
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm shadow-emerald-500/20'
                        : 'text-emerald-100/70 hover:text-emerald-200 hover:bg-emerald-950/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-emerald-400/60'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons & Badges */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Guided Demo Button */}
              <button
                onClick={() => {
                  playClick();
                  onStartGuidedTour();
                }}
                className="relative group overflow-hidden px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-black flex items-center space-x-1.5 shadow-md shadow-emerald-900/50 hover:shadow-emerald-400/30 transition-all active:scale-95"
                title="Start 3-5 Minute Interactive Guided Demo"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span className="hidden sm:inline">Guided Demo</span>
                <span className="sm:hidden">Demo</span>
              </button>

              {/* Krishi Diamonds Vault Pill */}
              <button
                onClick={() => { playClick(); setActiveTab('progress'); }}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 border border-cyan-400/50 text-xs font-mono text-cyan-200 hover:border-cyan-300 shadow-sm shadow-cyan-500/20 transition-all"
                title="Your Krishi Diamonds Vault (Earn 1 per scanned diseased leaf)"
              >
                <span className="text-sm">💎</span>
                <span className="font-bold text-white">{diamonds}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleSoundToggle}
                className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:text-emerald-200 hover:border-emerald-400/40 transition-colors"
                title={soundOn ? 'Mute SFX' : 'Enable Sound FX'}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-emerald-600" />}
              </button>

              {/* User Profile or Sign In Button */}
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => { playClick(); setProfileDropdownOpen(!profileDropdownOpen); }}
                    className="flex items-center space-x-1.5 p-1 pl-2 pr-2.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs text-white hover:border-emerald-400 transition-all shadow-md"
                  >
                    <span className="text-base">{currentUser.avatar}</span>
                    <span className="hidden md:inline font-bold text-emerald-200 truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-emerald-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-emerald-500/40 p-4 shadow-2xl space-y-3 z-50 text-left animate-in fade-in duration-200">
                      <div className="flex items-center space-x-3 border-b border-emerald-500/20 pb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-900/60 flex items-center justify-center text-2xl border border-emerald-500/30">
                          {currentUser.avatar}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                          <p className="text-[10px] text-lime-300 font-semibold">{currentUser.role}</p>
                          <p className="text-[10px] text-emerald-300/70 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{currentUser.district.split('(')[0]}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
                          <span className="text-emerald-400 block text-[10px]">DIAMONDS</span>
                          <span className="text-sm font-bold text-white">💎 {diamonds}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
                          <span className="text-emerald-400 block text-[10px]">TOTAL SCANS</span>
                          <span className="text-sm font-bold text-white">🔬 {currentUser.totalScans}</span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-1">
                        <button
                          onClick={() => {
                            playClick();
                            setActiveTab('progress');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 text-xs font-semibold text-emerald-300 hover:text-white flex items-center justify-between"
                        >
                          <span>View Full Profile</span>
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            playClick();
                            onLogout();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-rose-950/40 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 flex items-center justify-between transition-colors"
                        >
                          <span>Sign Out</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { playClick(); onOpenAuth(); }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In <span className="hidden sm:inline">(+5 💎)</span></span>
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-emerald-500/20 bg-[#081813]/95 backdrop-blur-2xl px-4 py-4 space-y-1.5 shadow-2xl">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playClick();
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                      isActive
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                        : 'text-emerald-100/70 hover:bg-emerald-900/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Dock Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06140F]/95 backdrop-blur-xl border-t border-emerald-500/20 px-2 py-2 flex items-center justify-around shadow-2xl">
        {[
          { id: 'home' as ActiveTab, label: 'Home', icon: Home },
          { id: 'doctor' as ActiveTab, label: 'Doctor', icon: Scan },
          { id: 'ar-learning' as ActiveTab, label: 'AR', icon: Glasses },
          { id: 'time-machine' as ActiveTab, label: 'Time', icon: Clock },
          { id: 'ask-ai' as ActiveTab, label: 'Ask AI', icon: HelpCircle },
          { id: 'progress' as ActiveTab, label: 'Stats', icon: Award },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playClick();
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
                isActive ? 'text-emerald-300 scale-105' : 'text-emerald-500/60 hover:text-emerald-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
