
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type {
  AppContextState, Page, UserProfile, Routine, WorkoutSession,
  SetProgress, AiResponse, ChatMessage, WorkoutHistory, EvaluationFormData,
  Milestone, ReconditioningPlan, DailyLog, KeystoneHabit, HabitLog, Reflection,
  MasterRegulationSettings, WeeklyCheckIn
} from '../types.ts';
import { generateRoutine, getAdaptationFeedback, generateSuccessManual } from '../services/aiService.ts';


const initialState: AppContextState = {
  userProfile: {
    name: 'Spartan',
    email: 'spartan@synergy.ai',
    stats: { totalWorkouts: 0, currentStreak: 0, joinDate: new Date().toLocaleDateString() },
    quest: null,
    milestones: [],
    trials: [
        { id: 'trial1', title: 'El Peso del Mundo', description: 'Levanta un total de 1,000,000 kg', target: 1000000, unit: 'kg' },
        { id: 'trial2', title: 'La Senda del Guerrero', description: 'Completa 100 entrenamientos', target: 100, unit: 'workouts' },
        { id: 'trial3', title: 'El Fuego de la Disciplina', description: 'Alcanza una racha de 30 días seguidos', target: 30, unit: 'days' },
    ],
    onboardingCompleted: false,
    evaluationData: null,
    isInAutonomyPhase: false,
    keystoneHabits: [],
    reflections: [],
    masterRegulationSettings: { targetBedtime: "22:30" }
  },
  routines: [],
  activeSession: null,
  workoutHistory: [],
  currentPage: 'dashboard',
  isChatOpen: false,
  modal: { isOpen: false, type: null, payload: null },
  toast: { isVisible: false, message: '' },
  reconditioningPlans: [],
  dailyLogs: [],
  habitLogs: [],
  weeklyCheckIns: [],

  // Functions
  setCurrentPage: () => {},
  toggleChat: () => {},
  showModal: () => {},
  hideModal: () => {},
  showToast: () => {},
  updateProfile: () => {},
  addRoutine: () => {},
  startWorkout: () => {},
  endWorkout: () => {},
  updateSetProgress: () => {},
  handleAiResponse: () => {},
  logUserFeedback: () => {},
  completeOnboarding: () => {},
  updateQuestAndMilestones: () => {},
  addReconditioningPlan: () => {},
  addOrUpdateDailyLog: () => {},
  addKeystoneHabit: () => {},
  logHabitCompletion: () => {},
  addReflection: () => {},
  updateMasterRegulationSettings: () => {},
  addWeeklyCheckIn: () => {},
  requestAiRoutineSuggestion: () => {},
  requestAiReconditioningPlanSuggestion: () => {},
  requestSuccessManual: () => {},
};

