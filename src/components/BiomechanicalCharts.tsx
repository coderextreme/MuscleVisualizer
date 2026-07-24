import React from 'react';
import { MUSCLE_GROUPS } from '../data/musclesData';
import { LineChart, BarChart2, TrendingUp, Info } from 'lucide-react';

interface BiomechanicalChartsProps {
  tensions: Record<string, number>;
  selectedMuscleId: string | null;
}

export const BiomechanicalCharts: React.FC<BiomechanicalChartsProps> = ({
  tensions,
  selectedMuscleId,
}) => {
  const selectedMuscle = MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || MUSCLE_GROUPS[0];
  const activeTension = tensions[selectedMuscle.id] ?? selectedMuscle.defaultTension;

  // Hill-type Muscle Model Force-Length Curve Simulation
  // Passive Elastic Force + Active Isotonic Force vs Muscle Length
  const curvePoints: { lengthRatio: number; activeForce: number; passiveForce: number; totalForce: number }[] = [];
  
  for (let l = 0.5; l <= 1.5; l += 0.05) {
    // Active force peaks at optimal length (l = 1.0)
    const active = Math.max(0, 1 - 4 * Math.pow(l - 1.0, 2)) * activeTension * selectedMuscle.maxForceN;
    // Passive force increases exponentially past rest length (l > 1.0)
    const passive = l > 1.0 ? Math.pow((l - 1.0) / 0.5, 2) * 0.4 * selectedMuscle.maxForceN : 0;
    curvePoints.push({
      lengthRatio: parseFloat(l.toFixed(2)),
      activeForce: Math.round(active),
      passiveForce: Math.round(passive),
      totalForce: Math.round(active + passive)
    });
  }

  const maxChartForce = selectedMuscle.maxForceN * 1.2;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-200 backdrop-blur-md flex flex-col gap-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Hill Force-Length-Tension Model</h3>
            <p className="text-xs text-slate-400">
              Active & Passive Force Curves for <span className="text-sky-300 font-semibold">{selectedMuscle.name}</span>
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <div className="text-slate-400">Peak Active Force</div>
          <div className="text-sky-400 font-bold text-sm">
            {Math.round(activeTension * selectedMuscle.maxForceN)} N
          </div>
        </div>
      </div>

      {/* SVG Force-Length Curve Visualization */}
      <div className="relative w-full h-44 bg-slate-950/80 rounded-xl border border-slate-800 p-3 flex flex-col justify-between">
        {/* Y-Axis Label */}
        <div className="absolute left-3 top-2 text-[10px] text-slate-500 font-mono">
          Force (N) [Max: {selectedMuscle.maxForceN} N]
        </div>

        {/* Chart Canvas SVG */}
        <svg className="w-full h-32 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="0" y1="80" x2="300" y2="80" stroke="#1e293b" strokeDasharray="3,3" />

          {/* Optimal Length Marker (L0 = 1.0) */}
          <line x1="150" y1="0" x2="150" y2="100" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x="155" y="15" fill="#38bdf8" fontSize="8" fontFamily="monospace">Optimal L₀</text>

          {/* Active Force Curve Path */}
          <path
            d={curvePoints.reduce((acc, p, idx) => {
              const x = (idx / (curvePoints.length - 1)) * 300;
              const y = 95 - (p.activeForce / maxChartForce) * 85;
              return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '')}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />

          {/* Passive Force Curve Path */}
          <path
            d={curvePoints.reduce((acc, p, idx) => {
              const x = (idx / (curvePoints.length - 1)) * 300;
              const y = 95 - (p.passiveForce / maxChartForce) * 85;
              return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '')}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />

          {/* Total Combined Force Curve Path */}
          <path
            d={curvePoints.reduce((acc, p, idx) => {
              const x = (idx / (curvePoints.length - 1)) * 300;
              const y = 95 - (p.totalForce / maxChartForce) * 85;
              return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
        </svg>

        {/* X-Axis Label */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
          <span>0.5 L₀ (Shortened)</span>
          <span className="text-sky-400 font-bold">1.0 L₀ (Rest Length)</span>
          <span>1.5 L₀ (Stretched)</span>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-around text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-rose-500 rounded" />
          <span>Active Contraction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-sky-400 rounded border border-dashed border-sky-300" />
          <span>Passive Elasticity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-amber-400 rounded" />
          <span>Total Combined Force</span>
        </div>
      </div>
    </div>
  );
};
