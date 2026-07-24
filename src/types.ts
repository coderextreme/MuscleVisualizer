export type ViewMode = 'realistic' | 'heatmap' | 'xray' | 'vectors' | 'skeleton';

export interface MuscleGroup {
  id: string;
  name: string;
  latinName: string;
  category: 'Upper Body' | 'Lower Body' | 'Core & Back' | 'Head & Neck';
  origin: string;
  insertion: string;
  action: string;
  innervation: string;
  antagonistId: string;
  jointName: string;
  jointAxis: 'X' | 'Y' | 'Z';
  jointMinAngleDeg: number;
  jointMaxAngleDeg: number;
  defaultTension: number; // 0 to 1
  maxForceN: number; // Maximum force in Newtons
  momentArmM: number; // Lever arm distance in meters
  color: string;
  description: string;
  clinicalNote?: string;
}

export interface JointState {
  angleDeg: number;
  torqueNm: number;
}

export interface MovementPreset {
  id: string;
  name: string;
  iconName: string;
  description: string;
  targetJoints: string[];
  durationSec: number;
  // Keyframe generator function mapping normalized time [0..1] to muscle tensions
  getTensions: (progress: number) => Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    muscleId?: string;
  }[];
  correctOptionId: string;
  explanation: string;
}
