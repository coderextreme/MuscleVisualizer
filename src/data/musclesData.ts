import { MuscleGroup, MovementPreset, QuizQuestion } from '../types';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'biceps',
    name: 'Biceps Brachii',
    latinName: 'Musculus biceps brachii',
    category: 'Upper Body',
    origin: 'Supraglenoid tubercle & Coracoid process of scapula',
    insertion: 'Radial tuberosity & bicipital aponeurosis',
    action: 'Flexion and supination of the forearm at the elbow joint',
    innervation: 'Musculocutaneous nerve (C5-C7)',
    antagonistId: 'triceps',
    jointName: 'RightElbowJoint',
    jointAxis: 'X',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 135,
    defaultTension: 0.2,
    maxForceN: 1200,
    momentArmM: 0.045,
    color: '#ef4444',
    description: 'A two-headed muscle located on the anterior upper arm. Contracts to pull the forearm upward toward the shoulder.',
    clinicalNote: 'Overload during eccentric lengthening can cause biceps tendon strain or distal rupture.'
  },
  {
    id: 'triceps',
    name: 'Triceps Brachii',
    latinName: 'Musculus triceps brachii',
    category: 'Upper Body',
    origin: 'Infraglenoid tubercle of scapula & posterior humerus',
    insertion: 'Olecranon process of ulna',
    action: 'Extension of the forearm at the elbow joint',
    innervation: 'Radial nerve (C6-C8)',
    antagonistId: 'biceps',
    jointName: 'RightElbowJoint',
    jointAxis: 'X',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 135,
    defaultTension: 0.1,
    maxForceN: 1400,
    momentArmM: 0.03,
    color: '#f97316',
    description: 'A large three-headed muscle on the back of the upper arm responsible for straightening the elbow.',
    clinicalNote: 'Essential for push movements and stabilizing the elbow during precise hand placement.'
  },
  {
    id: 'deltoid',
    name: 'Deltoid (Anterior & Lateral)',
    latinName: 'Musculus deltoideus',
    category: 'Upper Body',
    origin: 'Clavicle, acromion, and spine of scapula',
    insertion: 'Deltoid tuberosity of humerus',
    action: 'Arm abduction, flexion, and medial rotation at glenohumeral joint',
    innervation: 'Axillary nerve (C5-C6)',
    antagonistId: 'latissimus',
    jointName: 'RightShoulderJoint',
    jointAxis: 'Z',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 140,
    defaultTension: 0.15,
    maxForceN: 1800,
    momentArmM: 0.05,
    color: '#3b82f6',
    description: 'Forming the rounded contour of the human shoulder, the deltoid lifts the upper arm away from the trunk.',
    clinicalNote: 'Susceptible to impingement in overhead throwing sports when rotator cuff muscles weaken.'
  },
  {
    id: 'pectoralis',
    name: 'Pectoralis Major',
    latinName: 'Musculus pectoralis major',
    category: 'Upper Body',
    origin: 'Medial clavicle, sternum, and costal cartilages',
    insertion: 'Greater tubercle crest of humerus',
    action: 'Adduction, medial rotation, and horizontal flexion of humerus',
    innervation: 'Lateral & medial pectoral nerves (C5-T1)',
    antagonistId: 'latissimus',
    jointName: 'RightShoulderJoint',
    jointAxis: 'Y',
    jointMinAngleDeg: -30,
    jointMaxAngleDeg: 90,
    defaultTension: 0.1,
    maxForceN: 2100,
    momentArmM: 0.06,
    color: '#ec4899',
    description: 'A thick, fan-shaped muscle on the anterior chest wall driving powerful pressing and hugging movements.',
    clinicalNote: 'Primary driver during bench press movements; generates significant thoracic compression.'
  },
  {
    id: 'quadriceps',
    name: 'Quadriceps Femoris',
    latinName: 'Musculus quadriceps femoris',
    category: 'Lower Body',
    origin: 'Anterior inferior iliac spine & femoral shaft',
    insertion: 'Tibial tuberosity via patellar ligament',
    action: 'Extension of the knee joint & flexion of hip joint',
    innervation: 'Femoral nerve (L2-L4)',
    antagonistId: 'hamstrings',
    jointName: 'RightKneeJoint',
    jointAxis: 'X',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 120,
    defaultTension: 0.25,
    maxForceN: 4500,
    momentArmM: 0.05,
    color: '#10b981',
    description: 'The largest muscle group in the human body, key for standing, jumping, walking, and knee stabilization.',
    clinicalNote: 'Patellar tendonitis ("Jumper Knee") often occurs from repetitive high tension during landing.'
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings (Biceps Femoris)',
    latinName: 'Musculi hamstring',
    category: 'Lower Body',
    origin: 'Ischial tuberosity & posterior femur',
    insertion: 'Head of fibula & medial condyle of tibia',
    action: 'Flexion of knee joint & extension of hip joint',
    innervation: 'Sciatic nerve (Tibial branch, L5-S2)',
    antagonistId: 'quadriceps',
    jointName: 'RightKneeJoint',
    jointAxis: 'X',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 120,
    defaultTension: 0.15,
    maxForceN: 2800,
    momentArmM: 0.04,
    color: '#8b5cf6',
    description: 'Located on the back of the thigh, flexing the knee joint and pulling the lower leg backward.',
    clinicalNote: 'Frequent strain injury during maximum sprinting acceleration when switching from flexor to decelerator.'
  },
  {
    id: 'gastrocnemius',
    name: 'Gastrocnemius (Calf)',
    latinName: 'Musculus gastrocnemius',
    category: 'Lower Body',
    origin: 'Lateral and medial condyles of femur',
    insertion: 'Calcaneus via Achilles tendon',
    action: 'Plantarflexion of the foot & weak knee flexion',
    innervation: 'Tibial nerve (S1-S2)',
    antagonistId: 'quadriceps',
    jointName: 'RightAnkleJoint',
    jointAxis: 'X',
    jointMinAngleDeg: -15,
    jointMaxAngleDeg: 45,
    defaultTension: 0.2,
    maxForceN: 3200,
    momentArmM: 0.055,
    color: '#14b8a6',
    description: 'Two-headed calf muscle creating the prominent belly on the posterior lower leg, pulling the heel up.',
    clinicalNote: 'Transfers high kinetic forces through the Achilles tendon, enduring over 6x bodyweight during running jumps.'
  },
  {
    id: 'gluteus',
    name: 'Gluteus Maximus',
    latinName: 'Musculus gluteus maximus',
    category: 'Lower Body',
    origin: 'Posterior ilium, sacrum, and coccyx',
    insertion: 'Gluteal tuberosity of femur & iliotibial tract',
    action: 'Hip extension, lateral rotation, and abduction',
    innervation: 'Inferior gluteal nerve (L5-S2)',
    antagonistId: 'quadriceps',
    jointName: 'RightHipJoint',
    jointAxis: 'X',
    jointMinAngleDeg: -10,
    jointMaxAngleDeg: 40,
    defaultTension: 0.15,
    maxForceN: 3800,
    momentArmM: 0.07,
    color: '#f59e0b',
    description: 'The main powerful extensor muscle of the hip, stabilizing upright posture and propelling step strides.',
    clinicalNote: 'Inhibition from prolonged sitting leads to gluteal amnesia and secondary lower back compensation.'
  },
  {
    id: 'abdominis',
    name: 'Rectus Abdominis (Abs)',
    latinName: 'Musculus rectus abdominis',
    category: 'Core & Back',
    origin: 'Pubic crest and pubic symphysis',
    insertion: 'Xiphoid process & 5th-7th costal cartilages',
    action: 'Flexion of the lumbar spine & abdominal compression',
    innervation: 'Thoracoabdominal nerves (T7-T11)',
    antagonistId: 'trapezius',
    jointName: 'SpineFlexionJoint',
    jointAxis: 'X',
    jointMinAngleDeg: 0,
    jointMaxAngleDeg: 45,
    defaultTension: 0.15,
    maxForceN: 1600,
    momentArmM: 0.08,
    color: '#06b6d4',
    description: 'Paired vertical core muscle segmented by tendinous intersections ("six-pack"), pulling ribcage toward pelvis.',
    clinicalNote: 'Crucial for intra-abdominal pressure stabilization during heavy lift resistance exercises.'
  },
  {
    id: 'trapezius',
    name: 'Trapezius & Neck Flexors',
    latinName: 'Musculus trapezius',
    category: 'Head & Neck',
    origin: 'External occipital protuberance & spinous processes T1-T12',
    insertion: 'Lateral clavicle, acromion, and scapular spine',
    action: 'Scapular elevation/rotation & neck extension/tilt',
    innervation: 'Spinal accessory nerve (CN XI)',
    antagonistId: 'abdominis',
    jointName: 'NeckJoint',
    jointAxis: 'X',
    jointMinAngleDeg: -20,
    jointMaxAngleDeg: 35,
    defaultTension: 0.1,
    maxForceN: 1500,
    momentArmM: 0.04,
    color: '#a855f7',
    description: 'Large diamond-shaped superficial back & neck muscle controlling shoulder blade elevation and head angle.',
    clinicalNote: 'Frequent site of tension headaches and posture strain from forward head posture on screens.'
  }
];

