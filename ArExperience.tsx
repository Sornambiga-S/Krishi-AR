import React, { useState } from 'react';
import { ActiveTab, DiseaseInfo } from '../types';
import { PlantVisualizer } from './PlantVisualizer';
import { 
  Glasses, 
  Clock, 
  Sparkles, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface ArExperienceProps {
  currentDisease: DiseaseInfo;
  setActiveTab: (tab: ActiveTab) => void;
  onExploreMicroscopic: () => void;
}

export const ArExperience: React.FC<ArExperienceProps> = ({
  currentDisease,
  setActiveTab,
  onExploreMicroscopic
}) => {
  const [activeStage, setActiveStage] = useState<'healthy' | 'early' | 'severe'>('severe');
  const [selectedHotspot, setSelectedHotspot] = useState<{
    id: string;
    title: string;
    description: string;
    detail: string;
  } | null>({
    id: 'affected-area',
    title: 'Affected Area (Early Blight)',
    description: 'Concentric ring lesion on tomato foliage',
    detail: 'These spots are a visible symptom associated with early blight. The pathogen Alternaria solani produces alternariol toxin which destroys cell walls.'
  });

  const [activeTabDetail, setActiveTabDetail] = useState<'overview' | 'why' | 'micro'>('overview');

  // Map stage to visualizer day
  const stageDayMap = {
    healthy: 1,
    early: 5,
    severe: 10
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300 mb-1">
            <Glasses className="w-3.5 h-3.5 text-emerald-400" />
            <span>HOLOGRAPHIC AR VIEWPORT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            🥽 AR Plant Learning Experience
          </h1>
          <p className="text-sm text-emerald-200/80">
            Simulated smartphone camera overlay with interactive anatomical hotspots and biological overlays.
          </p>
        </div>

        {/* Action to jump to Disease Time Machine */}
        <button
          onClick={() => {
            playClick();
            setActiveTab('time-machine');
          }}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Clock className="w-4 h-4 text-black" />
          <span>Open Disease Time Machine</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Main AR Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simulated Smartphone AR Screen */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Smartphone Frame Container */}
          <div className="relative w-full max-w-2xl rounded-[36px] bg-[#030B08] p-3 sm:p-4 border-4 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
            
            {/* Phone Top Notch / Speaker & Camera sensor */}
            <div className="w-full flex items-center justify-between px-6 pt-1 pb-2">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400/80">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>REC · AR_LIVE</span>
              </div>
              <div className="w-20 h-4 bg-black/80 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
              </div>
              <div className="text-[10px] font-mono text-emerald-400/80">
                98% 🔋
              </div>
            </div>

            {/* Inner Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#04140F] via-[#020B08] to-[#010604] border border-emerald-500/25 min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
              
              {/* Plant 3D Visualizer with interactive Hotspots */}
              <PlantVisualizer
                day={stageDayMap[activeStage]}
                isScanning={false}
                interactiveHotspots={true}
                onHotspotClick={(hs) => {
                  setSelectedHotspot(hs);
                  setActiveTabDetail('overview');
                }}
                selectedHotspotId={selectedHotspot?.id}
                showArGrid={true}
              />

              {/* AR HUD Overlay: Top Left Tag */}
              <div className="absolute top-4 left-4 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 pointer-events-none">
                <div className="text-emerald-400 text-[9px] uppercase">Target Plant</div>
                <div className="font-bold text-white">{currentDisease.cropName} · Foliage</div>
              </div>

              {/* AR HUD Overlay: Top Right Status */}
              <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 pointer-events-none text-right">
                <div className="text-emerald-400 text-[9px] uppercase">Pathogen Detection</div>
                <div className="font-bold text-amber-400">{currentDisease.name} ({currentDisease.confidence}%)</div>
              </div>

              {/* Bottom Stage Switcher (Healthy -> Early Symptoms -> Disease Progression) */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-500/30">
                <button
                  onClick={() => {
                    playClick();
                    setActiveStage('healthy');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeStage === 'healthy'
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 font-bold'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  🌱 Healthy
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveStage('early');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeStage === 'early'
                      ? 'bg-yellow-400 text-black shadow-md shadow-yellow-500/30 font-bold'
                      : 'text-yellow-300 hover:text-white'
                  }`}
                >
                  ⚠️ Early Symptoms
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveStage('severe');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeStage === 'severe'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-bold'
                      : 'text-amber-300 hover:text-white'
                  }`}
                >
                  🍂 Disease Progression
                </button>
              </div>

            </div>

            {/* Bottom Smartphone Bar */}
            <div className="w-full flex items-center justify-center py-2 text-center text-[10px] text-emerald-400/60 font-mono">
              <span>TAP ANY GLOWING PIN TO INSPECT BOTANICAL CELL STRUCTURE</span>
            </div>

          </div>

        </div>

        {/* Right Column: Educational Inspector Card ("What are you seeing?") */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-5 text-left">
            
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AR ANATOMICAL INSPECTOR</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {selectedHotspot?.id.toUpperCase()}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">
                {selectedHotspot ? selectedHotspot.title : 'Tap a hotspot to inspect'}
              </h2>
              <p className="text-xs font-mono text-emerald-300/80">
                {selectedHotspot?.description}
              </p>
            </div>

            {/* Tab Buttons (Explore, Why?, Learn More) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-xs font-semibold">
              <button
                onClick={() => { playClick(); setActiveTabDetail('overview'); }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTabDetail === 'overview'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                🔬 Explore
              </button>

              <button
                onClick={() => { playClick(); setActiveTabDetail('why'); }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTabDetail === 'why'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                💡 Why?
              </button>

              <button
                onClick={() => { playClick(); setActiveTabDetail('micro'); }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTabDetail === 'micro'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                📚 Learn More
              </button>
            </div>

            {/* Educational Content Area */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 min-h-[140px] text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {activeTabDetail === 'overview' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-emerald-300 text-xs uppercase tracking-wider font-mono">
                    "What are you seeing?"
                  </h3>
                  <p>
                    {selectedHotspot?.detail}
                  </p>
                  <p className="text-xs text-emerald-300/70 pt-1">
                    Notice how the concentric rings spread outward like waves, mirroring the daily cycles of fungal mycelium growth.
                  </p>
                </div>
              )}

              {activeTabDetail === 'why' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider font-mono">
                    💡 Why did this happen?
                  </h3>
                  <p>
                    The fungal spores required at least <strong>4 to 8 hours of leaf moisture</strong> at temperatures around 25°C. Once the spore germinated, its germ tube dissolved the leaf's waxy cuticle using cutinase enzymes.
                  </p>
                  <p className="text-xs text-emerald-300/70">
                    Host cells were starved of ATP and collapsed, turning into dead brown necrotic tissue.
                  </p>
                </div>
              )}

              {activeTabDetail === 'micro' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-lime-300 text-xs uppercase tracking-wider font-mono">
                    🔬 Cellular Micro-View
                  </h3>
                  <p>
                    Under 400x magnification, you would observe septate hyphae branching through the intercellular spaces between spongy mesophyll cells, releasing secondary metabolites that degrade the chloroplast membranes.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playClick();
                        onExploreMicroscopic();
                      }}
                      className="text-xs text-emerald-300 font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Observe 15-day timeline in Time Machine →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  playClick();
                  setActiveTab('ask-ai');
                }}
                className="w-full py-2.5 rounded-xl glass-card border border-emerald-400/30 text-xs font-semibold text-emerald-200 hover:text-white flex items-center justify-center space-x-2"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Ask AI: "Why are these spots appearing?"</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setActiveTab('quiz');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-300 flex items-center justify-center space-x-2"
              >
                <span>🎯 Take Quick Quiz on this Symptom</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
