import React from 'react';
import { ActiveTab } from '../types';
import { PlantVisualizer } from './PlantVisualizer';
import { 
  Scan, 
  Sparkles, 
  Glasses, 
  Clock, 
  FlaskConical, 
  ArrowRight, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onStartGuidedTour: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab, onStartGuidedTour }) => {
  return (
    <div className="relative pt-6 pb-16 space-y-16">
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* AI Status Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono shadow-inner shadow-emerald-500/10">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-semibold tracking-wide">AI STATUS</span>
              <span className="text-emerald-400/80">·</span>
              <span className="text-emerald-200">Ready to analyze</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Meet Your{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300 bg-clip-text text-transparent">
                  AI Farm
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100/80 font-normal max-w-xl leading-relaxed">
                Learn agriculture by seeing it, exploring it, and interacting with it. Scan leaves with your live camera, inspect cellular diseases in AR, and simulate plant biology across 50 Tamil Nadu crops and plants in real-time.
              </p>
            </div>

            {/* Floating Quote Card */}
            <div className="p-4 rounded-xl glass-card border border-emerald-500/20 relative overflow-hidden max-w-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 italic leading-relaxed">
                  "Point your camera at a plant and let KrishiAR teach you what you're seeing."
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playClick();
                  setActiveTab('doctor');
                }}
                className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-black font-bold text-sm sm:text-base flex items-center space-x-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Scan className="w-5 h-5 text-black" />
                <span>Start Plant Scan</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  setActiveTab('crop-explorer');
                }}
                className="px-6 py-3.5 rounded-xl glass-card border border-emerald-400/30 text-emerald-200 font-semibold text-sm sm:text-base hover:bg-emerald-950/60 hover:text-white transition-all active:scale-95"
              >
                Explore Agriculture
              </button>

              <button
                onClick={() => {
                  playClick();
                  onStartGuidedTour();
                }}
                className="px-4 py-3 rounded-xl border border-dashed border-emerald-500/40 text-emerald-300/90 text-xs sm:text-sm font-medium hover:border-emerald-400 hover:text-emerald-200 transition-colors flex items-center space-x-1.5"
              >
                <span>⚡ 3-Min Demo Flow</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-md border-t border-emerald-500/15">
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-300">91%</div>
                <div className="text-[11px] text-emerald-400/70 uppercase tracking-wider">AI Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-300">3D AR</div>
                <div className="text-[11px] text-emerald-400/70 uppercase tracking-wider">Holographic</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-300">0–15 Days</div>
                <div className="text-[11px] text-emerald-400/70 uppercase tracking-wider">Time Machine</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Scanning Visualizer */}
          <div className="lg:col-span-6 relative">
            
            {/* Glowing Backdrop Mesh */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-lime-500/20 rounded-3xl blur-2xl -z-10"></div>

            <div className="relative glass-panel rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-2xl overflow-hidden">
              
              {/* Header HUD Bar */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-emerald-500/20 text-xs font-mono">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>LIVE BOTANICAL HUD · V2.4</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>AR READY</span>
                </div>
              </div>

              {/* Plant Visualizer Canvas */}
              <div className="relative h-[340px] sm:h-[400px]">
                <PlantVisualizer 
                  day={10} 
                  isScanning={true} 
                  interactiveHotspots={false}
                  showArGrid={true}
                />

                {/* Floating HUD Cards around Visualizer */}
                <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[11px] space-y-0.5 shadow-lg pointer-events-none float-animation">
                  <div className="text-emerald-400 font-mono uppercase text-[9px]">Crop Detected</div>
                  <div className="text-white font-bold">Tomato (S. lycopersicum)</div>
                </div>

                <div className="absolute bottom-4 left-4 p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/40 text-[11px] space-y-0.5 shadow-lg pointer-events-none">
                  <div className="text-amber-400 font-mono uppercase text-[9px] flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Plant Health</span>
                  </div>
                  <div className="text-white font-semibold">Needs Attention (Early Blight)</div>
                </div>

                <div className="absolute top-4 right-4 p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-emerald-400/30 text-[11px] space-y-0.5 shadow-lg pointer-events-none text-right">
                  <div className="text-emerald-400 font-mono uppercase text-[9px]">Confidence</div>
                  <div className="text-emerald-300 font-mono font-bold text-sm">91% Screening</div>
                </div>

              </div>

              {/* Bottom Quick Action Strip */}
              <div className="pt-3 mt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-emerald-300/70">
                  Interactive holographic demo model
                </span>
                <button
                  onClick={() => {
                    playClick();
                    setActiveTab('ar-learning');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-semibold text-emerald-300 flex items-center space-x-1.5 transition-colors"
                >
                  <Glasses className="w-3.5 h-3.5" />
                  <span>Launch AR View</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Futuristic Educational Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Futuristic Educational Laboratory
          </h2>
          <p className="text-sm sm:text-base text-emerald-300/70 max-w-xl mx-auto">
            Scan → Identify → Understand → Visualize → Learn → Test
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: AI Farm Doctor */}
          <div 
            onClick={() => { playClick(); setActiveTab('doctor'); }}
            className="p-5 rounded-2xl glass-card border border-emerald-500/20 cursor-pointer group hover:border-emerald-400/50"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>AI Farm Doctor</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Upload leaf images or scan live plants. Neural vision models detect blights, rusts, and nutrient stress in seconds.
            </p>
          </div>

          {/* Card 2: AR Learning */}
          <div 
            onClick={() => { playClick(); setActiveTab('ar-learning'); }}
            className="p-5 rounded-2xl glass-card border border-emerald-500/20 cursor-pointer group hover:border-emerald-400/50"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <Glasses className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>AR Learning</span>
              <ArrowRight className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Inspect diseased leaf spots with a simulated smartphone camera, tapping glowing hotspots for cellular insights.
            </p>
          </div>

          {/* Card 3: Disease Time Machine */}
          <div 
            onClick={() => { playClick(); setActiveTab('time-machine'); }}
            className="p-5 rounded-2xl glass-card border border-emerald-500/20 cursor-pointer group hover:border-emerald-400/50"
          >
            <div className="w-12 h-12 rounded-xl bg-lime-500/20 border border-lime-400/30 flex items-center justify-center text-lime-300 mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Time Machine</span>
              <ArrowRight className="w-4 h-4 text-lime-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Slide from Day 1 to Day 15 to watch how microscopic fungal spores invade leaf tissue and cause defoliation.
            </p>
          </div>

          {/* Card 4: Virtual Farm Lab */}
          <div 
            onClick={() => { playClick(); setActiveTab('virtual-lab'); }}
            className="p-5 rounded-2xl glass-card border border-emerald-500/20 cursor-pointer group hover:border-emerald-400/50"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
              <span>Virtual Farm Lab</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Run "What If?" experiments on moisture, heat, excess water, and fertilizer nutrients to observe plant reactions.
            </p>
          </div>

        </div>
      </section>

      {/* Safety & Educational Disclaimer Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 rounded-xl bg-[#051A13]/80 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Educational Screening Platform:</strong> Simulated AI diagnosis & AR visualizations designed for students, research, and classroom demonstration.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px]">
              DEMO V2.4
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
