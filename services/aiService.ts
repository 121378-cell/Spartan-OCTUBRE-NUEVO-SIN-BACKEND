import { GoogleGenAI, Type } from "@google/genai";
import type { 
    UserProfile, 
    Routine, 
    EvaluationFormData, 
    WorkoutHistory, 
    DailyLog, 
    AiResponse,
    WeeklyCheckIn,
    Milestone,
    ChronotypeAnalysis,
    NutritionPlan,
    TrainingCycle,
    PrehabProtocol,
    HabitLog,
    KeystoneHabit,
    ReconditioningPlan,
    CycleReviewResponse,
    ScheduledWorkout
} from '../types';
import { masterPrompt } from '../AI/prompts/masterPrompt';
import { plannerPrompt, routineSchema } from '../AI/prompts/plannerPrompt';
import { initialPlanPrompt, initialPlanSchema } from '../AI/prompts/initialPlanPrompt';
import { biomechanicPrompt } from '../AI/prompts/biomechanicPrompt';
import { oraclePrompt, oracleMilestoneSchema } from '../AI/prompts/oraclePrompt';
import { strategistPrompt } from '../AI/prompts/strategistPrompt';
import { adaptationPrompt } from '../AI/prompts/adaptationPrompt';
import { successManualPrompt } from '../AI/prompts/successManualPrompt';
import { chronotypePrompt, chronotypeSchema } from '../AI/prompts/chronotypePrompt';
import { routineTranslatorPrompt } from '../AI/prompts/routineTranslatorPrompt';
import { reframingPrompt, reframingSchema } from '../AI/prompts/reframingPrompt';
import { nutritionistPrompt, nutritionPlanSchema } from '../AI/prompts/nutritionistPrompt';
import { prehabPrompt, prehabSchema } from '../AI/prompts/prehabPrompt';
import { resilienceAnalystPrompt } from '../AI/prompts/resilienceAnalystPrompt';
import { cyclicalReviewPrompt, cyclicalReviewSchema } from '../AI/prompts/cyclicalReviewPrompt';
import { periodizationGuardPrompt } from '../AI/prompts/periodizationGuardPrompt';
import { restructureSchedulePrompt, restructureScheduleSchema } from '../AI/prompts/restructureSchedulePrompt';
import { compensationPrompt } from '../AI/prompts/compensationPrompt';
import { timeAdjustmentPrompt } from '../AI/prompts/timeAdjustmentPrompt.ts';

const reconditioningPrompt = `
Eres el "Especialista en Recuperación Spartan", un agente de IA experto en recuperación física y mental, combinando conocimientos de fisioterapia deportiva y psicología del rendimiento. Tu propósito es crear planes de reacondicionamiento personalizados basados en la petición del usuario y su estado actual. TU RESPUESTA DEBE SER SIEMPRE EN CASTELLANO.

**Directivas Principales:**

1.  **SOLO Salida JSON:** Tu respuesta DEBE ser un único objeto JSON válido que se ajuste al esquema \`ReconditioningPlan\`. No incluyas ningún texto, markdown o explicaciones fuera de la estructura JSON.
2.  **Analiza la Petición y el Perfil:** Se te dará un perfil de usuario y una petición específica (ej: "estoy agotado mentalmente", "mis piernas están muy doloridas"). Analiza la petición para entender la necesidad principal (física, mental o mixta). Usa el perfil del usuario (especialmente \`dailyLogs\` recientes, \`stressLevel\`) para contextualizar la necesidad.
3.  **Principios de Diseño de Recuperación:**
    *   **Recuperación Física:** Si la petición es sobre dolor muscular (DOMS), incluye actividades como caminata ligera, estiramiento dinámico suave, o foam rolling para promover el flujo sanguíneo.
    *   **Recuperación Mental:** Si la petición es sobre estrés, fatiga mental o falta de sueño, incluye actividades como respiración diafragmática (ej: box breathing), meditación guiada corta o mindfulness.
    *   **Enfoque Mixto:** Si la petición es general, combina ambos tipos de actividades.
4.  **Estructura del Plan:**
    *   **Nombre:** Dale al plan un nombre claro y funcional (ej: "Protocolo de Alivio Muscular", "Reseteo Mental").
    *   **Enfoque:** Establece el enfoque como 'physical', 'mental', o 'mixed'.
    *   **Actividades:** Crea de 2 a 4 actividades. Para cada una, define su tipo ('physical' o 'mental') y una descripción clara y concisa (ej: "15 minutos a ritmo conversacional", "5 minutos, inhala 4s, sostén 4s, exhala 4s, sostén 4s").

5.  **Adherencia Estricta al Esquema:** Asegúrate de que tu salida JSON final sea perfectamente válida según el esquema proporcionado.
`;

const reconditioningPlanSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Un nombre claro y funcional para el plan." },
        focus: { type: Type.STRING, description: "El enfoque del plan: 'physical', 'mental', o 'mixed'." },
        activities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "El nombre de la actividad de recuperación." },
                    type: { type: Type.STRING, description: "El tipo de actividad: 'physical' o 'mental'." },
                    description: { type: Type.STRING, description: "Una instrucción breve y clara sobre cómo realizar la actividad (ej: duración, técnica)." }
                },
                required: ["name", "type", "description"]
            }
        }
    },
    required: ["name", "focus", "activities"]
};


// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-2.5-flash";

export interface InitialPlanResponse {
    routine: Omit<Routine, 'id'>;
    keystoneHabitSuggestion: Omit<KeystoneHabit, 'id' | 'currentStreak' | 'longestStreak'>;
}

export interface RecalculateResponse {
    newSchedule: ScheduledWorkout[];
    notification: string;
}

// Helper to safely parse JSON from AI response
const safeJsonParse = <T,>(jsonString: string): T | null => {
    try {
        // The API sometimes returns markdown ```json ... ```, so we strip it.
        const sanitizedString = jsonString.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(sanitizedString) as T;
    } catch (e) {
        console.error("Failed to parse AI response JSON:", e, "Raw string:", jsonString);
        return null;
    }
};

export const processUserCommand = async (command: string, context: { userProfile: UserProfile, routines: Routine[] }): Promise<AiResponse | null> => {
    try {
        const fullPrompt = `${masterPrompt}\n\nContexto del Usuario:\n${JSON.stringify(context, null, 2)}\n\nComando del Usuario: "${command}"`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return safeJsonParse<AiResponse>(response.text);
    } catch (error) {
        console.error("Error processing user command:", error);
        return { type: 'response', message: "Lo siento, estoy teniendo problemas para procesar tu solicitud." };
    }
};

export const generateRoutine = async (prompt: string, userProfile: UserProfile): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const fullPrompt = `${plannerPrompt}\n\nPerfil del Usuario:\n${JSON.stringify(userProfile, null, 2)}\n\nPetición: "${prompt}"`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema,
            },
        });
        return safeJsonParse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error generating routine:", error);
        return null;
    }
};

export const generateReconditioningPlan = async (prompt: string, userProfile: UserProfile): Promise<Omit<ReconditioningPlan, 'id'> | null> => {
    try {
        const fullPrompt = `${reconditioningPrompt}\n\nPerfil del Usuario:\n${JSON.stringify(userProfile, null, 2)}\n\nPetición: "${prompt}"`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reconditioningPlanSchema,
            },
        });
        return safeJsonParse<Omit<ReconditioningPlan, 'id'>>(response.text);
    } catch (error) {
        console.error("Error generating reconditioning plan:", error);
        return null;
    }
};

export const generateNewCyclePlan = async (userProfile: UserProfile, newPhase: TrainingCycle['phase']): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const prompt = `Mi fase de entrenamiento de '${userProfile.trainingCycle?.phase || 'adaptación'}' ha terminado. Por favor, genera un plan de entrenamiento completo para mi nueva fase de '${newPhase}'. El plan debe durar aproximadamente 4 semanas y estar diseñado como la siguiente etapa lógica en mi progresión. Ten en cuenta todo mi perfil de usuario para diseñarlo.`;
        
        // We can reuse the main routine generator AI, just with a very specific prompt.
        return await generateRoutine(prompt, userProfile);
    } catch (error) {
        console.error("Error generating new cycle plan:", error);
        return null;
    }
};


export const adaptRoutine = async (routine: Routine, context: 'bodyweight_only' | 'resistance_focus' | 'mental_recovery'): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const fullPrompt = `${routineTranslatorPrompt}\n\nRutina a adaptar:\n${JSON.stringify(routine, null, 2)}\n\nContexto de Adaptación: "${context}"`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema,
            },
        });
        return safeJsonParse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error adapting routine:", error);
        return null;
    }
};

