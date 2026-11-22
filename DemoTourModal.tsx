import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { X } from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  activeTab?: ActiveTab;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  setActiveTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      tab: 'home' as ActiveTab,
      title: '1. Welcome to KrishiAR',
      description: 'Futuristic AI + AR agricultural laboratory. Click "Start Plant Scan" to begin diagnosing crop leaves.',
      actionLabel: 'Go to AI Farm Doctor →'
    },
    {
      step: 2,
      tab: 'doctor' as ActiveTab,
      title: '2. AI Farm Doctor Screening',
      description: 'Select "Tomato Leaf" from the sample list. Watch the neural vision pipeline extract lesion features and output Early Blight (91%).',
      actionLabel: 'Proceed to AR Viewport →'
    },
    {
      step: 3,
      tab: 'ar-learning' as ActiveTab,
      title: '3. Holographic AR Viewport',
      description: 'Simulated smartphone AR camera viewport. Click the glowing red Affected Area pin to inspect the target-board lesion!',
      actionLabel: 'Launch Disease Time Machine →'
    },
    {
      step: 4,
      tab: 'time-machine' as ActiveTab,
      title: '4. Disease Time Machine',
      description: 'Drag the slider from Day 1 to Day 15. Observe how fungal conidia land, germinate, and cause complete foliar necrosis.',
      actionLabel: 'Compare Healthy vs Diseased →'
    },
    {
      step: 5,
      tab: 'comparison' as ActiveTab,
      title: '5. Healthy vs Diseased Split Screen',
      description: 'Slide the comparison divider to compare chloroplast health, stomatal guard cells, and cuticle integrity.',
      actionLabel: 'Test in Virtual Lab →'
    },
    {
      step: 6,
      tab: 'virtual-lab' as ActiveTab,
      title: '6. Virtual Farm Lab',
      description: 'Perform "What If?" experiments on moisture, heat, excess water, and nutrients with real-time physiological telemetry.',
      actionLabel: 'Consult AI Farm Doctor →'
    },
    {
      step: 7,
      tab: 'ask-ai' as ActiveTab,
      title: '7. Ask KrishiAR (AI Tutor)',
      description: 'Ask questions like "Why are these spots appearing?" with friendly student-oriented answers and text-to-speech voice.',
      actionLabel: 'Take Pathology Quiz →'
    },
    {
      step: 8,
      tab: 'quiz' as ActiveTab,
      title: '8. AI Quiz & Badge Award',
      description: 'Answer 5 interactive questions to score 5/5, trigger confetti, and earn your "Disease Detective" badge!',
      actionLabel: 'View Progress & Wrap Up →'
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  const handleNextStep = () => {
    playClick();
    if (currentStepIndex < tourSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setActiveTab(tourSteps[nextIndex].tab);
    } else {
      playSuccessChime();
      setActiveTab('progress');
      onClose();
    }
  };

  const handlePrevStep = () => {
    playClick();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setActiveTab(tourSteps[prevIndex].tab);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[92vw] sm:w-[420px] animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel rounded-3xl p-5 border-2 border-emerald-400/50 shadow-[0_15px_45px_rgba(0,0,0,0.8)] space-y-4 text-left">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
              3-Minute Guided Demo Tour
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-emerald-400">
              {currentStepIndex + 1}/{tourSteps.length}
            </span>
            <button
              onClick={() => { playClick(); onClose(); }}
              className="p-1 rounded-full text-emerald-400/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-1.5">
          <h4 className="text-base font-extrabold text-white">
            {currentStep.title}
          </h4>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="text-xs font-mono text-emerald-400/70 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            onClick={handleNextStep}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{currentStep.actionLabel}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