export const MOVEMENT_PRESETS: MovementPreset[] = [
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    iconName: 'Dumbbell',
    description: 'Isolated elbow flexion demonstrating agonistic contraction of Biceps and antagonistic elongation of Triceps.',
    targetJoints: ['RightElbowJoint'],
    durationSec: 3.5,
    getTensions: (p: number) => {
      // Sine wave motion [0..1] -> [0..1..0]
      const sine = (Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      return {
        biceps: 0.05 + 0.90 * sine,
        triceps: 0.05 + 0.10 * (1 - sine),
        deltoid: 0.15 + 0.20 * sine
      };
    }
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    iconName: 'Activity',
    description: 'Compound leg movement showing Quadriceps knee extension and Gluteus hip drive in co-activation.',
    targetJoints: ['RightKneeJoint', 'RightHipJoint'],
    durationSec: 4.0,
    getTensions: (p: number) => {
      const sine = (Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      return {
        quadriceps: 0.10 + 0.85 * sine,
        gluteus: 0.10 + 0.80 * sine,
        hamstrings: 0.10 + 0.55 * sine,
        gastrocnemius: 0.15 + 0.40 * sine,
        abdominis: 0.20 + 0.35 * sine
      };
    }
  },
  {
    id: 'shoulder-press',
    name: 'Overhead Shoulder Press',
    iconName: 'Zap',
    description: 'Shoulder abduction and elbow extension driven by Deltoid, Trapezius, and Triceps co-contraction.',
    targetJoints: ['RightShoulderJoint', 'RightElbowJoint'],
    durationSec: 3.8,
    getTensions: (p: number) => {
      const sine = (Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      return {
        deltoid: 0.10 + 0.85 * sine,
        triceps: 0.10 + 0.75 * sine,
        trapezius: 0.10 + 0.65 * sine,
        pectoralis: 0.10 + 0.30 * (1 - sine)
      };
    }
  },
  {
    id: 'core-crunch',
    name: 'Abdominal Crunch',
    iconName: 'Flame',
    description: 'Lumbar spine flexion driven by high tension in Rectus Abdominis.',
    targetJoints: ['SpineFlexionJoint'],
    durationSec: 3.2,
    getTensions: (p: number) => {
      const sine = (Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      return {
        abdominis: 0.10 + 0.88 * sine,
        pectoralis: 0.10 + 0.35 * sine,
        trapezius: 0.10 + 0.25 * sine
      };
    }
  }
];

export const ANATOMY_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'When performing an explosive Bicep Curl, which muscle acts as the primary agonist, and what happens to its antagonist?',
    options: [
      { id: 'o1', text: 'Biceps Brachii contracts (agonist), Triceps Brachii elongates/relaxes (antagonist)', muscleId: 'biceps' },
      { id: 'o2', text: 'Triceps Brachii contracts (agonist), Deltoid elongates', muscleId: 'triceps' },
      { id: 'o3', text: 'Quadriceps contracts while Biceps remains isometric', muscleId: 'quadriceps' },
      { id: 'o4', text: 'Pectoralis Major contracts while Biceps relaxes' }
    ],
    correctOptionId: 'o1',
    explanation: 'Reciprocal inhibition causes the antagonist (Triceps Brachii) to relax as the agonist (Biceps Brachii) contracts to flex the elbow joint.'
  },
  {
    id: 'q2',
    question: 'Which muscle group is responsible for extending the knee joint during a deep leg squat rising phase?',
    options: [
      { id: 'o1', text: 'Hamstrings' },
      { id: 'o2', text: 'Quadriceps Femoris', muscleId: 'quadriceps' },
      { id: 'o3', text: 'Gastrocnemius', muscleId: 'gastrocnemius' },
      { id: 'o4', text: 'Rectus Abdominis', muscleId: 'abdominis' }
    ],
    correctOptionId: 'o2',
    explanation: 'The Quadriceps Femoris inserts into the tibial tuberosity via the patellar tendon, pulling the tibia to straighten (extend) the knee.'
  },
  {
    id: 'q3',
    question: 'What is the primary action of the Deltoid muscle when its tension increases above 70%?',
    options: [
      { id: 'o1', text: 'Flexing the elbow towards the chest' },
      { id: 'o2', text: 'Abducting the arm (lifting it sideways away from the body)', muscleId: 'deltoid' },
      { id: 'o3', text: 'Extending the hip backward' },
      { id: 'o4', text: 'Plantarflexing the ankle joint' }
    ],
    correctOptionId: 'o2',
    explanation: 'The Deltoid muscle abducts the upper arm at the shoulder glenohumeral joint, lifting it laterally.'
  }
];
