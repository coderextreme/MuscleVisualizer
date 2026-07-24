import React from 'react';
import { MuscleGroup } from '../types';
import { MUSCLE_GROUPS } from '../data/musclesData';
import { Info, Activity, ShieldAlert, Award, Compass, Gauge, AlertCircle } from 'lucide-react';

interface MuscleInspectorProps {
  selectedMuscleId: string | null;
  tensions: Record<string, number>;
  onSelectMuscle: (muscleId: string) => void;
}

export const MuscleInspector: React.FC<MuscleInspectorProps> = ({
  selectedMuscleId,
  tensions,
  onSelectMuscle,
}) => {
  const muscle = MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];
  const tensionVal = tensions[muscle.id] ?? muscle.defaultTension;
  const tensionPct = Math.round(tensionVal * 100);

  // Biomechanical Force Calculations
  const maxForceN = muscle.maxForceN;
  const currentForceN = Math.round(tensionVal * maxForceN);
  const momentArmM = muscle.momentArmM; // meters
  const torqueNm = (currentForceN * momentArmM).toFixed(1);

  // Find Antagonist
  const antagonist = MUSCLE_GROUPS.find((m) => m.id === muscle.antagonistId);
  const antagonistTension = tensions[muscle.antagonistId] ?? (antagonist?.defaultTension || 0.1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 backdrop-blur-md flex flex-col gap-4">
      {/* Inspector Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full border border-white/30 shadow-md"
            style={{ backgroundColor: muscle.color }}
          />
          <div>
            <h3 className="font-bold text-base text-slate-100">{muscle.name}</h3>
            <p className="text-xs text-rose-400 font-mono italic">{muscle.latinName}</p>
          </div>
        </div>

        <span className="bg-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-full font-medium border border-slate-700">
          {muscle.category}
        </span>
      </div>

      {/* Biomechanical Live Meters */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
            <Gauge className="w-3 h-3 text-rose-400" />
            Tension
          </div>
          <div className="text-lg font-bold text-rose-400 font-mono">{tensionPct}%</div>
          <div className="text-[9px] text-slate-500">Isotonic State</div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" />
            Muscle Force
          </div>
          <div className="text-lg font-bold text-amber-400 font-mono">{currentForceN} N</div>
          <div className="text-[9px] text-slate-500">Max: {maxForceN} N</div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
            <Compass className="w-3 h-3 text-sky-400" />
            Joint Torque
          </div>
          <div className="text-lg font-bold text-sky-400 font-mono">{torqueNm} N·m</div>
          <div className="text-[9px] text-slate-500">Lever: {(momentArmM * 100).toFixed(1)} cm</div>
        </div>
      </div>

      {/* Anatomical Details */}
      <div className="space-y-3 text-xs">
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">📌 Origin (Anchor Point):</span>
            <span className="text-slate-400">{muscle.origin}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">🎯 Insertion (Mobile Point):</span>
            <span className="text-slate-400">{muscle.insertion}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">⚡ Innervation (Nerve Supply):</span>
            <span className="text-slate-400">{muscle.innervation}</span>
          </div>
        </div>

        {/* Action & Description */}
        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-1.5">
          <p className="font-semibold text-slate-200">Mechanical Action:</p>
          <p className="text-slate-300 leading-relaxed">{muscle.action}</p>
          <p className="text-slate-400 mt-2 leading-relaxed">{muscle.description}</p>
        </div>

        {/* Clinical Note */}
        {muscle.clinicalNote && (
          <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-start gap-2.5 text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Clinical & Biomechanical Insight:</span>
              <p className="text-slate-300 text-[11px] leading-normal">{muscle.clinicalNote}</p>
            </div>
          </div>
        )}

        {/* Antagonist Pair */}
        {antagonist && (
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Antagonistic Muscle Pair
              </span>
              <span className="font-bold text-slate-200">{antagonist.name}</span>
            </div>

            <button
              onClick={() => onSelectMuscle(antagonist.id)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg border border-slate-700 transition-all"
            >
              Inspect {antagonist.name.split(' ')[0]} ({Math.round(antagonistTension * 100)}%)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
