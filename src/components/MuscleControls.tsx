import React, { useState } from 'react';
import { ViewMode, MuscleGroup } from '../types';
import { MUSCLE_GROUPS } from '../data/musclesData';
import { 
  Sliders, 
  Flame, 
  Eye, 
  Layers, 
  Activity, 
  RotateCcw, 
  Zap, 
  Link, 
  Link2Off,
  Camera,
  Search
} from 'lucide-react';

interface MuscleControlsProps {
  tensions: Record<string, number>;
  onTensionChange: (muscleId: string, value: number) => void;
  onResetAll: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeViewpoint: string;
  onViewpointChange: (vp: string) => void;
  antagonistSync: boolean;
  onToggleAntagonistSync: () => void;
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
}

export const MuscleControls: React.FC<MuscleControlsProps> = ({
  tensions,
  onTensionChange,
  onResetAll,
  viewMode,
  onViewModeChange,
  activeViewpoint,
  onViewpointChange,
  antagonistSync,
  onToggleAntagonistSync,
  selectedMuscleId,
  onSelectMuscle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Upper Body', 'Lower Body', 'Core & Back', 'Head & Neck'];

  const filteredMuscles = MUSCLE_GROUPS.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.latinName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const viewModesList: { id: ViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'realistic', label: 'Anatomical', icon: Eye },
    { id: 'heatmap', label: 'Tension Heatmap', icon: Flame },
    { id: 'vectors', label: 'Force Vectors', icon: Zap },
    { id: 'xray', label: 'X-Ray Translucent', icon: Layers },
  ];

  const viewpointsList = [
    { id: 'VP_FullBody', label: 'Full Body' },
    { id: 'VP_UpperBody', label: 'Upper Body' },
    { id: 'VP_RightArm', label: 'Arm Focus' },
    { id: 'VP_Legs', label: 'Leg Focus' },
    { id: 'VP_Posterior', label: 'Back View' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5 text-slate-200 backdrop-blur-md">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base">Muscle Group Sliders</h2>
            <p className="text-xs text-slate-400">Apply tension / relaxation to drive joint rotations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Antagonist Reciprocal Coupling Toggle */}
          <button
            onClick={onToggleAntagonistSync}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              antagonistSync
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="When active, flexing an agonist muscle automatically relaxes its reciprocal antagonist pair."
          >
            {antagonistSync ? <Link className="w-3.5 h-3.5" /> : <Link2Off className="w-3.5 h-3.5" />}
            <span>Antagonist Coupling</span>
          </button>

          {/* Global Reset Button */}
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-all"
            title="Reset all muscle group tensions to resting baseline."
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Pose</span>
          </button>
        </div>
      </div>

      {/* View Modes & Viewpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Render Modes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            Anatomical View Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {viewModesList.map((vm) => {
              const Icon = vm.icon;
              const isActive = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => onViewModeChange(vm.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/50'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{vm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewpoint Angles */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            X_ITE Viewpoint Camera
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {viewpointsList.map((vp) => (
              <button
                key={vp.id}
                onClick={() => onViewpointChange(vp.id)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center truncate transition-all ${
                  activeViewpoint === vp.id
                    ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-950/50'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {vp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Muscle Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search muscle or latin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-slate-100 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Muscle Sliders List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredMuscles.map((muscle) => {
          const val = tensions[muscle.id] ?? muscle.defaultTension;
          const pct = Math.round(val * 100);
          const isSelected = selectedMuscleId === muscle.id;

          // Compute force and torque
          const forceN = Math.round(val * muscle.maxForceN);
          const torqueNm = (forceN * muscle.momentArmM).toFixed(1);

          return (
            <div
              key={muscle.id}
              onClick={() => onSelectMuscle(muscle.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: muscle.color }}
                  />
                  <div>
                    <span className="font-semibold text-xs text-slate-100">{muscle.name}</span>
                    <span className="ml-2 text-[10px] text-slate-500 italic">({muscle.latinName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">{forceN} N</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      pct > 70
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : pct > 30
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {pct}% Tension
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={val}
                  onChange={(e) => onTensionChange(muscle.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400"
                />

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTensionChange(muscle.id, 0);
                    }}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] rounded"
                    title="Relax muscle (0%)"
                  >
                    0%
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTensionChange(muscle.id, 1);
                    }}
                    className="px-1.5 py-0.5 bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] rounded border border-rose-800/50"
                    title="Max Contraction (100%)"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* Action / Joint torque info */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-800/40">
                <span className="truncate max-w-[240px]">🎯 {muscle.action}</span>
                <span className="font-mono text-slate-300">Torque: {torqueNm} N·m</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
