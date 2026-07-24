import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ViewMode, MuscleGroup } from '../types';
import { MUSCLE_GROUPS } from '../data/musclesData';
import { generateHumanAnatomyX3DXml } from '../utils/x3dSceneGenerator';
import { Eye, Layers, Activity, Maximize2, RotateCcw, Box, Flame } from 'lucide-react';

interface X3DVisualizerProps {
  tensions: Record<string, number>; // muscleId -> tension 0..1
  viewMode: ViewMode;
  selectedMuscleId: string | null;
  onSelectMuscle: (muscleId: string) => void;
  activeViewpoint: string;
  onViewpointChanged?: (vpName: string) => void;
}

export const X3DVisualizer: React.FC<X3DVisualizerProps> = ({
  tensions,
  viewMode,
  selectedMuscleId,
  onSelectMuscle,
  activeViewpoint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLElement | null>(null);
  const [isX3DReady, setIsX3DReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Initialize X3D canvas and load scene graph
  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;

    const setupX3D = () => {
      try {
        // Clear previous canvas if any
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const xmlContent = generateHumanAnatomyX3DXml();
        const dataUri = 'data:model/x3d+xml;charset=utf-8,' + encodeURIComponent(xmlContent);

        // Create x3d-canvas element
        const canvas = document.createElement('x3d-canvas');
        canvas.setAttribute('src', dataUri);
        canvas.setAttribute('splashScreen', 'false');
        canvas.setAttribute('style', 'width: 100%; height: 100%; border: none; display: block; background: transparent;');
        canvas.setAttribute('id', 'human-muscle-x3d-canvas');

        // Add event listener for scene loading
        const handleLoad = () => {
          if (isMounted) {
            setIsX3DReady(true);
            setLoadingError(null);
          }
        };

        canvas.addEventListener('load', handleLoad);
        containerRef.current?.appendChild(canvas);
        canvasRef.current = canvas;

        // Fallback timer if event didn't fire immediately
        const timer = setTimeout(() => {
          if (isMounted && !isX3DReady) {
            setIsX3DReady(true);
          }
        }, 800);

        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error('Failed to initialize X3D visualizer:', err);
        if (isMounted) setLoadingError('Unable to render 3D WebGL canvas. Check WebGL context support.');
      }
    };

    // Ensure window.X3D or script is loaded
    if (typeof (window as any).X3D !== 'undefined' || customElements.get('x3d-canvas')) {
      setupX3D();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof (window as any).X3D !== 'undefined' || customElements.get('x3d-canvas')) {
          clearInterval(checkInterval);
          setupX3D();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize Viewpoints with X_ITE scene
  useEffect(() => {
    if (!isX3DReady || !canvasRef.current) return;
    try {
      const canvas = canvasRef.current as any;
      const browser = canvas.browser || (window as any).X3D?.getBrowser(canvas);
      if (browser && browser.currentScene) {
        const vpNode = browser.currentScene.getNamedNode(activeViewpoint);
        if (vpNode && typeof vpNode.set_bind === 'function') {
          vpNode.set_bind = true;
        } else if (vpNode) {
          vpNode.bind = true;
        }
      }
    } catch (e) {
      console.warn('Viewpoint bind error:', e);
    }
  }, [activeViewpoint, isX3DReady]);

  // Main Biomechanical Sync Loop: Updates joint rotations, muscle thickness, and colors in real-time
  const updateSceneGraph = useCallback(() => {
    if (!isX3DReady || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current as any;
      const browser = canvas.browser || (window as any).X3D?.getBrowser(canvas);
      const X3D = (window as any).X3D;

      if (!browser || !browser.currentScene || !X3D) return;
      const scene = browser.currentScene;

      // 1. Calculate joint angles driven by muscle tensions
      // Biomechanical relationships:
      // Elbow: Biceps flexes (-rad), Triceps extends (+rad)
      const bicepsT = tensions['biceps'] ?? 0.2;
      const tricepsT = tensions['triceps'] ?? 0.1;
      const netElbowFlexion = Math.max(0, bicepsT - tricepsT * 0.8);
      const elbowAngleDeg = netElbowFlexion * 135; // 0 to 135 deg
      const elbowRad = (elbowAngleDeg * Math.PI) / 180;

      // Shoulder Abduction: Deltoid
      const deltoidT = tensions['deltoid'] ?? 0.15;
      const shoulderAngleDeg = deltoidT * 120;
      const shoulderRad = (shoulderAngleDeg * Math.PI) / 180;

      // Knee Flexion: Hamstrings flex (+rad), Quads extend knee (-rad)
      const quadsT = tensions['quadriceps'] ?? 0.25;
      const hamsT = tensions['hamstrings'] ?? 0.15;
      const netKneeFlexion = Math.max(0, hamsT - quadsT * 0.7);
      const kneeAngleDeg = netKneeFlexion * 115;
      const kneeRad = (kneeAngleDeg * Math.PI) / 180;

      // Ankle Plantarflexion: Calf
      const calfT = tensions['gastrocnemius'] ?? 0.2;
      const ankleAngleDeg = calfT * 40;
      const ankleRad = (ankleAngleDeg * Math.PI) / 180;

      // Spine Flexion: Abs
      const absT = tensions['abdominis'] ?? 0.15;
      const spineAngleDeg = absT * 35;
      const spineRad = (spineAngleDeg * Math.PI) / 180;

      // Hip Extension/Flexion: Gluteus vs Quads
      const gluteT = tensions['gluteus'] ?? 0.15;
      const hipAngleDeg = gluteT * 30 - quadsT * 20;
      const hipRad = (hipAngleDeg * Math.PI) / 180;

      // Neck Extension: Trapezius
      const trapT = tensions['trapezius'] ?? 0.1;
      const neckAngleDeg = trapT * 25;
      const neckRad = (neckAngleDeg * Math.PI) / 180;

      // Helper function to safely set SFRotation
      const setRotation = (nodeName: string, x: number, y: number, z: number, angle: number) => {
        const node = scene.getNamedNode(nodeName);
        if (node) {
          try {
            if (node.getField) {
              node.getField('rotation').setValue(new X3D.SFRotation(x, y, z, angle));
            } else {
              node.rotation = new X3D.SFRotation(x, y, z, angle);
            }
          } catch (e) {
            // silent fallback
          }
        }
      };

      // Set joint rotations in X3D scene graph
      setRotation('RightElbowJoint', -1, 0, 0, elbowRad);
      setRotation('LeftElbowJoint', -1, 0, 0, elbowRad * 0.8);
      setRotation('RightShoulderJoint', 0, 0, -1, shoulderRad);
      setRotation('LeftShoulderJoint', 0, 0, 1, shoulderRad * 0.8);
      setRotation('RightKneeJoint', 1, 0, 0, kneeRad);
      setRotation('LeftKneeJoint', 1, 0, 0, kneeRad * 0.8);
      setRotation('RightAnkleJoint', 1, 0, 0, ankleRad);
      setRotation('SpineFlexionJoint', 1, 0, 0, spineRad);
      setRotation('RightHipJoint', -1, 0, 0, hipRad);
      setRotation('NeckJoint', -1, 0, 0, neckRad);

      // 2. Update Muscle Appearance & Geometric Morphing (Bulging & Heatmaps)
      MUSCLE_GROUPS.forEach((muscle) => {
        const tension = tensions[muscle.id] ?? muscle.defaultTension;
        const isSelected = selectedMuscleId === muscle.id;

        // Capitalized ID for DEF names
        const capId = muscle.id.charAt(0).toUpperCase() + muscle.id.slice(1);
        const matNode = scene.getNamedNode(`${capId}Material`);
        const transformNode = scene.getNamedNode(`${capId}BellyTransform`);

        // Calculate RGB color based on View Mode
        let r = 0.8, g = 0.2, b = 0.2;
        let er = 0, eg = 0, eb = 0;

        if (viewMode === 'heatmap') {
          // Heatmap: Blue (relaxed) -> Yellow (moderate) -> Crimson/Orange Glow (high tension)
          if (tension < 0.4) {
            const factor = tension / 0.4;
            r = 0.1 + 0.6 * factor;
            g = 0.5 + 0.4 * factor;
            b = 0.9 - 0.7 * factor;
          } else if (tension < 0.8) {
            const factor = (tension - 0.4) / 0.4;
            r = 0.7 + 0.3 * factor;
            g = 0.9 - 0.5 * factor;
            b = 0.2 - 0.2 * factor;
          } else {
            r = 1.0;
            g = 0.4 * (1 - (tension - 0.8) / 0.2);
            b = 0.1;
            er = 0.3 * tension;
          }
        } else if (viewMode === 'xray') {
          // Semi-transparent blue/violet
          r = 0.3; g = 0.4; b = 0.85;
        } else if (viewMode === 'vectors') {
          // High contrast neon cyan/orange
          r = 0.1 + 0.9 * tension;
          g = 0.8 - 0.6 * tension;
          b = 0.9 - 0.8 * tension;
          er = 0.2 * tension;
        } else {
          // Realistic Anatomical Red
          r = 0.60 + 0.38 * tension;
          g = 0.18 - 0.10 * tension;
          b = 0.18 - 0.10 * tension;
        }

        // Highlight selected muscle
        if (isSelected) {
          er = 0.4;
          eg = 0.3;
          eb = 0.1;
        }

        // Apply Material Color
        if (matNode) {
          try {
            if (matNode.getField) {
              matNode.getField('diffuseColor').setValue(new X3D.SFColor(r, g, b));
              matNode.getField('emissiveColor').setValue(new X3D.SFColor(er, eg, eb));
            } else {
              matNode.diffuseColor = new X3D.SFColor(r, g, b);
              matNode.emissiveColor = new X3D.SFColor(er, eg, eb);
            }
          } catch (e) {
            // ignore
          }
        }

        // Apply Geometric Thickness Bulge (Muscle contracts -> swells in X/Z, shortens in Y)
        if (transformNode) {
          const thicknessScale = 1.0 + 0.65 * tension; // expands up to 165%
          const lengthScale = 1.0 - 0.18 * tension; // shortens up to 18%
          try {
            if (transformNode.getField) {
              transformNode.getField('scale').setValue(new X3D.SFVec3f(thicknessScale, lengthScale, thicknessScale));
            } else {
              transformNode.scale = new X3D.SFVec3f(thicknessScale, lengthScale, thicknessScale);
            }
          } catch (e) {
            // ignore
          }
        }
      });
    } catch (err) {
      console.warn('Error during scene graph sync:', err);
    }
  }, [tensions, viewMode, selectedMuscleId, isX3DReady]);

  // Trigger scene update on any state change
  useEffect(() => {
    updateSceneGraph();
  }, [updateSceneGraph]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl flex flex-col">
      {/* Visualizer Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">
            X_ITE 3D Biomechanical Engine
          </span>
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
            X3D v3.3
          </span>
        </div>

        {/* View Mode Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Render Mode:</span>
          <span className="font-medium text-rose-400 capitalize bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded">
            {viewMode} Mode
          </span>
        </div>
      </div>

      {/* Loading Overlay */}
      {!isX3DReady && !loadingError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-slate-300 gap-4">
          <div className="w-12 h-12 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
          <div className="text-center">
            <p className="font-semibold text-slate-100">Initializing X_ITE 3D Engine...</p>
            <p className="text-xs text-slate-400 mt-1">Building X3D Skeleton & Muscular Scene Graph</p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadingError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950 text-rose-400 p-6 text-center">
          <p className="font-semibold text-lg">{loadingError}</p>
          <p className="text-xs text-slate-400 mt-2">Check WebGL hardware acceleration in your browser settings.</p>
        </div>
      )}

      {/* X_ITE HTML5 Canvas Container */}
      <div ref={containerRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Visualizer Bottom Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-3">
          <span>🖱️ Left Click + Drag: Rotate</span>
          <span>•</span>
          <span>Shift + Drag: Pan</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] px-2">Quick Focus:</span>
          {MUSCLE_GROUPS.slice(0, 4).map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMuscle(m.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                selectedMuscleId === m.id
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
