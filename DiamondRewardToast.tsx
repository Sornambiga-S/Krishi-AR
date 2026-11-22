import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface DiamondRewardToastProps {
  show: boolean;
  amount: number;
  reason: string;
  totalDiamonds: number;
  onDismiss: () => void;
}

export const DiamondRewardToast: React.FC<DiamondRewardToastProps> = ({
  show,
  amount,
  reason,
  totalDiamonds,
  onDismiss
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="relative p-4 rounded-2xl bg-[#081f16]/95 border-2 border-lime-400/60 shadow-[0_0_40px_rgba(16,185,129,0.45)] backdrop-blur-xl flex items-center space-x-3.5 max-w-sm">
        
        {/* Glowing Diamond Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-lime-300 flex items-center justify-center shadow-lg shadow-emerald-500/50 shrink-0 animate-bounce">
          <span className="text-2xl">💎</span>
          <div className="absolute inset-0 border border-white/40 rounded-xl pointer-events-none"></div>
        </div>

        {/* Text */}
        <div className="space-y-0.5 text-left flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 text-lime-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-lime-300 animate-spin" />
            <span>+{amount} Krishi Diamond!</span>
          </div>
          <div className="text-sm font-extrabold text-white truncate">
            Pathology Scan Reward
          </div>
          <div className="text-[11px] text-emerald-200/90 truncate">
            {reason}
          </div>
          <div className="text-[10px] font-mono text-lime-400 font-bold pt-0.5">
            Vault Balance: {totalDiamonds} 💎
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onDismiss}
          className="text-emerald-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
