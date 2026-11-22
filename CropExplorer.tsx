import React, { useState } from 'react';
import { ActiveTab, CropInfo } from '../types';
import { CROPS_DATABASE } from '../data/mockData';
import { 
  Wheat, 
  Search, 
  Calendar, 
  Droplet, 
  Thermometer, 
  AlertTriangle, 
  Lightbulb, 
  X,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Camera,
  Sun
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface CropExplorerProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCropForDoctor: (cropName: string) => void;
}

export const CropExplorer: React.FC<CropExplorerProps> = ({
  setActiveTab,
  onSelectCropForDoctor
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectedCrop, setInspectedCrop] = useState<CropInfo | null>(null);

  const categories = [
    'All',
    'Food and Field Crops',
    'Vegetables',
    'Fruits and Fruit Trees',
    'Flowers, Medicinal and Other Plants'
  ];

  const filteredCrops = CROPS_DATABASE.filter((crop) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      crop.name.toLowerCase().includes(term) ||
      crop.scientificName.toLowerCase().includes(term) ||
      (crop.tamilName && crop.tamilName.toLowerCase().includes(term)) ||
      crop.category.toLowerCase().includes(term) ||
      crop.commonDiseases.some(d => d.toLowerCase().includes(term)) ||
      (crop.majorTNRegions && crop.majorTNRegions.some(r => r.toLowerCase().includes(term)));
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <Wheat className="w-3.5 h-3.5 text-emerald-400" />
            <span>BOTANICAL ARCHIVE & CROP TAXONOMY · TAMIL NADU 50 CROPS EDITION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            🌱 Crop Explorer
          </h1>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
            Discover essential agronomic requirements, growth stages, threats, and botanical cultivation practices across all 50 crops and plants commonly grown throughout Tamil Nadu.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, Tamil name, district..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder-emerald-500/60"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playClick();
              setSelectedCategory(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 scale-105'
                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 hover:border-emerald-400/40'
            }`}
          >
            {cat} {cat === 'All' ? `(${CROPS_DATABASE.length})` : `(${CROPS_DATABASE.filter(c => c.category === cat).length})`}
          </button>
        ))}
        <span className="text-xs font-mono text-emerald-400/70 ml-auto hidden sm:inline">
          Showing {filteredCrops.length} of {CROPS_DATABASE.length} Tamil Nadu crops
        </span>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => {
              playClick();
              setInspectedCrop(crop);
            }}
            className="group rounded-3xl glass-card border border-emerald-500/20 p-5 cursor-pointer flex flex-col justify-between hover:border-emerald-400/50 hover:shadow-2xl hover:scale-[1.01] transition-all"
          >
            <div className="space-y-3.5 text-left">
              {/* Top Row: Icon & Category */}
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  {crop.icon}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 truncate max-w-[140px]">
                  {crop.category}
                </span>
              </div>

              {/* Title & Tamil Name */}
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {crop.name}
                </h3>
                {crop.tamilName && (
                  <div className="text-xs font-semibold text-lime-300 mt-0.5">
                    {crop.tamilName}
                  </div>
                )}
                <div className="text-[11px] italic text-emerald-300/70 font-mono mt-0.5">
                  {crop.scientificName}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="space-y-1.5 pt-2 border-t border-emerald-500/15 text-xs text-emerald-100/80">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span className="truncate"><strong>Growth:</strong> {crop.growthPeriod}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate"><strong>Temp:</strong> {crop.optimalTemperature}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate"><strong>Water:</strong> {crop.waterNeed}</span>
                </div>
              </div>

              {/* Major TN Districts Badge */}
              {crop.majorTNRegions && crop.majorTNRegions.length > 0 && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/15 text-[10px] text-emerald-300 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{crop.majorTNRegions.slice(0, 3).join(', ')}</span>
                </div>
              )}

              {/* Common Disease Tag */}
              {crop.commonDiseases && crop.commonDiseases.length > 0 && (
                <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[10px] text-amber-300/90 flex items-start space-x-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{crop.commonDiseases[0]}</span>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="pt-3 mt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-white">
              <span>View Full Info</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="p-8 text-center glass-card rounded-2xl space-y-2 border border-emerald-500/20">
          <p className="text-xs text-emerald-300">No crop found matching "{searchTerm}".</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-xs font-semibold text-emerald-300 hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* In-depth Plant Information Modal */}
      {inspectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-400/40 shadow-2xl space-y-6 text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setInspectedCrop(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-4">
              <span className="text-5xl p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/30">
                {inspectedCrop.icon}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-baseline gap-2">
                  <span>{inspectedCrop.name}</span>
                  {inspectedCrop.tamilName && (
                    <span className="text-xl font-bold text-lime-300 font-sans">
                      ({inspectedCrop.tamilName})
                    </span>
                  )}
                </h2>
                <div className="text-xs sm:text-sm italic font-mono text-emerald-300">
                  {inspectedCrop.scientificName} · {inspectedCrop.category}
                </div>
              </div>
            </div>

            {/* Major Tamil Nadu Regions Tag */}
            {inspectedCrop.majorTNRegions && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center space-x-2 text-xs">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-200">
                  <strong>Major Tamil Nadu Cultivating Districts:</strong> {inspectedCrop.majorTNRegions.join(', ')}
                </span>
              </div>
            )}

            {/* Fun Fact Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/30 flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono font-bold text-lime-300 uppercase">Botanical & Cultural Significance</div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-0.5">
                  {inspectedCrop.funFact}
                </p>
              </div>
            </div>

            {/* Suitable Growing Conditions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Suitable Growing Conditions (TNAU Agro-Climatic Parameters)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">🌱 Soil Profile:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.soilType}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">☀️ Sunlight Requirement:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.sunlight}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">🌡️ Optimal Temperature:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.optimalTemperature}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">💧 Water Need:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.waterNeed}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">⏱️ Total Lifecycle Duration:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.growthPeriod}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-300">🌾 Expected Harvest Yield:</div>
                  <div className="text-emerald-100/80 mt-0.5">{inspectedCrop.harvestYield}</div>
                </div>
              </div>
            </div>

            {/* Basic Cultivation Practices */}
            {inspectedCrop.basicPractices && inspectedCrop.basicPractices.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Basic Cultivation Information (Recommended Farm Management)</span>
                </h3>
                <div className="space-y-2">
                  {inspectedCrop.basicPractices.map((practice, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-100/90 flex items-start space-x-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Growth Stages Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-emerald-400">
                Growth Stages & Phenology
              </h3>
              <div className="space-y-2">
                {inspectedCrop.stages.map((stage, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/15 flex items-start space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center space-x-2">
                        <span>{stage.stage}</span>
                        <span className="text-[10px] font-mono text-emerald-400">({stage.duration})</span>
                      </div>
                      <p className="text-emerald-200/80">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Diseases */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-amber-400">
                Common Pathogens & Diseases
              </h3>
              <div className="flex flex-wrap gap-2">
                {inspectedCrop.commonDiseases.map((dis, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    🦠 {dis}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => {
                  playClick();
                  setInspectedCrop(null);
                  setActiveTab('doctor');
                  onSelectCropForDoctor(inspectedCrop.name);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>Scan Plant in AI Farm Doctor →</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
