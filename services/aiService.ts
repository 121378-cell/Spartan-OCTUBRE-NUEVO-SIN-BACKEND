

import { GoogleGenAI, Type } from "@google/genai";
// Fix: Import AiResponse to ensure type safety for processUserCommand.
import type { UserProfile, Routine, EvaluationFormData, WorkoutHistory, DailyLog, AiResponse } from '../types.ts';
import { masterPrompt } from '../AI/prompts/masterPrompt.ts';
import { plannerPrompt, routineSchema } from '../AI/prompts/plannerPrompt.ts';
import { strategistPrompt } from '../AI/prompts/strategistPrompt.ts';
import { biomechanicPrompt } from '../AI/prompts/biomechanicPrompt.ts';
import { oraclePrompt, oracleMilestoneSchema } from '../AI/prompts/oraclePrompt.ts';
import { initialPlanPrompt } from '../AI/prompts/initialPlanPrompt.ts';
import { adaptationPrompt } from '../AI/prompts/adaptationPrompt.ts';
import { successManualPrompt } from '../AI/prompts/successManualPrompt.ts';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const parseJsonResponse = <T>(text: string): T | null => {
    try {
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Original text:", text);
        return null;
    }
};

export const getMotivationalQuote = async (): Promise<{ quote: string; author: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Dame una cita motivacional corta sobre disciplina o fuerza, de un filósofo estoico, guerrero espartano, o atleta de élite. Formatea la respuesta como JSON con las claves 'quote' y 'author'.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quote: { type: Type.STRING },
                        author: { type: Type.STRING }
                    },
                    required: ["quote", "author"]
                }
            }
        });
        const json = parseJsonResponse<{ quote: string; author: string }>(response.text);
        return json || { quote: "El único mal día es el día que no entrenas.", author: "Desconocido" };
    } catch (error) {
        console.error("Error fetching motivational quote:", error);
        return { quote: "La fuerza no viene de la capacidad física. Viene de una voluntad indomable.", author: "Mahatma Gandhi" };
    }
};

export const getDailyBriefing = async (readiness: string, userProfile: UserProfile): Promise<string> => {
    try {
        const fullPrompt = `${strategistPrompt}\n\n---\n\nPreparación del Usuario: "${readiness}"\nPerfil de Usuario: ${JSON.stringify(userProfile)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching daily briefing:", error);
        return "Concéntrate en la técnica y la consistencia hoy. Cada repetición cuenta.";
    }
};

// Fix: Add explicit return type and specify generic for `parseJsonResponse` to fix downstream type errors.
export const processUserCommand = async (command: string, context: { userProfile: UserProfile; routines: Routine[] }): Promise<AiResponse | null> => {
    try {
        const fullPrompt = `${masterPrompt}\n\n---\n\nContexto Actual:\n${JSON.stringify(context)}\n\n---\n\nEntrada del Usuario: "${command}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return parseJsonResponse<AiResponse>(response.text);
    } catch (error) {
        console.error("Error processing user command:", error);
        return { type: 'response', message: "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento." };
    }
};


export const generateRoutine = async (prompt: string, userProfile: UserProfile): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const fullPrompt = `${plannerPrompt}\n\n---\n\nPetición del Usuario: "${prompt}"\nPerfil del Usuario: ${JSON.stringify(userProfile)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema
            }
        });
        return parseJsonResponse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error generating routine:", error);
        return null;
    }
};

export const getFormFeedbackFromVideo = async (exerciseName: string, videoBase64: string, mimeType: string): Promise<string> => {
    try {
        const fullPrompt = `${biomechanicPrompt}\n\n---\n\nEjercicio: "${exerciseName}"\nFeedback del Usuario: "Por favor, analiza mi técnica en este vídeo y dame un consejo clave para mejorar."`;

        const videoPart = {
            inlineData: {
                data: videoBase64,
                mimeType: mimeType
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using flash as it supports video/image input
            contents: { parts: [{ text: fullPrompt }, videoPart] }
        });

        return response.text;
    } catch (error) {
        console.error("Error getting form feedback:", error);
        return "No pude analizar el video. Asegúrate de que el movimiento sea claro y visible. Intenta de nuevo.";
    }
};


export const getOracleResponse = async (task: string, userProfile: Partial<UserProfile>, payload: any): Promise<any> => {
    try {
        let content = `${oraclePrompt}\n\n---\n\nTarea: \`${task}\`\nPerfil de Usuario: ${JSON.stringify(userProfile)}`;
        if (payload) {
            content += `\nPayload: ${JSON.stringify(payload)}`;
        }
        
        let config: any = {};
        if (task === 'generate-milestones') {
            config = {
                responseMimeType: "application/json",
                responseSchema: oracleMilestoneSchema
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
            config: config
        });

        if (task === 'generate-milestones') {
            return parseJsonResponse(response.text);
        }
        return response.text;

    } catch (error) {
        console.error(`Error with oracle task ${task}:`, error);
        if (task === 'generate-milestones') return [];
        return "El destino es incierto en este momento. Inténtalo de nuevo.";
    }
};

export const generateInitialPlan = async (formData: EvaluationFormData, userName: string): Promise<Omit<Routine, 'id'> | null> => {
    try {
        const content = `${initialPlanPrompt}\n\n---\n\nNombre de Usuario: "${userName}"\nDatos de Evaluación: ${JSON.stringify(formData)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
            config: {
                responseMimeType: "application/json",
                responseSchema: routineSchema
            }
        });
        return parseJsonResponse<Omit<Routine, 'id'>>(response.text);
    } catch (error) {
        console.error("Error generating initial plan:", error);
        return null;
    }
};

export const getAdaptationFeedback = async (context: any): Promise<string> => {
    try {
        const content = `${adaptationPrompt}\n\n---\n\nCONTEXTO:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content
        });
        return response.text;
    } catch (error) {
        console.error("Error getting adaptation feedback:", error);
        return "Hubo un error al analizar tu progreso. Por favor, asegúrate de que tus datos de check-in sean correctos. Para esta semana, concéntrate en la consistencia.";
    }
};


export const generateSuccessManual = async (context: any): Promise<string> => {
    try {
        const content = `${successManualPrompt}\n\n---\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content
        });
        return response.text;
    } catch (error) {
        console.error("Error generating success manual:", error);
        return "Hubo un error al generar tu manual. Por favor, inténtalo de nuevo más tarde.";
    }
};