import React, { useState, useEffect, useRef } from 'react';
import { MOVEMENT_PRESETS } from '../data/musclesData';
import { MovementPreset } from '../types';
import { Play, Pause, RotateCcw, Dumbbell, Activity, Zap, Flame, FastForward } from 'lucide-react';

interface MovementPresetsProps {
  onApplyTensions: (tensions: Record<string, number>) => void;
  onResetTensions: () => void;
  onViewpointChange: (vp: string) => void;
}

export const MovementPresets: React.FC<MovementPresetsProps> = ({
  onApplyTensions,
  onResetTensions,
  onViewpointChange,
}) => {
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState<number>(0);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const activePreset = MOVEMENT_PRESETS.find((p) => p.id === activePresetId);

  // Animation Loop Function
  useEffect(() => {
    if (!isPlaying || !activePreset) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = (time - lastTimeRef.current) / 1000;
        const step = (deltaSec / activePreset.durationSec) * speed;

        setProgress((prev) => {
          let next = prev + step;
          if (next >= 1.0) {
            next = 0.0; // Loop animation
          }

          // Calculate current tensions from preset generator
          const currentTensions = activePreset.getTensions(next);
          onApplyTensions(currentTensions);

          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, activePreset, speed, onApplyTensions]);

  const handleSelectPreset = (preset: MovementPreset) => {
    setActivePresetId(preset.id);
    setProgress(0);
    setIsPlaying(true);

    // Auto-focus relevant camera viewpoint
    if (preset.id === 'bicep-curl') onViewpointChange('VP_RightArm');
    else if (preset.id === 'squat') onViewpointChange('VP_Legs');
    else if (preset.id === 'shoulder-press') onViewpointChange('VP_UpperBody');
    else if (preset.id === 'core-crunch') onViewpointChange('VP_UpperBody');
  };

  const handleStop = () => {
    setIsPlaying(false);
    setActivePresetId(null);
    setProgress(0);
    onResetTensions();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 backdrop-blur-md flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Interactive Movement Presets</h3>
            <p className="text-xs text-slate-400">Animate co-contraction & biomechanical exercise loops</p>
          </div>
        </div>

        {isPlaying && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs rounded-full border border-emerald-800 font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Animation Active
          </span>
        )}
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {MOVEMENT_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                isActive
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-100">{preset.name}</span>
                {isActive && isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Animation Playback Bar */}
      {activePreset && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-400">{activePreset.name} Loop</span>
            <span className="font-mono text-slate-400">{Math.round(progress * 100)}% Phase</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg shadow-md transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={handleStop}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                title="Stop and reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px]">Speed:</span>
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all ${
                    speed === s ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