export const generateInitialPlan = async (formData: EvaluationFormData, userName: string): Promise<InitialPlanResponse | null> => {
    try {
        const context = {
            userName,
            evaluationData: formData
        };
        const fullPrompt = `${initialPlanPrompt}\n\nContexto del Usuario:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: initialPlanSchema,
            }
        });
        return safeJsonParse<InitialPlanResponse>(response.text);
    } catch (error) {
        console.error("Error generating initial plan:", error);
        return null;
    }
};

export const getFormFeedbackFromVideo = async (exerciseName: string, videoBase64: string, mimeType: string): Promise<string> => {
    console.log("getFormFeedbackFromVideo called for", exerciseName, "MIME type:", mimeType, "Base64 length:", videoBase64.length);
    // Mocking the response as direct video analysis is not straightforward with the available APIs and guidelines.
    // A real implementation would require a different approach, possibly involving frame extraction.
    return new Promise((resolve) => {
        setTimeout(() => {
            const tips = [
                `Para ${exerciseName}, asegúrate de mantener el core apretado para estabilizar la columna. Un tronco firme es la base de un movimiento seguro y potente.`,
                `En ${exerciseName}, concéntrate en un rango de movimiento completo y controlado. Evita los movimientos bruscos; la calidad supera a la cantidad.`,
                `Al realizar ${exerciseName}, recuerda controlar la fase excéntrica (el descenso). Bajar el peso lentamente aumenta el tiempo bajo tensión y puede mejorar las ganancias de fuerza.`
            ];
            resolve(tips[Math.floor(Math.random() * tips.length)]);
        }, 2000);
    });
};

type OracleTask = 'generate-quest-prompt' | 'define-quest' | 'generate-milestones' | 'weekly-divination';

export const getOracleResponse = async (task: OracleTask, userProfile: UserProfile, payload: any): Promise<any> => {
    try {
        const context = { userProfile, ...payload };
        const fullPrompt = `${oraclePrompt}\n\nTarea: \`${task}\`\n\nContexto:\n${JSON.stringify(context, null, 2)}`;

        if (task === 'generate-milestones') {
            const response = await ai.models.generateContent({
                model,
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: oracleMilestoneSchema,
                }
            });
            const parsed = safeJsonParse<Omit<Milestone, 'id' | 'isCompleted'>[]>(response.text);
            return parsed?.map((m, i) => ({ ...m, id: `m-${Date.now()}-${i}`, isCompleted: false })) || [];

        } else {
             const response = await ai.models.generateContent({
                model,
                contents: fullPrompt,
            });
            return response.text;
        }
    } catch (error) {
        console.error(`Error with Oracle task ${task}:`, error);
        return "El Oráculo guarda silencio. Inténtalo de nuevo más tarde.";
    }
};

export const getStrategistTip = async (userProfile: UserProfile, synergisticLoadScore: number): Promise<string> => {
    try {
        const context = { userProfile, synergisticLoadScore };
        const fullPrompt = `${strategistPrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error("Error getting strategist tip:", error);
        return "La estrategia de hoy es simple: escucha a tu cuerpo y da lo mejor de ti.";
    }
}

export const getWeeklyCheckInFeedback = async (userProfile: UserProfile, checkIns: WeeklyCheckIn[]): Promise<string> => {
    try {
        const context = { userProfile, weeklyCheckIns: checkIns.slice(-2) }; // Provide last two check-ins for trend analysis
        const fullPrompt = `${adaptationPrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error("Error getting weekly check-in feedback:", error);
        return "Hubo un problema al analizar tu progreso. Consejo general: si te sientes bien, intenta aumentar ligeramente los pesos. Si te sientes cansado, céntrate en la técnica y la recuperación.";
    }
}

export const getSuccessManual = async (context: any): Promise<string> => {
    try {
        const fullPrompt = `${successManualPrompt}\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                temperature: 0.5, // Lower temperature for more deterministic, summary-style output
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting success manual:", error);
        return "Error al generar el manual. El Cronista necesita más tiempo para descifrar tus hazañas.";
    }
};

export const getChronotypeAnalysis = async (answers: string[]): Promise<ChronotypeAnalysis | null> => {
    try {
        const payload = {
            question1: answers[0],
            question2: answers[1],
            question3: answers[2],
            question4: answers[3],
        };
        const fullPrompt = `${chronotypePrompt}\n\nRespuestas del Usuario:\n${JSON.stringify(payload, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: chronotypeSchema,
            },
        });
        return safeJsonParse<ChronotypeAnalysis>(response.text);
    } catch (error) {
        console.error("Error getting chronotype analysis:", error);
        return null;
    }
};

export const getFailureReframing = async (
    userProfile: UserProfile, 
    failureContext: { type: 'nutrition' | 'recovery', score: number }
): Promise<{ reframedMessage: string; microAction: string } | null> => {
    try {
        const context = { userProfile, failureContext };
        const fullPrompt = `${reframingPrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reframingSchema,
            },
        });
        return safeJsonParse<{ reframedMessage: string; microAction: string }>(response.text);
    } catch (error) {
        console.error("Error getting failure reframing:", error);
        return null;
    }
};

export const getNutritionPlan = async (userProfile: UserProfile): Promise<NutritionPlan | null> => {
    try {
        const fullPrompt = `${nutritionistPrompt}\n\nContexto del Usuario:\n${JSON.stringify(userProfile, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nutritionPlanSchema,
            },
        });
        return safeJsonParse<NutritionPlan>(response.text);
    } catch (error) {
        console.error("Error getting nutrition plan:", error);
        return null;
    }
};