export const AppContext = createContext<AppContextState>(initialState);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Omit<AppContextState, 'setCurrentPage' | 'toggleChat' | 'showModal' | 'hideModal' | 'showToast' | 'updateProfile' | 'addRoutine' | 'startWorkout' | 'endWorkout' | 'updateSetProgress' | 'handleAiResponse' | 'logUserFeedback' | 'completeOnboarding' | 'updateQuestAndMilestones' | 'addReconditioningPlan' | 'addOrUpdateDailyLog' | 'addKeystoneHabit' | 'logHabitCompletion' | 'addReflection' | 'updateMasterRegulationSettings' | 'addWeeklyCheckIn' | 'requestAiRoutineSuggestion' | 'requestAiReconditioningPlanSuggestion' | 'requestSuccessManual'>>(() => {
    try {
      const storedState = localStorage.getItem('spartanAppState');
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error("Could not load state from localStorage", error);
    }
    return {
        ...initialState
    };
  });
  
  useEffect(() => {
    try {
      localStorage.setItem('spartanAppState', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save state to localStorage", error);
    }
  }, [state]);

  const setCurrentPage = (page: Page) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const toggleChat = () => {
    setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  };

  const showModal = useCallback((type: string, payload?: any) => {
    setState(prev => ({ ...prev, modal: { isOpen: true, type, payload } }));
  }, []);

  const hideModal = () => {
    setState(prev => ({ ...prev, modal: { isOpen: false, type: null, payload: null } }));
  };
  
  const showToast = (message: string) => {
    setState(prev => ({ ...prev, toast: { isVisible: true, message } }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toast: { isVisible: false, message: '' } }));
    }, 3000);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));
  };
  
  const addRoutine = (routineData: Omit<Routine, 'id'>) => {
    const newRoutine: Routine = {
      ...routineData,
      id: `routine_${Date.now()}`
    };
    setState(prev => ({ ...prev, routines: [...prev.routines, newRoutine] }));
  };
  
  const startWorkout = (routine: Routine) => {
    const newSession: WorkoutSession = {
        routine,
        startTime: Date.now(),
        progress: routine.blocks.map(block => 
            block.exercises.map(exercise => ({
                sets: Array(exercise.sets).fill(null).map(() => ({ weight: '', reps: '', completed: false }))
            }))
        )
    };
    setState(prev => ({ ...prev, activeSession: newSession, currentPage: 'session' }));
  };

  const endWorkout = () => {
    if (!state.activeSession) return;
    
    const { routine, startTime, progress } = state.activeSession;
    const durationMinutes = Math.round((Date.now() - startTime) / (1000 * 60));
    const totalWeightLifted = progress.flat().reduce((totalWeight, exerciseProgress) => {
        return totalWeight + exerciseProgress.sets.reduce((exerciseWeight, set) => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps, 10) || 0;
            return exerciseWeight + (weight * reps);
        }, 0);
    }, 0);

    const newHistoryEntry: WorkoutHistory = {
        id: `wh_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        routineName: routine.name,
        durationMinutes,
        totalWeightLifted,
        focus: routine.focus,
    };

    const newTotalWorkouts = state.userProfile.stats.totalWorkouts + 1;
    
    // Check for Autonomy Phase unlock
    let shouldUnlockAutonomy = !state.userProfile.isInAutonomyPhase && newTotalWorkouts >= 50;
    if(shouldUnlockAutonomy){
        showModal('autonomy-unlocked');
    }

    setState(prev => ({
      ...prev,
      activeSession: null,
      currentPage: 'dashboard',
      workoutHistory: [...prev.workoutHistory, newHistoryEntry],
      userProfile: {
          ...prev.userProfile,
          stats: {
              ...prev.userProfile.stats,
              totalWorkouts: newTotalWorkouts,
          },
          isInAutonomyPhase: prev.userProfile.isInAutonomyPhase || shouldUnlockAutonomy,
      }
    }));
    showModal('workout-summary', { name: routine.name, duration: durationMinutes, volume: totalWeightLifted });
  };
  
  const updateSetProgress = (blockIndex: number, exerciseIndex: number, setIndex: number, updates: Partial<SetProgress>) => {
    if (!state.activeSession) return;
    const newProgress = [...state.activeSession.progress];
    newProgress[blockIndex][exerciseIndex].sets[setIndex] = {
      ...newProgress[blockIndex][exerciseIndex].sets[setIndex],
      ...updates
    };
    setState(prev => ({
      ...prev,
      activeSession: { ...prev.activeSession!, progress: newProgress }
    }));
  };
  
  const handleAiResponse = (response: AiResponse) => {
    if (response.feedback) {
      showToast(response.feedback);
    }
    if (response.type === 'action' && response.action) {
      switch (response.action.name) {
        case 'addRoutine':
          addRoutine(response.action.payload.routine);
          break;
        case 'addReconditioningPlan':
          addReconditioningPlan(response.action.payload.plan);
          break;
        case 'openModal':
          showModal(response.action.payload.modalName);
          break;
        default:
          console.warn('Unknown AI action:', response.action.name);
      }
    }
  };
  
  const logUserFeedback = (aiMessage: ChatMessage, userMessage: ChatMessage, feedback: 'good' | 'bad') => {
      // In a real app, this would send data to a logging service for model fine-tuning
      console.log("User Feedback Logged:", {
          userQuery: userMessage.text,
          aiResponse: aiMessage.text,
          feedback
      });
      showToast("¡Gracias por tu feedback!");
  };

  const completeOnboarding = (name: string, evaluationData: EvaluationFormData, initialRoutine: Omit<Routine, 'id'>) => {
      setState(prev => ({
          ...prev,
          userProfile: {
              ...prev.userProfile,
              name,
              evaluationData,
              onboardingCompleted: true,
          },
          routines: [{ ...initialRoutine, id: `routine_${Date.now()}` }]
      }));
      hideModal();
  };
  
  const updateQuestAndMilestones = (quest: string, milestonesData: Omit<Milestone, 'id' | 'isCompleted'>[]) => {
      const newMilestones: Milestone[] = milestonesData.map((m, i) => ({
          ...m,
          id: `ms_${Date.now()}_${i}`,
          isCompleted: false,
      }));
      setState(prev => ({
          ...prev,
          userProfile: {
              ...prev.userProfile,
              quest,
              milestones: newMilestones
          }
      }));
  };

    const addReconditioningPlan = (planData: Omit<ReconditioningPlan, 'id'>) => {
        const newPlan: ReconditioningPlan = { ...planData, id: `rcp_${Date.now()}` };
        setState(prev => ({ ...prev, reconditioningPlans: [...prev.reconditioningPlans, newPlan] }));
    };

    const addOrUpdateDailyLog = (log: DailyLog) => {
        setState(prev => {
            const existingLogIndex = prev.dailyLogs.findIndex(l => l.date === log.date);
            if (existingLogIndex > -1) {
                const newLogs = [...prev.dailyLogs];
                newLogs[existingLogIndex] = log;
                return { ...prev, dailyLogs: newLogs };
            }
            return { ...prev, dailyLogs: [...prev.dailyLogs, log] };
        });
    };
    
    const addKeystoneHabit = (habitData: Omit<KeystoneHabit, 'id' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => {
        const newHabit: KeystoneHabit = {
            ...habitData,
            id: `habit_${Date.now()}`,
            currentStreak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString()
        };
        setState(prev => ({
            ...prev,
            userProfile: {
                ...prev.userProfile,
                keystoneHabits: [...prev.userProfile.keystoneHabits, newHabit]
            }
        }));
    };
    
    const logHabitCompletion = (habitId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const alreadyLogged = state.habitLogs.some(log => log.habitId === habitId && log.date === today);
        if (alreadyLogged) return;

        const newLog: HabitLog = { habitId, date: today };
        
        setState(prev => ({
            ...prev,
            habitLogs: [...prev.habitLogs, newLog],
            // Logic for updating streaks would be more complex, involving checking previous days.
            // Simplified for now.
        }));
        showToast("¡Hábito completado!");
    };
    
    const addReflection = (text: string) => {
        const today = new Date().toISOString().split('T')[0];
        const newReflection: Reflection = { date: today, text };
        setState(prev => {
            const existingIndex = prev.userProfile.reflections.findIndex(r => r.date === today);
            const newReflections = [...prev.userProfile.reflections];
            if (existingIndex > -1) {
                newReflections[existingIndex] = newReflection;
            } else {
                newReflections.push(newReflection);
            }
            return {
                ...prev,
                userProfile: {
                    ...prev.userProfile,
                    reflections: newReflections
                }
            };
        });
        showToast("Reflexión guardada.");
    };

    const updateMasterRegulationSettings = (settings: MasterRegulationSettings) => {
        setState(prev => ({
            ...prev,
            userProfile: { ...prev.userProfile, masterRegulationSettings: settings }
        }));
        showToast("Ajustes guardados.");
    };
    
    const addWeeklyCheckIn = async (checkIn: Omit<WeeklyCheckIn, 'date'>) => {
        const newCheckIn: WeeklyCheckIn = { ...checkIn, date: new Date().toISOString().split('T')[0] };
        
        const contextForAI = {
            userProfile: state.userProfile,
            routines: state.routines,
            lastTwoCheckIns: [...state.weeklyCheckIns, newCheckIn].slice(-2)
        };
        
        const feedback = await getAdaptationFeedback(contextForAI);
        
        setState(prev => ({
            ...prev,
            weeklyCheckIns: [...prev.weeklyCheckIns, newCheckIn]
        }));
        hideModal();
        showModal('weekly-check-in-feedback', { feedback });
    };

    const requestAiRoutineSuggestion = async () => {
        showToast("Consultando al Planificador IA...");
        const routine = await generateRoutine("Sugiéreme una rutina basada en mi perfil actual. Sorpréndeme.", state.userProfile);
        if (routine) {
            handleAiResponse({
                type: 'action',
                message: `El Planificador IA ha diseñado una nueva rutina para ti llamada '${routine.name}'. ¿Quieres añadirla a tu lista?`,
                feedback: 'Nueva rutina sugerida',
                action: { name: 'addRoutine', payload: { routine } }
            });
            // This is a bit of a hack to show the user the suggestion in chat.
            // A better implementation might use a dedicated suggestion modal.
            toggleChat(); 
        } else {
            showToast("La IA no pudo generar una sugerencia en este momento.");
        }
    };

    const requestAiReconditioningPlanSuggestion = () => {
        handleAiResponse({
            type: 'response',
            message: "Basado en tus datos recientes, un buen plan de reacondicionamiento sería 'Movilidad y Mindfulness'. Incluiría 10 minutos de estiramientos dinámicos y 5 minutos de meditación enfocada en la respiración. ¿Te gustaría que lo cree por ti?",
        });
        toggleChat();
    };

    const requestSuccessManual = async () => {
        showToast("El Cronista está analizando tu leyenda...");
        const context = {
            userProfile: state.userProfile,
            workoutHistory: state.workoutHistory,
            routines: state.routines,
            weeklyCheckIns: state.weeklyCheckIns,
        };
        const manualContent = await generateSuccessManual(context);
        if (manualContent) {
            showModal('success-manual', { manualContent });
        } else {
            showToast("No se pudo generar el manual. Inténtalo de nuevo.");
        }
    };


  const value: AppContextState = {
    ...state,
    setCurrentPage,
    toggleChat,
    showModal,
    hideModal,
    showToast,
    updateProfile,
    addRoutine,
    startWorkout,
    endWorkout,
    updateSetProgress,
    handleAiResponse,
    logUserFeedback,
    completeOnboarding,
    updateQuestAndMilestones,
    addReconditioningPlan,
    addOrUpdateDailyLog,
    addKeystoneHabit,
    logHabitCompletion,
    addReflection,
    updateMasterRegulationSettings,
    addWeeklyCheckIn,
    requestAiRoutineSuggestion,
    requestAiReconditioningPlanSuggestion,
    requestSuccessManual,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
