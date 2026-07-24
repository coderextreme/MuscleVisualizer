import React, { useState, useCallback } from 'react';
import { ViewMode } from './types';
import { MUSCLE_GROUPS } from './data/musclesData';
import { X3DVisualizer } from './components/X3DVisualizer';
import { MuscleControls } from './components/MuscleControls';
import { MuscleInspector } from './components/MuscleInspector';
import { MovementPresets } from './components/MovementPresets';
import { BiomechanicalCharts } from './components/BiomechanicalCharts';
import { AnatomyQuiz } from './components/AnatomyQuiz';
import { 
  Activity, 
  Layers, 
  Dumbbell, 
  LineChart, 
  HelpCircle, 
  Sliders, 
  Info, 
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  Globe
} from 'lucide-react';

export default function App() {
  // Global State for Muscle Tensions (muscleId -> number 0..1)
  const [tensions, setTensions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    MUSCLE_GROUPS.forEach((m) => {
      initial[m.id] = m.defaultTension;
    });
    return initial;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('realistic');
  const [activeViewpoint, setActiveViewpoint] = useState<string>('VP_FullBody');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>('biceps');
  const [antagonistSync, setAntagonistSync] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sliders' | 'presets' | 'charts' | 'quiz'>('sliders');

  // Handle single muscle tension slider change
  const handleTensionChange = useCallback((muscleId: string, val: number) => {
    setTensions((prev) => {
      const updated = { ...prev, [muscleId]: val };

      // If Antagonist Coupling is enabled, apply reciprocal relaxation
      if (antagonistSync) {
        const targetMuscle = MUSCLE_GROUPS.find((m) => m.id === muscleId);
        if (targetMuscle && targetMuscle.antagonistId) {
          const antId = targetMuscle.antagonistId;
          // Reciprocal inhibition: as agonist tension rises, antagonist decreases
          const reciprocalVal = Math.max(0.05, 1.0 - val * 0.85);
          updated[antId] = parseFloat(reciprocalVal.toFixed(2));
        }
      }

      return updated;
    });
  }, [antagonistSync]);

  // Handle batch update from movement presets
  const handleApplyTensions = useCallback((newTensions: Record<string, number>) => {
    setTensions((prev) => ({
      ...prev,
      ...newTensions
    }));
  }, []);

  // Reset all muscle tensions to resting baseline
  const handleResetAll = useCallback(() => {
    const reset: Record<string, number> = {};
    MUSCLE_GROUPS.forEach((m) => {
      reset[m.id] = m.defaultTension;
    });
    setTensions(reset);
  }, []);

  // Compute summary stats
  const totalForceN = MUSCLE_GROUPS.reduce((acc, m) => {
    const t = tensions[m.id] ?? m.defaultTension;
    return acc + Math.round(t * m.maxForceN);
  }, 0);

  const activeMusclesCount = MUSCLE_GROUPS.filter((m) => (tensions[m.id] ?? 0) > 0.4).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-xl text-white shadow-lg shadow-rose-950/50">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-100 tracking-tight">
                Human Muscle Visualizer
              </h1>
              <span className="bg-rose-950/80 border border-rose-800/60 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                X_ITE 3D Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Biomechanical 3D muscle tension, relaxation, and joint articulation model
            </p>
          </div>
        </div>

        {/* Global Live Biomechanical Metrics */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-mono bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-sans font-semibold">
              Total Muscle Load
            </span>
            <span className="font-bold text-rose-400 text-sm">{totalForceN.toLocaleString()} N</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-sans font-semibold">
              High Tension Muscles
            </span>
            <span className="font-bold text-amber-400 text-sm">{activeMusclesCount} / {MUSCLE_GROUPS.length}</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-sans font-semibold">
              Render Mode
            </span>
            <span className="font-bold text-sky-400 text-sm capitalize">{viewMode}</span>
          </div>
        </div>

        {/* Action Tabs Header */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('sliders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'sliders'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sliders</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'charts'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout Grid */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D X_ITE WebGL Canvas (7 Cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 h-[620px] lg:h-[720px] sticky top-20">
          <X3DVisualizer
            tensions={tensions}
            viewMode={viewMode}
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={(id) => setSelectedMuscleId(id)}
            activeViewpoint={activeViewpoint}
            onViewpointChanged={(vp) => setActiveViewpoint(vp)}
          />
        </div>

        {/* Right Column: Tab Panels & Muscle Inspector (5 Cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Active Tab Panel */}
          {activeTab === 'sliders' && (
            <MuscleControls
              tensions={tensions}
              onTensionChange={handleTensionChange}
              onResetAll={handleResetAll}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activeViewpoint={activeViewpoint}
              onViewpointChange={setActiveViewpoint}
              antagonistSync={antagonistSync}
              onToggleAntagonistSync={() => setAntagonistSync(!antagonistSync)}
              selectedMuscleId={selectedMuscleId}
              onSelectMuscle={(id) => setSelectedMuscleId(id)}
            />
          )}

          {activeTab === 'presets' && (
            <MovementPresets
              onApplyTensions={handleApplyTensions}
              onResetTensions={handleResetAll}
              onViewpointChange={setActiveViewpoint}
            />
          )}

          {activeTab === 'charts' && (
            <BiomechanicalCharts
              tensions={tensions}
              selectedMuscleId={selectedMuscleId}
            />
          )}

          {activeTab === 'quiz' && (
            <AnatomyQuiz
              onSelectMuscle={(id) => setSelectedMuscleId(id)}
              onApplyTension={(id, val) => handleTensionChange(id, val)}
            />
          )}

          {/* Muscle Anatomy Inspector Panel */}
          <MuscleInspector
            selectedMuscleId={selectedMuscleId}
            tensions={tensions}
            onSelectMuscle={(id) => setSelectedMuscleId(id)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-rose-500" />
          <span>X_ITE 3D Web3D Browser Engine • Real-time Biomechanical Joint Articulation</span>
        </div>
        <div className="font-mono text-[11px] text-slate-600">
          ISO/IEC 19775-1 X3D Standard Compliant
        </div>
      </footer>
    </div>
  );
}