export const getPainManagementProtocol = async (
    painArea: string, 
    painDescription: string, 
    userProfile: UserProfile
): Promise<PrehabProtocol | null> => {
    try {
        const context = {
            userProfile,
            discomfortReport: {
                area: painArea,
                description: painDescription
            }
        };
        const fullPrompt = `${prehabPrompt}\n\nContexto del Usuario:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: prehabSchema,
            },
        });
        return safeJsonParse<PrehabProtocol>(response.text);
    } catch (error) {
        console.error("Error getting pain management protocol:", error);
        return null;
    }
};

export const getResilienceAnalysis = async (
    query: string,
    context: {
        userProfile: UserProfile;
        workoutHistory: WorkoutHistory[];
        dailyLogs: DailyLog[];
        habitLogs: HabitLog[];
        weeklyCheckIns: WeeklyCheckIn[];
    }
): Promise<string> => {
    try {
        const fullPrompt = `${resilienceAnalystPrompt}\n\nCONTEXTO DEL USUARIO (DATOS HISTÓRICOS):\n${JSON.stringify(context, null, 2)}\n\nPREGUNTA DEL USUARIO: "${query}"`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error("Error getting resilience analysis:", error);
        return "Lo siento, no pude analizar tus datos en este momento. Inténtalo de nuevo.";
    }
};

export const getCycleReview = async (
    userProfile: UserProfile,
    workoutHistory: WorkoutHistory[],
    habitLogs: HabitLog[]
): Promise<CycleReviewResponse | null> => {
    try {
        const cycleStartDate = userProfile.trainingCycle?.startDate;
        if (!cycleStartDate) return null;

        // Filter history for the current cycle
        const cycleWorkouts = workoutHistory.filter(h => h.date >= cycleStartDate);
        const cycleHabitLogs = habitLogs.filter(h => h.date >= cycleStartDate);

        const context = {
            userProfile,
            cycleData: {
                workoutHistory: cycleWorkouts,
                habitLogs: cycleHabitLogs,
            }
        };

        const fullPrompt = `${cyclicalReviewPrompt}\n\nContexto del Ciclo del Usuario:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: cyclicalReviewSchema,
            },
        });
        return safeJsonParse<CycleReviewResponse>(response.text);
    } catch (error) {
        console.error("Error getting cycle review:", error);
        return null;
    }
};

export const getPeriodizationGuardFeedback = async (
    currentSchedule: { date: string, focus: string }[],
    movedWorkout: { date: string, focus: string },
    targetDate: string
): Promise<string> => {
    try {
        const context = { currentSchedule, movedWorkout, targetDate };
        const fullPrompt = `${periodizationGuardPrompt}\n\nContexto del Cambio:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: { temperature: 0.2 }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting periodization guard feedback:", error);
        return "Hubo un problema al analizar el cambio. Procede con precaución.";
    }
};

export const recalculateScheduleForInterruption = async (
    currentSchedule: ScheduledWorkout[],
    routines: Routine[],
    interruptedDate: string
): Promise<RecalculateResponse | null> => {
    try {
        const scheduleWithFocus = currentSchedule.map(sw => ({
            date: sw.date,
            routineId: sw.routineId,
            focus: routines.find(r => r.id === sw.routineId)?.focus || 'Unknown'
        }));
        
        const context = {
            currentSchedule: scheduleWithFocus,
            interruptedDate,
        };
        const fullPrompt = `${restructureSchedulePrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;

        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: restructureScheduleSchema,
            },
        });

        return safeJsonParse<RecalculateResponse>(response.text);
    } catch (error) {
        console.error("Error recalculating schedule:", error);
        return null;
    }
};

export const compensateForSkippedWorkout = async (
    skippedRoutine: Routine,
    nextRoutine: Routine
): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const context = { skippedRoutine, nextRoutine };
        const fullPrompt = `${compensationPrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;

        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema,
            },
        });

        return safeJsonParse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error compensating for skipped workout:", error);
        return null;
    }
};

export const adjustRoutineForTime = async (
    routine: Routine,
    availableTime: number
): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const context = { routine, availableTime };
        const fullPrompt = `${timeAdjustmentPrompt}\n\nContexto:\n${JSON.stringify(context, null, 2)}`;

        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema,
            },
        });

        return safeJsonParse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error adjusting routine for time:", error);
        return null;
    }
};