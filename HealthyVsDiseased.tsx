import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  SplitSquareVertical, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface HealthyVsDiseasedProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const HealthyVsDiseased: React.FC<HealthyVsDiseasedProps> = ({ setActiveTab }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage
  const [selectedCellArea, setSelectedCellArea] = useState<string>('palisade');

  const cellParts: Record<string, {
    title: string;
    healthy: string;
    diseased: string;
    impact: string;
  }> = {
    epidermis: {
      title: 'Upper Epidermis & Waxy Cuticle',
      healthy: 'Intact continuous cuticle layer preventing unregulated moisture loss and repelling water droplets.',
      diseased: 'Cuticle mechanically breached by fungal appressoria. Water droplets accumulate and spores enter freely.',
      impact: 'Allows pathogens direct access into internal photosynthetic chambers.'
    },
    palisade: {
      title: 'Palisade Mesophyll & Chloroplasts',
      healthy: 'Densely packed columnar cells filled with active green chloroplasts capturing 95% of incoming photons.',
      diseased: 'Cells broken down by alternariol toxins. Chlorophyll bleached, forming chlorotic halo and dark necrosis.',
      impact: 'Photosynthetic capacity drops by up to 75% in the lesion zone.'
    },
    vascular: {
      title: 'Vascular Bundles (Xylem & Phloem)',
      healthy: 'Clear continuous vessels transporting water, minerals, and synthesized glucose from roots to tips.',
      diseased: 'Hyphal mycelium clogs xylem vessels, inducing water stress, leaflet wilting, and nutrient starvation.',
      impact: 'Causes secondary systemic leaf droop and premature leaf drop.'
    },
    stomata: {
      title: 'Stomatal Guard Cells & Transpiration',
      healthy: 'Guard cells swell and shrink rhythmically to regulate CO₂ uptake and cooling transpiration.',
      diseased: 'Guard cells paralyzed in abnormal open or collapsed states due to fungal fungal toxin interference.',
      impact: 'Rapid leaf dehydration and loss of thermal regulation.'
    }
  };

  const currentPart = cellParts[selectedCellArea] || cellParts.palisade;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-400" />
          <span>CYTOLOGICAL COMPARISON MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          🌿 Healthy vs Diseased Mode
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
          Drag the comparison slider to inspect structural differences between pristine tomato foliage and Early Blight infection.
        </p>
      </div>

      {/* Main Interactive Split Screen Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Before/After Split Viewer */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-2xl relative select-none">
            
            {/* Visual Viewport Container with Draggable Split */}
            <div className="relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#030D09]">
              
              {/* Healthy Leaf (Background Left) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950/50 via-[#062016] to-[#03140E]">
                {/* SVG Healthy Leaf Drawing */}
                <svg viewBox="0 0 400 400" className="w-[300px] h-[300px] drop-shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
                  <path
                    d="M 200,40 C 310,90 350,220 230,340 C 215,355 200,360 200,370 C 200,360 185,355 170,340 C 50,220 90,90 200,40 Z"
                    fill="url(#healthyGrad)"
                    stroke="#34D399"
                    strokeWidth="3"
                  />
                  <line x1="200" y1="370" x2="200" y2="50" stroke="#A7F3D0" strokeWidth="4" />
                  {/* Lateral veins */}
                  <path d="M 200,120 Q 250,100 280,95" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 200,120 Q 150,100 120,95" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 200,180 Q 260,165 295,160" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 200,180 Q 140,165 105,160" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 200,240 Q 250,230 270,230" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 200,240 Q 150,230 130,230" stroke="#A7F3D0" strokeWidth="2" fill="none" opacity="0.8" />
                  <defs>
                    <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Left Tag */}
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-400/40 text-left">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Status</span>
                  <div className="text-sm font-extrabold text-white flex items-center space-x-1">
                    <span>HEALTHY 🌱</span>
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">Chlorophyll: 98%</div>
                </div>
              </div>

              {/* Diseased Leaf (Foreground Right with Clip Path) */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1C1306] via-[#140E05] to-[#0A0703]"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                {/* SVG Diseased Leaf Drawing with Lesions */}
                <svg viewBox="0 0 400 400" className="w-[300px] h-[300px] drop-shadow-[0_10px_25px_rgba(234,179,8,0.2)]">
                  <path
                    d="M 200,40 C 310,90 350,220 230,340 C 215,355 200,360 200,370 C 200,360 185,355 170,340 C 50,220 90,90 200,40 Z"
                    fill="url(#diseasedGrad)"
                    stroke="#D97706"
                    strokeWidth="3"
                  />
                  <line x1="200" y1="370" x2="200" y2="50" stroke="#FEF08A" strokeWidth="4" opacity="0.6" />
                  
                  {/* Concentric rings Early Blight */}
                  <circle cx="250" cy="180" r="42" fill="rgba(250, 204, 21, 0.4)" />
                  <circle cx="250" cy="180" r="32" fill="#78350F" stroke="#D97706" strokeWidth="2" />
                  <circle cx="250" cy="180" r="22" fill="#451A03" stroke="#B45309" strokeWidth="2" />
                  <circle cx="250" cy="180" r="12" fill="#292524" stroke="#78350F" strokeWidth="2" />

                  {/* Secondary spot */}
                  <circle cx="215" cy="270" r="24" fill="rgba(234, 179, 8, 0.35)" />
                  <circle cx="215" cy="270" r="16" fill="#451A03" stroke="#B45309" strokeWidth="1.5" />

                  <defs>
                    <linearGradient id="diseasedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#84CC16" />
                      <stop offset="40%" stopColor="#CA8A04" />
                      <stop offset="80%" stopColor="#713F12" />
                      <stop offset="100%" stopColor="#451A03" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Right Tag */}
                <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/40 text-right">
                  <span className="text-[10px] font-mono text-amber-400 uppercase">Status</span>
                  <div className="text-sm font-extrabold text-amber-300 flex items-center space-x-1 justify-end">
                    <span>DISEASED 🍂</span>
                  </div>
                  <div className="text-[10px] text-amber-200 font-mono">Chlorophyll: 38%</div>
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#34D399] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs shadow-xl border-2 border-emerald-500">
                  ↔
                </div>
              </div>

            </div>

            {/* Slider Control */}
            <div className="pt-4 space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => {
                  setSliderPos(parseInt(e.target.value));
                  playClick();
                }}
                className="w-full h-2.5 bg-emerald-950/80 rounded-lg appearance-none cursor-ew-resize accent-emerald-400"
              />
              <div className="flex justify-between text-xs font-mono text-emerald-400/80">
                <span>← 100% HEALTHY VIEW</span>
                <span>DRAG SLIDER TO REVEAL</span>
                <span>100% DISEASED VIEW →</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Anatomical Part Inspector */}
        <div className="lg:col-span-5 space-y-4 text-left">
          
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-4">
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                Microscopic Anatomy Inspector
              </span>
              <h2 className="text-xl font-bold text-white">
                Select Anatomical Region:
              </h2>
            </div>

            {/* 4 Anatomical Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'palisade', label: 'Chloroplasts' },
                { id: 'epidermis', label: 'Waxy Cuticle' },
                { id: 'vascular', label: 'Vascular Veins' },
                { id: 'stomata', label: 'Stomatal Pores' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    playClick();
                    setSelectedCellArea(btn.id);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                    selectedCellArea === btn.id
                      ? 'bg-emerald-500 text-black border-emerald-300 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-950/40 text-emerald-200 border-emerald-500/20 hover:border-emerald-400/40'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Selected Breakdown Card */}
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/25 space-y-3">
              <h3 className="text-base font-bold text-white border-b border-emerald-500/20 pb-2">
                {currentPart.title}
              </h3>

              {/* Healthy state */}
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Healthy Function</span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {currentPart.healthy}
                </p>
              </div>

              {/* Diseased state */}
              <div className="space-y-1 pt-1">
                <div className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pathological Degradation</span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {currentPart.diseased}
                </p>
              </div>

              {/* Agronomic impact */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/20 text-[11px] text-emerald-300">
                <strong>Agronomic Impact:</strong> {currentPart.impact}
              </div>
            </div>

            {/* Quick jump to Virtual Lab */}
            <button
              onClick={() => {
                playClick();
                setActiveTab('virtual-lab');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2"
            >
              <span>Test Stress Variables in Virtual Lab →</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
