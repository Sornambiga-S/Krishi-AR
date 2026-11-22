import React, { useState } from 'react';
import { ActiveTab, LabExperiment } from '../types';
import { LAB_EXPERIMENTS } from '../data/mockData';
import { 
  FlaskConical, 
  Info, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface VirtualLabProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({ setActiveTab }) => {
  const [selectedExperiment, setSelectedExperiment] = useState<LabExperiment>(LAB_EXPERIMENTS[0]);
  const [sliderVal, setSliderVal] = useState<number>(LAB_EXPERIMENTS[0].defaultVal);

  const handleSelectExp = (exp: LabExperiment) => {
    playClick();
    setSelectedExperiment(exp);
    setSliderVal(exp.defaultVal);
  };

  // Derive physiological metrics dynamically based on experiment & slider value
  const getSimulatedMetrics = () => {
    const param = selectedExperiment.parameter;
    let turgor = 85;
    let photosynthesis = 90;
    let rootRespiration = 88;
    let stress = 15;
    let aiExplanation = '';

    if (param === 'water') {
      // sliderVal is 0 to 100% moisture
      if (sliderVal < 30) {
        turgor = Math.max(10, Math.round(sliderVal * 1.5));
        photosynthesis = Math.round(30 + sliderVal * 0.8);
        stress = Math.round(100 - sliderVal * 2);
        aiExplanation = `Water deficit: Stomata clamp shut to conserve remaining moisture. Cell turgor drops to ${turgor}%, causing stem and leaflet wilting. Photosynthetic carbon fixation plummets.`;
      } else if (sliderVal <= 70) {
        turgor = 95;
        photosynthesis = 98;
        stress = 5;
        aiExplanation = 'Optimal moisture zone: Leaves maintain peak turgor pressure, stomata remain open for steady transpiration, and nutrient uptake is well-balanced.';
      } else {
        stress = Math.round((sliderVal - 70) * 1.5);
        aiExplanation = 'Slight over-saturation: Soil pores become saturated, mildly slowing root gas exchange.';
      }
    } else if (param === 'sunlight') {
      // 0 to 100% sunlight
      if (sliderVal < 35) {
        photosynthesis = Math.max(12, Math.round(sliderVal * 1.2));
        turgor = 75;
        stress = Math.round(90 - sliderVal * 1.5);
        aiExplanation = `Severe light deprivation: Light reactions cannot split water molecules or generate ATP/NADPH. The plant displays etiolation (pale yellow leaves and weak spindly stems).`;
      } else if (sliderVal <= 85) {
        photosynthesis = 96;
        stress = 8;
        aiExplanation = 'Optimal sunlight: Chloroplasts absorb photons at maximum quantum efficiency without photobleaching chlorophyll proteins.';
      } else {
        stress = Math.round((sliderVal - 85) * 2.5);
        aiExplanation = 'High solar irradiance: Excess ultraviolet exposure triggers photoinhibition and leaf surface temperature rise.';
      }
    } else if (param === 'excessWater') {
      // 0 to 100% waterlogging
      if (sliderVal > 70) {
        rootRespiration = Math.max(8, Math.round(100 - sliderVal));
        stress = Math.round(sliderVal * 0.9);
        turgor = Math.max(25, Math.round(100 - sliderVal * 0.7));
        aiExplanation = `Root asphyxiation: Saturated soil completely displaces dissolved oxygen. Root cells starve and enter anaerobic respiration, breeding Pythium root rot.`;
      } else {
        rootRespiration = 85;
        stress = 12;
        aiExplanation = 'Well-drained soil structure allows air permeability and healthy microbial mycorrhizal symbiosis.';
      }
    } else if (param === 'temperature') {
      // 10 to 50°C
      if (sliderVal > 35) {
        stress = Math.min(100, Math.round((sliderVal - 35) * 6));
        photosynthesis = Math.max(15, Math.round(100 - (sliderVal - 35) * 5));
        aiExplanation = `Thermal stress: Temperatures above 35°C denature essential RuBisCO enzymes. Transpiration escalates exponentially, causing tip burn and blossom drop.`;
      } else if (sliderVal < 18) {
        stress = Math.round((18 - sliderVal) * 5);
        photosynthesis = Math.max(25, Math.round(sliderVal * 4));
        aiExplanation = 'Chill stress: Enzymatic biochemical rates decelerate; cellular membrane fluidity hardens, retarding root nutrient uptake.';
      } else {
        stress = 6;
        photosynthesis = 98;
        aiExplanation = 'Optimal temperature window (20–28°C): Cellular respiration and photosynthetic carbon assimilation function at peak metabolic equilibrium.';
      }
    } else {
      // nutrients 0 to 100%
      if (sliderVal < 30) {
        photosynthesis = Math.max(20, Math.round(sliderVal * 1.5));
        stress = Math.round(95 - sliderVal * 1.8);
        aiExplanation = `NPK nutrient deficiency: Lack of nitrogen stunts chlorophyll synthesis (chlorosis); lack of phosphorus impairs root ATP energy; potassium deficiency burns leaflet edges.`;
      } else {
        photosynthesis = 95;
        stress = 8;
        aiExplanation = 'Balanced macro and micronutrients: Vigorous cell wall cellulose synthesis and high disease resistance.';
      }
    }

    return { turgor, photosynthesis, rootRespiration, stress, aiExplanation };
  };

  const metrics = getSimulatedMetrics();

  // Dynamic visual appearance of the plant based on stress
  const getPlantVisualStyles = () => {
    if (selectedExperiment.parameter === 'water' && sliderVal < 30) {
      return { filter: 'saturate(0.6) brightness(0.9)', transform: 'scaleY(0.92) rotate(2deg)' };
    }
    if (selectedExperiment.parameter === 'sunlight' && sliderVal < 30) {
      return { filter: 'saturate(0.3) brightness(1.15)', transform: 'scale(0.98)' };
    }
    if (selectedExperiment.parameter === 'temperature' && sliderVal > 36) {
      return { filter: 'sepia(0.35) saturate(1.2) hue-rotate(-20deg)', transform: 'scaleY(0.94)' };
    }
    if (selectedExperiment.parameter === 'nutrients' && sliderVal < 30) {
      return { filter: 'hue-rotate(25deg) saturate(0.6)', transform: 'scale(0.97)' };
    }
    return { filter: 'none', transform: 'scale(1)' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
          <span>VIRTUAL AGRONOMIC SIMULATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          🧪 Virtual Farm Lab
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
          Conduct "What If?" experiments on plant biology. Alter environmental variables and watch how living plant physiology responds.
        </p>
      </div>

      {/* 5 Experiment Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {LAB_EXPERIMENTS.map((exp) => {
          const isSelected = selectedExperiment.id === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => handleSelectExp(exp)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'glass-card border-emerald-500/20 hover:border-emerald-400/50'
              }`}
            >
              <div className="text-2xl mb-1">{exp.icon}</div>
              <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                {exp.title}
              </div>
              <div className="text-[11px] text-emerald-300/70 mt-1 line-clamp-2">
                {exp.question}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Lab Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Simulation Workbench */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-6">
            
            {/* Top Lab Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 text-xs font-mono">
              <span className="text-emerald-300 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CHAMBER: BIO-GROWTH TANK 01</span>
              </span>
              <button
                onClick={() => {
                  playClick();
                  setSliderVal(selectedExperiment.defaultVal);
                }}
                className="text-emerald-400/80 hover:text-white flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Parameter</span>
              </button>
            </div>

            {/* Visual Plant Growth Chamber */}
            <div className="relative rounded-2xl bg-[#030C08] border border-emerald-500/20 h-[340px] flex items-center justify-center overflow-hidden ar-grid">
              
              {/* Plant visual with dynamic CSS response */}
              <div 
                className="transition-all duration-700 ease-out flex items-center justify-center w-full h-full"
                style={getPlantVisualStyles()}
              >
                <svg viewBox="0 0 300 300" className="w-56 h-56 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]">
                  {/* Stem */}
                  <path d="M 150,280 Q 155,200 150,110" stroke="#065F46" strokeWidth="8" fill="none" strokeLinecap="round" />
                  {/* Leaves */}
                  <path d="M 150,210 Q 90,190 70,160 Q 110,150 150,195" fill="#10B981" stroke="#059669" strokeWidth="2" />
                  <path d="M 150,170 Q 210,150 230,120 Q 190,110 150,155" fill="#10B981" stroke="#059669" strokeWidth="2" />
                  <path d="M 150,130 Q 100,100 85,70 Q 120,60 150,115" fill="#34D399" stroke="#10B981" strokeWidth="2" />
                  <path d="M 150,110 Q 195,85 210,55 Q 175,50 150,95" fill="#34D399" stroke="#10B981" strokeWidth="2" />
                  {/* Apical bud */}
                  <circle cx="150" cy="90" r="8" fill="#86EFAC" />
                </svg>
              </div>

              {/* Stress overlay if high */}
              {metrics.stress > 40 && (
                <div className="absolute top-4 right-4 p-2 rounded-xl bg-amber-950/80 border border-amber-500/50 text-[11px] font-mono text-amber-300 flex items-center space-x-1.5 animate-pulse">
                  <span>⚠️ Plant Stress Alert</span>
                </div>
              )}

              {/* Active Variable Overlay */}
              <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 text-left">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">Variable Setting</div>
                <div className="text-lg font-bold text-white font-mono">
                  {sliderVal} {selectedExperiment.unit}
                </div>
              </div>

            </div>

            {/* Parameter Adjustment Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-300 font-bold uppercase">
                  Control: {selectedExperiment.title}
                </span>
                <span className="text-white font-extrabold text-sm">
                  {sliderVal} {selectedExperiment.unit}
                </span>
              </div>

              <input
                type="range"
                min={selectedExperiment.minVal}
                max={selectedExperiment.maxVal}
                value={sliderVal}
                onChange={(e) => {
                  setSliderVal(parseInt(e.target.value));
                  playClick();
                }}
                className="w-full h-3 bg-emerald-950/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-[11px] font-mono text-emerald-400/70">
                <span>{selectedExperiment.minVal} {selectedExperiment.unit} (Min)</span>
                <span>Normal Range</span>
                <span>{selectedExperiment.maxVal} {selectedExperiment.unit} (Max)</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: AI Analysis & Live Physiological Gauges */}
        <div className="lg:col-span-5 space-y-4 text-left">
          
          {/* AI Explanation Box */}
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI AGRONOMIST REACTION</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {selectedExperiment.question}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/20">
              {metrics.aiExplanation}
            </p>
          </div>

          {/* Real-time Physiological Gauges */}
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/25 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Real-Time Physiological Telemetry
            </span>

            {/* Metric 1: Turgor Pressure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-300">Cellular Turgor Pressure</span>
                <span className="text-white font-bold">{metrics.turgor}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.turgor}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 2: Photosynthetic Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-lime-300">Photosynthetic Rate</span>
                <span className="text-white font-bold">{metrics.photosynthesis}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                <div 
                  className="bg-lime-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.photosynthesis}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 3: Root Respiration */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-teal-300">Root Oxygen Respiration</span>
                <span className="text-white font-bold">{metrics.rootRespiration}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                <div 
                  className="bg-teal-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.rootRespiration}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 4: Plant Stress Index */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-300">Stress Index</span>
                <span className="text-white font-bold">{metrics.stress}%</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    metrics.stress > 50 ? 'bg-amber-500' : 'bg-emerald-400'
                  }`} 
                  style={{ width: `${metrics.stress}%` }}
                ></div>
              </div>
            </div>

          </div>

          {/* Mandatory Label from Prompt */}
          <div className="p-3 rounded-xl bg-[#04140E] border border-emerald-500/20 flex items-center space-x-2 text-xs text-emerald-300/80">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Educational simulation — results are simplified for learning.</strong>
            </span>
          </div>

          <button
            onClick={() => { playClick(); setActiveTab('doctor'); }}
            className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>Screen Simulated Symptoms in AI Farm Doctor →</span>
          </button>

        </div>

      </div>

    </div>
  );
};
