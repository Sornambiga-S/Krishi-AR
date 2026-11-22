import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  BookOpen, 
  Lock, 
  ChevronRight,
  X
} from 'lucide-react';
import { playClick } from '../utils/audio';

interface LearningPathProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ setActiveTab }) => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    icon: string;
    status: 'completed' | 'in_progress' | 'locked';
    xpReward: number;
    estimatedMin: number;
    summary: string;
    lessons: string[];
  } | null>(null);

  const roadmapNodes = [
    {
      id: 'seed',
      title: '🌱 Seed Anatomy & Germination',
      icon: '🌱',
      status: 'completed' as const,
      xpReward: 150,
      estimatedMin: 15,
      summary: 'Explore embryonic shoot, radicle root, endosperm nutrient storage, and imbibition dormancy breaking.',
      lessons: ['Monocot vs Dicot seeds', 'Moisture & Oxygen triggers', 'Cell elongation']
    },
    {
      id: 'plant',
      title: '🌿 Plant Structure & Photosynthesis',
      icon: '🌿',
      status: 'completed' as const,
      xpReward: 200,
      estimatedMin: 20,
      summary: 'Understand the Light & Calvin cycles, chloroplast thylakoids, stomatal conductance, and transpiration pull.',
      lessons: ['Epidermis & mesophyll anatomy', 'Xylem vs Phloem transport', 'RuBisCO efficiency']
    },
    {
      id: 'crop',
      title: '🌾 Crop Lifecycles & Phenology',
      icon: '🌾',
      status: 'completed' as const,
      xpReward: 220,
      estimatedMin: 25,
      summary: 'Master vegetative growth, tillering, panicle boot emergence, anthesis pollination, and grain maturity.',
      lessons: ['Cereal phenology stages', 'Growing Degree Days (GDD)', 'Photoperiod sensitivity']
    },
    {
      id: 'diseases',
      title: '🦠 Plant Pathology & Defense',
      icon: '🦠',
      status: 'in_progress' as const,
      xpReward: 300,
      estimatedMin: 30,
      summary: 'Investigate fungal conidia, bacterial blights, viral vectors, necrotic lesions, and plant innate immune phytoalexins.',
      lessons: ['The Disease Triangle', 'Target-board ring diagnosis', 'Microscopic tissue necrosis']
    },
    {
      id: 'irrigation',
      title: '💧 Precision Irrigation & Turgor',
      icon: '💧',
      status: 'locked' as const,
      xpReward: 250,
      estimatedMin: 20,
      summary: 'Learn micro-drip networks, moisture sensor telemetry, avoiding soil waterlogging, and water-use efficiency (WUE).',
      lessons: ['Drip vs Sprinkler mechanics', 'Tensiometer soil monitoring', 'Root zone saturation curve']
    },
    {
      id: 'soil',
      title: '🧪 Soil Chemistry & Microbiome',
      icon: '🧪',
      status: 'locked' as const,
      xpReward: 280,
      estimatedMin: 25,
      summary: 'Study NPK macronutrients, mycorrhizal fungal symbiosis, soil pH cation exchange capacity (CEC), and humus.',
      lessons: ['Nitrogen cycle mineralization', 'Rhizosphere microbial ecology', 'Soil texture classification']
    },
    {
      id: 'farming',
      title: '🚜 Modern Agronomy & Smart AI',
      icon: '🚜',
      status: 'locked' as const,
      xpReward: 350,
      estimatedMin: 35,
      summary: 'Implement autonomous tractor navigation, drone multispectral NDVI imagery, and AI disease screening.',
      lessons: ['Multispectral drone scanning', 'Variable rate fertilization', 'Regenerative no-till farming']
    },
    {
      id: 'explorer',
      title: '🏆 Agriculture Explorer Master',
      icon: '🏆',
      status: 'locked' as const,
      xpReward: 500,
      estimatedMin: 45,
      summary: 'Capstone mastery: Diagnose unseen field outbreaks, configure optimal agro-climatic greenhouses, and graduate!',
      lessons: ['Comprehensive field simulation', 'Agronomic thesis viva', 'KrishiAR Master Certified']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>CURRICULUM ROADMAP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          "Your Agriculture Journey"
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl">
          Progress from foundational seed germination to advanced AI-guided crop protection. Earn XP and unlock interactive simulator modules.
        </p>
      </div>

      {/* Roadmap Progression Trail */}
      <div className="relative max-w-3xl mx-auto py-6">
        
        {/* Glowing vertical connector line */}
        <div className="absolute top-8 bottom-8 left-6 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-emerald-400 via-lime-400 to-emerald-950 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)]"></div>

        <div className="space-y-6 relative">
          {roadmapNodes.map((node, idx) => {
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => {
                  playClick();
                  setSelectedNode(node);
                }}
                className={`relative flex items-center gap-4 sm:gap-8 cursor-pointer group ${
                  idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                
                {/* Node Milestone Circle (Center on desktop, left on mobile) */}
                <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all duration-300 shadow-xl group-hover:scale-110 ml-0 sm:mx-auto">
                  {isCompleted && (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black flex items-center justify-center font-bold border-2 border-emerald-300">
                      ✓
                    </div>
                  )}
                  {isInProgress && (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 text-black flex items-center justify-center font-bold border-2 border-lime-300 animate-pulse">
                      {node.icon}
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-full h-full rounded-2xl bg-emerald-950/80 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Milestone Content Card */}
                <div 
                  className={`w-full sm:w-[calc(50%-3rem)] rounded-2xl glass-card p-4 sm:p-5 border transition-all text-left ${
                    isInProgress
                      ? 'border-lime-400/50 bg-emerald-950/50 shadow-lg shadow-lime-500/10'
                      : isCompleted
                      ? 'border-emerald-500/30'
                      : 'border-emerald-500/15 opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                      isCompleted ? 'text-emerald-400' : isInProgress ? 'text-lime-400' : 'text-emerald-600'
                    }`}>
                      {isCompleted ? 'Completed' : isInProgress ? 'Current Focus' : 'Locked'}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300">
                      +{node.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {node.title}
                  </h3>

                  <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">
                    {node.summary}
                  </p>

                  <div className="pt-3 mt-2 border-t border-emerald-500/15 flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span>{node.estimatedMin} mins duration</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Node Mini Lesson Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-400/40 shadow-2xl space-y-5 text-left">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-emerald-950/80 text-emerald-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30">
                {selectedNode.icon}
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {selectedNode.title}
                </h2>
                <div className="text-xs font-mono text-emerald-400">
                  Reward: +{selectedNode.xpReward} XP · {selectedNode.estimatedMin} Minutes
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/20">
              {selectedNode.summary}
            </p>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Modules in this Lesson:
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200/90">
                {selectedNode.lessons.map((les, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{les}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-emerald-500/20 flex justify-end gap-2">
              {selectedNode.id === 'diseases' ? (
                <button
                  onClick={() => {
                    playClick();
                    setSelectedNode(null);
                    setActiveTab('doctor');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Continue Lesson in AI Doctor →
                </button>
              ) : (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold"
                >
                  Close Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
