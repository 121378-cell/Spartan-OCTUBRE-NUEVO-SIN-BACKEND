// types.ts

export type Page = 
  | 'dashboard' 
  | 'routines' 
  | 'calendar' 
  | 'exercise-library' 
  | 'session'
  | 'legend'
  | 'discipline'
  | 'reconditioning'
  | 'nutrition'
  | 'master-regulation'
  | 'success-manual'
  | 'flow'
  | 'progress'
  | 'synergy-hub';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  feedback?: 'good' | 'bad';
}

export interface AiResponseAction {
  name: string;
  payload: any;
}

export interface AiResponse {
  type: 'response' | 'action';
  message: string;
  feedback?: string;
  action?: AiResponseAction;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rir?: number;
  restSeconds?: number;
  coachTip?: string;
  tempo?: string;
}

export interface RoutineBlock {
  name: string;
  exercises: Exercise[];
}

export interface Routine {
  id: string;
  name: string;
  focus: string;
  duration: number;
  objective?: string;
  blocks: RoutineBlock[];
}

export interface ScheduledWorkout {
  date: string; // ISO string 'YYYY-MM-DD'
  routineId: string;
}

export interface SetProgress {
  weight: string;
  reps: string;
  rir?: number;
  completed: boolean;
  durationSeconds?: number;
  rpe?: number;
  quality?: 'max_focus' | 'acceptable' | 'distracted';
}

export interface ExerciseProgress {
  sets: SetProgress[];
}

export interface WorkoutSession {
  routine: Routine;
  progress: ExerciseProgress[][];
  startTime: number;
}

export interface WorkoutHistory {
  id: string;
  routineName: string;
  date: string;
  durationMinutes: number;
  totalWeightLifted: number;
  focus: string;
}

export interface Trial {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: 'kg' | 'workouts' | 'days';
}

export interface KeystoneHabit {
    id: string;
    name: string;
    anchor: string;
    currentStreak: number;
    longestStreak: number;
    notificationTime?: string; // e.g., "09:00"
}

export interface Reflection {
    date: string;
    text: string;
}

export interface JournalEntry {
    date: string; // ISO string
    type: 'ai_reframing' | 'user_reflection';
    title: string;
    body: string;
}

export interface MasterRegulationSettings {
    targetBedtime: string;
}

export interface NutritionSettings {
    priority: 'performance' | 'longevity';
    calorieGoal?: number;
    proteinGoal?: number;
}

export interface Milestone {
    id:string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface EvaluationFormData {
    physicalGoals: string;
    mentalGoals: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    weightKg: number;
    energyLevel: number;
    stressLevel: number;
    focusLevel: number;
    equipment: string;
    daysPerWeek: number;
    timePerSession: number;
    history: string;
    lifestyle: string;
    painPoint: string;
    communicationTone: 'motivator' | 'analytical' | 'technical';
    nutritionPriority: 'performance' | 'longevity';
    activeMobilityIssues?: MobilityIssue[];
}

export interface ProgressionOverride {
  recommendedWeight: number;
}

export interface TrainingCycle {
    phase: 'adaptation' | 'hypertrophy' | 'strength';
    startDate: string; // ISO string date
}

export interface UserProfile {
  name: string;
  email: string;
  quest: string;
  stats: {
    totalWorkouts: number;
    currentStreak: number;
    joinDate: string;
  };
  trials: Trial[];
  onboardingCompleted: boolean;
  keystoneHabits: KeystoneHabit[];
  reflections: Reflection[];
  journal: JournalEntry[];
  masterRegulationSettings: MasterRegulationSettings;
  nutritionSettings: NutritionSettings;
  milestones: Milestone[];
  isInAutonomyPhase: boolean;
  weightKg?: number;
  evaluationData?: EvaluationFormData;
  progressionOverrides?: Record<string, Record<string, ProgressionOverride>>;
  trainingCycle?: TrainingCycle;
  lastMobilityAssessmentDate?: string;
  activeMobilityIssues?: string[];
  chronotypeAnalysis?: ChronotypeAnalysis;
  lastWeeklyPlanDate?: string;
}

export interface ModalPayload {
  [key: string]: any;
}

export type ModalPosition = 'center' | 'side';
export type ModalSize = 'default' | 'large' | 'xl';

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  payload?: ModalPayload;
  position?: ModalPosition;
  size?: ModalSize;
  isCritical?: boolean;
}


export interface ToastState {
  isVisible: boolean;
  message: string;
}

export interface ReconditioningActivity {
    name: string;
    type: 'physical' | 'mental';
    description: string;
}

export interface ReconditioningPlan {
    id: string;
    name: string;
    focus: 'physical' | 'mental' | 'mixed';
    activities: ReconditioningActivity[];
}

export interface DailyLog {
    date: string;
    nutrition: number; // 1-5 scale
    recovery: number; // 1-5 scale (sleep/stress)
}

export interface HabitLog {
    habitId: string;
    date: string;
}

export interface WeeklyCheckIn {
    date: string;
    weightKg?: number;
    habitAdherence: number; // 1-5 scale
    sleepQuality: number; // 0-10 scale
    perceivedStress: number; // 0-10 scale
    notes: string;
}

export interface ChronotypeAnalysis {
    chronotype: string;
    description: string;
    recommendations: {
        area: string;
        advice: string;
    }[];
}

export interface ExerciseDetail {
    id: string;
    name: string;
    muscleGroups: string[];
    equipment: string;
    instructions: string[];
    biomechanicsFocus: string;
    injuryModifications: Record<string, { modification: string; reason: string }>;
    videoUrl?: string;
    deviation?: {
      animationName: string; // name of the animation clip in the GLB
      highlightPart: string; // name of the body part mesh to highlight
    };
    suggestedView?: 'frontal' | 'lateral' | 'superior';
}

export type MobilityIssue = 'tobillo' | 'hombro' | 'cadera' | 'toracica';

export interface MobilityTest {
    id: string;
    name: string;
    instructions: string[];
    passCriteria: string;
    failCriteria: string;
    associatedIssue: MobilityIssue;
}

export interface MobilityDrill {
    id: string;
    name: string;
    description: string;
    addresses: MobilityIssue[];
}

export interface NutritionPlan {
    macros: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    timing: string;
    supplements: {
        name: string;
        reason: string;
    }[];
    mealIdeas: string[];
    functionalFoods: {
        name: string;
        benefit: string;
    }[];
    inflammatoryFoodsToLimit: string;
}

export interface PrehabProtocol {
  analysis: string;
  biomechanicalAdjustments: string[];
  prehabRoutine: {
    name: string;
    instruction: string;
  }[];
}

export interface CycleReviewResponse {
    decision: 'progress' | 'extend';
    reasoning: string;
    focusPoints: string[];
}

export type BodyPart = 'Hombro' | 'Rodilla' | 'Espalda Baja' | 'Codo' | 'Muñeca' | 'Cadera' | 'Tobillo' | 'Cuello' | 'Torso' | 'Otro';