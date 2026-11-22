import React from 'react';
import { ActiveTab, UserProgress, UserProfile } from '../types';
import {
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface MyProgressProps {
  userProgress: UserProgress;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const MyProgress: React.FC<MyProgressProps> = ({
  userProgress,
  setActiveTab,
  currentUser,
  onOpenAuth
}) => {
  const percentToNextLevel = Math.round((userProgress.xp / userProgress.nextLevelXp) * 100);
  const totalDiamonds = userProgress.diamonds ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <Award className="w-3.5 h-3.5 text-lime-400" />
            <span>STUDENT PROFILE & ACADEMIC DOSSIER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            🏆 My Progress & Badges
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/80">
            Track your agricultural learning milestones, earned credentials, and upcoming lessons.
          </p>
        </div>

        {/* Level Tag */}
        <div className="p-3.5 rounded-2xl glass-card border border-emerald-400/40 flex items-center space-x-3 self-start md:self-auto">
          <span className="text-3xl">🏅</span>
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase text-emerald-400">Current Level</div>
            <div className="text-sm font-extrabold text-white">{userProgress.level}</div>
          </div>
        </div>
      </div>

      {/* =========================================================
          USER IDENTITY CARD (shown when logged in)
      ========================================================== */}
      {currentUser ? (
        <div className="p-5 sm:p-7 rounded-3xl glass-panel border border-emerald-500/40 shadow-2xl space-y-5 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-900/60 border-2 border-emerald-400/50 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20 shrink-0">
              {currentUser.avatar}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#04100C] flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-black" />
              </div>
            </div>

            {/* Identity info */}
            <div className="flex-1 space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.name}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded-full bg-lime-500/20 border border-lime-400/40 text-lime-300 font-bold">
                  {currentUser.role}
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <MapPin className="w-3 h-3" />
                  {currentUser.district}
                </span>
              </div>
              <div className="text-[11px] text-emerald-400/70 font-mono">
                Member since {currentUser.joinedDate} · {currentUser.emailOrPhone}
              </div>
            </div>

            {/* Stats quicklook */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-teal-950/90 border border-cyan-400/50 text-center min-w-[72px] shadow-md shadow-cyan-500/20">
                <div className="text-2xl font-extrabold text-white font-mono">💎 {totalDiamonds}</div>
                <div className="text-[10px] text-cyan-300 font-mono uppercase tracking-wide">Diamonds</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center min-w-[72px]">
                <div className="text-2xl font-extrabold text-white font-mono">🔬 {currentUser.totalScans}</div>
                <div className="text-[10px] text-emerald-300 font-mono uppercase tracking-wide">Scans</div>
              </div>
            </div>
          </div>

          {/* Diamond progress bar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-emerald-950/60 border border-cyan-400/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold">💎 Krishi Diamond Vault</span>
              <span className="text-white font-bold">{totalDiamonds} / 50 (Rank Up at 50!)</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-950/80 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min((totalDiamonds / 50) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-emerald-300/70">
              Scan more diseased plant leaves with AI to earn +1 💎 per scan! Reach 50 to unlock <span className="text-lime-300 font-bold">Platinum Agronomist Rank</span>.
            </p>
          </div>
        </div>
      ) : (
        /* Not logged in — show sign-in prompt */
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900/50 border border-emerald-500/30 text-3xl mx-auto">
            👤
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">You are not signed in</h3>
            <p className="text-xs text-emerald-300/80 max-w-md mx-auto">
              Create a free <strong>Krishi-ID</strong> to track your progress, collect <strong>💎 Diamonds</strong> every time you scan a diseased leaf, and unlock badges!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => { playClick(); onOpenAuth(); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400 text-black font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Sign In / Sign Up (+5 💎 Bonus)
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-400/70 font-mono pt-2">
            <span>💎 1 Diamond per scan</span>
            <span>·</span>
            <span>🎓 Role-based profiles</span>
            <span>·</span>
            <span>📍 District-level agronomy</span>
          </div>
        </div>
      )}

      {/* Top Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left: XP & Progress */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 text-left">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Total Agricultural Experience
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white mt-1">
                {userProgress.xp.toLocaleString()}{' '}
                <span className="text-xl text-emerald-400 font-sans">XP</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono uppercase text-emerald-400/80">
                Next Rank: Master Agronomist
              </span>
              <div className="text-sm font-bold text-emerald-200 mt-0.5">
                {userProgress.nextLevelXp - userProgress.xp} XP to Level 5
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-emerald-300">
              <span>Level 4 (1,200 XP)</span>
              <span>{percentToNextLevel}% Complete</span>
              <span>Level 5 (1,600 XP)</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-3 overflow-hidden border border-emerald-500/20">
              <div
                className="bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${percentToNextLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/20">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/15">
              <div className="text-2xl font-bold font-mono text-emerald-300">{userProgress.plantsExplored}</div>
              <div className="text-[11px] text-emerald-400/70 uppercase">Plants Explored</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/15">
              <div className="text-2xl font-bold font-mono text-lime-300">{userProgress.diseasesLearned}</div>
              <div className="text-[11px] text-emerald-400/70 uppercase">Diseases Mastered</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/15">
              <div className="text-2xl font-bold font-mono text-teal-300">{userProgress.quizScoreAverage}%</div>
              <div className="text-[11px] text-emerald-400/70 uppercase">Quiz Accuracy</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/60 to-teal-950/60 border border-cyan-400/40">
              <div className="text-2xl font-bold font-mono text-white">💎 {totalDiamonds}</div>
              <div className="text-[11px] text-cyan-300 uppercase">Diamonds</div>
            </div>
          </div>

        </div>

        {/* Right: Circular Progress Ring */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-3">

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="text-emerald-950/80" strokeWidth="10" stroke="currentColor" fill="transparent" />
              <circle
                cx="60" cy="60" r="50"
                className="text-lime-400"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - 0.72)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-white">72%</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Course Progress</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white">Curriculum Velocity</div>
            <p className="text-xs text-emerald-300/70 mt-0.5">
              On track to complete certified agricultural curriculum this week!
            </p>
          </div>

        </div>

      </div>

      {/* Continue Learning Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-[#07241A] to-teal-950/90 border border-emerald-400/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span>Recommended Next Lesson</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">Plant Disease Basics — 72% complete</h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl">
            Next topic: Bacterial vs Fungal infection mechanics and preventive mulch barriers.
          </p>
        </div>
        <button
          onClick={() => { playClick(); setActiveTab('doctor'); }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-sm flex items-center space-x-2 shadow-lg shadow-lime-500/25 hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <span>Continue Lesson</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Badges Showcase */}
      <div className="space-y-4 text-left">
        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold text-white">Badges & Accreditations</h3>
          <p className="text-xs sm:text-sm text-emerald-300/80">
            Earn digital credentials by discovering crops, performing AR scans, and acing pathology quizzes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {userProgress.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                badge.unlocked
                  ? 'glass-card border-emerald-400/40 bg-emerald-950/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-emerald-950/20 border-emerald-500/10 opacity-55'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl p-2 rounded-xl bg-emerald-900/40 border border-emerald-500/20">{badge.icon}</span>
                  {badge.unlocked
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <Lock className="w-4 h-4 text-emerald-600" />
                  }
                </div>
                <div className="text-xs font-mono uppercase text-emerald-400 font-semibold text-[10px]">{badge.rarity}</div>
                <div className="text-sm font-bold text-white mt-0.5">{badge.title}</div>
                <p className="text-xs text-emerald-200/70 mt-1 line-clamp-2">{badge.description}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-emerald-500/15 text-[10px] font-mono text-emerald-400/80">
                {badge.unlocked ? `Unlocked on ${badge.unlockedDate}` : 'Incomplete Challenge'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 text-left space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Recent Learning Activities</span>
        </h3>

        <div className="divide-y divide-emerald-500/15">
          {userProgress.recentActivities.length === 0 && (
            <p className="py-4 text-xs text-emerald-400/60 text-center">
              No activities yet. Start scanning plant leaves to log activity!
            </p>
          )}
          {userProgress.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="text-emerald-100 font-medium">{act.action}</span>
              </div>
              <div className="flex items-center space-x-3 font-mono text-xs shrink-0 pl-2">
                <span className="text-lime-300">+{act.xpEarned} XP</span>
                {act.diamondsEarned && (
                  <span className="text-cyan-300 font-bold">+{act.diamondsEarned} 💎</span>
                )}
                <span className="text-emerald-400/60 hidden sm:inline">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
