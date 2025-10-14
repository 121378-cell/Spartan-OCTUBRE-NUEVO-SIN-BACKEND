export type Page = 
  'dashboard' | 
  'routines' | 
  'calendar' | 
  'profile' | 
  'session' |
  'legend' |
  'discipline' |
  'reconditioning' |
  'nutrition' |
  'master-regulation' |
  'synergy-hub' |
  'success-manual' |
  'flow';

export interface UserProfile {
  name: string;
  email: string;
  stats: {
    totalWorkouts: number;
    currentStreak: number;
    joinDate: string;
  };
  quest: string | null;
  milestones: Milestone[];
  trials: Trial[];
  onboardingCompleted: boolean;
  evaluationData: EvaluationFormData | null;
  isInAutonomyPhase: boolean;
  keystoneHabits: KeystoneHabit[];
  reflections: Reflection[];
  masterRegulationSettings: MasterRegulationSettings | null;
}

export interface MasterRegulationSettings {
  targetBedtime: string;
}

export interface Reflection {
  date: string;
  text: string;
}

export interface KeystoneHabit {
  id: string;
  name: string;
  anchor: string;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Trial {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: 'kg' | 'workouts' | 'days';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rir?: number;
  restSeconds?: number;
  coachTip?: string;
}

export interface RoutineBlock {
  name: string;
  exercises: Exercise[];
}

export interface Routine {
  id: string;
  name: string;
  focus: string;
  objective?: string;
  duration: number; // in minutes
  blocks: RoutineBlock[];
}

export interface SetProgress {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface ExerciseProgress {
  sets: SetProgress[];
}

export interface WorkoutSession {
  routine: Routine;
  startTime: number;
  progress: ExerciseProgress[][];
}

export interface WorkoutHistory {
  id: string;
  date: string;
  routineName: string;
  durationMinutes: number;
  totalWeightLifted: number;
  focus: string;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    feedback?: 'good' | 'bad';
}

export interface AiAction {
  name: string;
  payload: any;
}

export interface AiResponse {
  type: 'response' | 'action';
  message: string;
  feedback?: string;
  action?: AiAction;
}

export interface AppContextState {
    userProfile: UserProfile;
    routines: Routine[];
    activeSession: WorkoutSession | null;
    workoutHistory: WorkoutHistory[];
    currentPage: Page;
    isChatOpen: boolean;
    modal: {
        isOpen: boolean;
        type: string | null;
        payload?: any;
    };
    toast: {
        isVisible: boolean;
        message: string;
    };
    reconditioningPlans: ReconditioningPlan[];
    dailyLogs: DailyLog[];
    habitLogs: HabitLog[];
    weeklyCheckIns: WeeklyCheckIn[];
    
    // Functions
    setCurrentPage: (page: Page) => void;
    toggleChat: () => void;
    showModal: (type: string, payload?: any) => void;
    hideModal: () => void;
    showToast: (message: string) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    addRoutine: (routine: Omit<Routine, 'id'>) => void;
    startWorkout: (routine: Routine) => void;
    endWorkout: () => void;
    updateSetProgress: (blockIndex: number, exerciseIndex: number, setIndex: number, updates: Partial<SetProgress>) => void;
    handleAiResponse: (response: AiResponse) => void;
    logUserFeedback: (aiMessage: ChatMessage, userMessage: ChatMessage, feedback: 'good' | 'bad') => void;
    completeOnboarding: (name: string, evaluationData: EvaluationFormData, initialRoutine: Omit<Routine, 'id'>) => void;
    updateQuestAndMilestones: (quest: string, milestones: Omit<Milestone, 'id' | 'isCompleted'>[]) => void;
    addReconditioningPlan: (plan: Omit<ReconditioningPlan, 'id'>) => void;
    addOrUpdateDailyLog: (log: DailyLog) => void;
    addKeystoneHabit: (habit: Omit<KeystoneHabit, 'id' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => void;
    logHabitCompletion: (habitId: string) => void;
    addReflection: (text: string) => void;
    updateMasterRegulationSettings: (settings: MasterRegulationSettings) => void;
    addWeeklyCheckIn: (checkIn: Omit<WeeklyCheckIn, 'date'>) => void;
    requestAiRoutineSuggestion: () => void;
    requestAiReconditioningPlanSuggestion: () => void;
    requestSuccessManual: () => void;
}

export interface EvaluationFormData {
    physicalGoals: string;
    mentalGoals: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
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
    recovery: number; // 1-5 scale
}

export interface WeeklyCheckIn {
    date: string;
    weightKg?: number;
    habitAdherence: number; // 1-5 scale
    sleepQuality: number; // 0-10 scale
    perceivedStress: number; // 0-10 scale
    notes: string;
}