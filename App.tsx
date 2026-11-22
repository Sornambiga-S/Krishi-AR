import React, { useState, useEffect } from 'react';
import { ActiveTab, DiseaseInfo, UserProgress, UserProfile } from './types';
import { DISEASE_DATABASE, INITIAL_USER_PROGRESS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { AiFarmDoctor } from './components/AiFarmDoctor';
import { ArExperience } from './components/ArExperience';
import { DiseaseTimeMachine } from './components/DiseaseTimeMachine';
import { HealthyVsDiseased } from './components/HealthyVsDiseased';
import { VirtualLab } from './components/VirtualLab';
import { CropExplorer } from './components/CropExplorer';
import { LearningPath } from './components/LearningPath';
import { AskKrishiAI } from './components/AskKrishiAI';
import { AiQuiz } from './components/AiQuiz';
import { MyProgress } from './components/MyProgress';
import { DemoTourModal } from './components/DemoTourModal';
import { AuthModal } from './components/AuthModal';
import { DiamondRewardToast } from './components/DiamondRewardToast';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentDisease, setCurrentDisease] = useState<DiseaseInfo>(DISEASE_DATABASE['tomato-early-blight']);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_USER_PROGRESS);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState<boolean>(false);
  const [selectedCropForDoctor, setSelectedCropForDoctor] = useState<string | null>(null);

  // Auth state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Diamond toast state
  const [diamondToast, setDiamondToast] = useState<{
    show: boolean;
    amount: number;
    reason: string;
  }>({ show: false, amount: 1, reason: '' });

  // Load saved user from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('krishi_user_profile');
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        setCurrentUser(parsed);
        setUserProgress((prev) => ({
          ...prev,
          name: parsed.name,
          diamonds: parsed.diamonds
        }));
      } catch (e) {
        console.error('Could not parse saved user:', e);
      }
    }
  }, []);

  // Handle successful login / signup
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUserProgress((prev) => ({
      ...prev,
      name: user.name,
      diamonds: user.diamonds
    }));
    localStorage.setItem('krishi_user_profile', JSON.stringify(user));
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setUserProgress((prev) => ({
      ...prev,
      name: 'Krishi Student Explorer',
      diamonds: 0
    }));
    localStorage.removeItem('krishi_user_profile');
  };

  // Award a diamond and show toast
  const handleCollectDiamond = (amount: number, reason: string) => {
    setUserProgress((prev) => ({ ...prev, diamonds: prev.diamonds + amount }));
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        diamonds: currentUser.diamonds + amount,
        totalScans: currentUser.totalScans + 1
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('krishi_user_profile', JSON.stringify(updatedUser));
    }
    setDiamondToast({ show: true, amount, reason });
  };

  // When AI Farm Doctor finishes screening or user clicks "Explain with AR"
  const handleSelectDiseaseForAr = (disease: DiseaseInfo) => {
    setCurrentDisease(disease);
    setActiveTab('ar-learning');
  };

  // Record scan activity, reward XP + 1 Diamond per scan
  const handleRecordScanActivity = (crop: string, disease: string) => {
    setUserProgress((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      plantsExplored: prev.plantsExplored + 1,
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          action: `Scanned ${crop} — ${disease}`,
          time: 'Just now',
          xpEarned: 50,
          diamondsEarned: 1
        },
        ...prev.recentActivities.slice(0, 5)
      ]
    }));

    // Award 1 diamond per diseased leaf scan
    handleCollectDiamond(1, `${crop} — ${disease} identified!`);
  };

  // Record quiz complete
  const handleQuizComplete = (score: number, total: number) => {
    setUserProgress((prev) => {
      const updatedBadges = prev.badges.map((b) => {
        if (b.id === 'disease-detective') {
          return { ...b, unlocked: true, unlockedDate: 'Today' };
        }
        return b;
      });
      return {
        ...prev,
        xp: prev.xp + 100,
        diseasesLearned: prev.diseasesLearned + 1,
        badges: updatedBadges,
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            action: `Completed Pathology Quick Quiz (${score}/${total})`,
            time: 'Just now',
            xpEarned: 100
          },
          ...prev.recentActivities.slice(0, 5)
        ]
      };
    });
  };

  const totalDiamonds = currentUser ? currentUser.diamonds : userProgress.diamonds;

  return (
    <div className="min-h-screen flex flex-col bg-[#04100C] text-emerald-50 relative selection:bg-emerald-500 selection:text-black">

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartGuidedTour={() => setIsGuidedTourOpen(true)}
        userXp={userProgress.xp}
        diamonds={totalDiamonds}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Diamond Reward Toast */}
      <DiamondRewardToast
        show={diamondToast.show}
        amount={diamondToast.amount}
        reason={diamondToast.reason}
        totalDiamonds={totalDiamonds}
        onDismiss={() => setDiamondToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Auth Modal (Sign Up / Log In) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Sign-in Prompt Banner — shown only when not logged in & on certain tabs */}
      {!currentUser && activeTab === 'doctor' && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-emerald-950/90 border-b border-emerald-500/30 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-emerald-200">
            <span className="text-lg">💎</span>
            <span>
              <strong className="text-lime-300">Sign in free</strong> to earn Krishi Diamonds every time you scan a diseased leaf!
            </span>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <HomeHero
            setActiveTab={setActiveTab}
            onStartGuidedTour={() => setIsGuidedTourOpen(true)}
          />
        )}

        {activeTab === 'doctor' && (
          <AiFarmDoctor
            setActiveTab={setActiveTab}
            onSelectDiseaseForAr={handleSelectDiseaseForAr}
            onRecordScanActivity={handleRecordScanActivity}
            onCollectDiamond={handleCollectDiamond}
            selectedCropForDoctor={selectedCropForDoctor}
          />
        )}

        {activeTab === 'ar-learning' && (
          <ArExperience
            currentDisease={currentDisease}
            setActiveTab={setActiveTab}
            onExploreMicroscopic={() => setActiveTab('time-machine')}
          />
        )}

        {activeTab === 'time-machine' && (
          <DiseaseTimeMachine
            currentDisease={currentDisease}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'comparison' && (
          <HealthyVsDiseased
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'virtual-lab' && (
          <VirtualLab
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'crop-explorer' && (
          <CropExplorer
            setActiveTab={setActiveTab}
            onSelectCropForDoctor={(cropName) => {
              setSelectedCropForDoctor(cropName);
              setActiveTab('doctor');
            }}
          />
        )}

        {activeTab === 'learn-path' && (
          <LearningPath
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ask-ai' && (
          <AskKrishiAI
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'quiz' && (
          <AiQuiz
            setActiveTab={setActiveTab}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {activeTab === 'progress' && (
          <MyProgress
            userProgress={userProgress}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Guided Demo Tour Floating Control */}
      <DemoTourModal
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Footer */}
      <footer className="border-t border-emerald-500/15 py-8 px-4 text-center text-xs text-emerald-400/60 font-mono space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-emerald-300 font-bold">🌱 KrishiAR Platform</span>
          <span>·</span>
          <span>Apple-like simplicity + Futuristic AI laboratory + Modern agriculture</span>
          <span>·</span>
          <span>AI Screening Prototype for Educational Demonstration</span>
        </div>
        <div className="text-[11px] text-emerald-400/40">
          "See Agriculture. Understand Nature. Learn Smarter." · Designed for School, College & Urban Students
        </div>
      </footer>

    </div>
  );
};

export default App;
