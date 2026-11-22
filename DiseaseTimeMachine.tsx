import React, { useState } from 'react';
import { ActiveTab, DiseaseInfo } from '../types';
import { PlantVisualizer } from './PlantVisualizer';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight
} from 'lucide-react';
import { playClick, playScanBeep } from '../utils/audio';

interface DiseaseTimeMachineProps {
  currentDisease: DiseaseInfo;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DiseaseTimeMachine: React.FC<DiseaseTimeMachineProps> = ({
  currentDisease,
  setActiveTab
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const daysList = currentDisease.timelineDays;
  const currentDayData = daysList.find(d => d.day === selectedDay) || daysList[0];

  // Auto-play animation through timeline
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedDay((prev) => {
          if (prev === 1) return 5;
          if (prev === 5) return 10;
          if (prev === 10) return 15;
          setIsPlaying(false);
          return 1;
        });
        playScanBeep();
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <Clock className="w-3.5 h-3.5 text-lime-400" />
          <span>CHRONOLOGICAL PATHOLOGY SIMULATOR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          ⏳ Disease Time Machine
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
          Observe how {currentDisease.name} develops from microscopic fungal spore landing on Day 1 to severe tissue defoliation on Day 15.
        </p>
      </div>

      {/* Main Interactive Scientific Lab Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Leaf Morphing & Timeline Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            
            {/* Top Bar with Play/Pause & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 text-xs font-mono">
              <div className="flex items-center space-x-2 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></span>
                <span>SIMULATION ACTIVE · {currentDisease.cropName.toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    playClick();
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 flex items-center space-x-1.5 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setIsPlaying(false);
                    setSelectedDay(1);
                  }}
                  className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:text-white"
                  title="Reset to Day 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="relative h-[360px] sm:h-[420px] flex items-center justify-center">
              <PlantVisualizer
                day={selectedDay}
                isScanning={false}
                interactiveHotspots={true}
                showArGrid={true}
              />

              {/* Day floating badge */}
              <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 text-left pointer-events-none">
                <div className="text-[10px] uppercase font-mono text-emerald-400">Current Phase</div>
                <div className="text-xl font-extrabold text-white">DAY {selectedDay}</div>
                <div className="text-[11px] text-emerald-200/80 font-mono">
                  Chlorophyll: {currentDayData.chlorophyllLevel}%
                </div>
              </div>

              {/* Cellular Damage Metric */}
              <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-right pointer-events-none">
                <div className="text-[10px] uppercase font-mono text-amber-400">Tissue Necrosis</div>
                <div className="text-xl font-extrabold text-amber-300">
                  {currentDayData.damagePercent}%
                </div>
                <div className="text-[11px] text-amber-200/80 font-mono">
                  {selectedDay === 1 ? 'Cuticle Intact' : selectedDay === 15 ? 'Critical Defoliation' : 'Expanding Lesion'}
                </div>
              </div>

            </div>

            {/* Interactive Timeline Slider & Pills */}
            <div className="pt-4 border-t border-emerald-500/20 space-y-4">
              
              {/* Slider Input */}
              <div className="relative px-2">
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={selectedDay}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    // Snap to closest 1, 5, 10, 15
                    let snapped = 1;
                    if (val >= 13) snapped = 15;
                    else if (val >= 8) snapped = 10;
                    else if (val >= 3) snapped = 5;
                    else snapped = 1;
                    setSelectedDay(snapped);
                    playClick();
                  }}
                  className="w-full h-2.5 bg-emerald-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Day Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 15].map((dayNum) => {
                  const isActive = selectedDay === dayNum;
                  return (
                    <button
                      key={dayNum}
                      onClick={() => {
                        playClick();
                        setIsPlaying(false);
                        setSelectedDay(dayNum);
                      }}
                      className={`py-2 px-1 rounded-xl text-center transition-all border ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-extrabold border-lime-300 shadow-lg shadow-emerald-500/25 scale-[1.03]'
                          : 'bg-emerald-950/40 text-emerald-300/80 border-emerald-500/20 hover:border-emerald-400/40 hover:text-white'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">Day {dayNum}</div>
                      <div className="text-[10px] opacity-80 hidden sm:block">
                        {dayNum === 1 ? 'Inoculation' : dayNum === 5 ? 'Pinpricks' : dayNum === 10 ? 'Concentric Rings' : 'Defoliation'}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

        {/* Right Column: Dynamic Scientific Analysis Panels */}
        <div className="lg:col-span-5 space-y-4 text-left">
          
          {/* Main Stage Banner */}
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Biological Stage Breakdown
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentDayData.title}
            </h2>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs font-mono text-emerald-300">
              Pathogen Activity: <strong>{currentDayData.pathogenState}</strong>
            </div>
          </div>

          {/* Card 1: What Happened? */}
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/25 space-y-2">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>What happened?</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {currentDayData.description}
            </p>
          </div>

          {/* Card 2: Why Did It Happen? */}
          <div className="p-5 rounded-2xl glass-card border border-amber-500/25 space-y-2">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Why did it happen?</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {selectedDay === 1 && 'Overhead sprinkler droplets or splashing rain carried fungal conidia onto the leaf surface. The micro-droplet created a humid boundary layer necessary for spore hydration.'}
              {selectedDay === 5 && 'The spore produced an appressorium and infection peg that physically breached stomata. Alternariol mycotoxin disrupted cell membranes, causing electrolyte leakage.'}
              {selectedDay === 10 && 'Fungal hyphae branched radially outwards. Alternating day/night temperatures triggered cyclical spore production, creating the famous concentric rings.'}
              {selectedDay === 15 && 'Necrosis severed vascular veins in the leaflet petiole. The plant activated abscission zone enzymes, causing the entire dead leaf to drop to the soil.'}
            </p>
          </div>

          {/* Card 3: How Did The Disease Progress? */}
          <div className="p-5 rounded-2xl glass-card border border-rose-500/25 space-y-3">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>How did the disease progress?</span>
            </h3>
            
            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-300">Active Chlorophyll Density</span>
                <span className="text-white font-bold">{currentDayData.chlorophyllLevel}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 border border-emerald-500/20 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${currentDayData.chlorophyllLevel}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-300">Necrotic Cell Destruction</span>
                <span className="text-white font-bold">{currentDayData.damagePercent}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 border border-amber-500/20 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${currentDayData.damagePercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick AI Consultation Button */}
          <button
            onClick={() => {
              playClick();
              setActiveTab('ask-ai');
            }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-black" />
            <span>Ask Farm Doctor: "How does this disease spread?"</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

        </div>

      </div>

    </div>
  );
};
