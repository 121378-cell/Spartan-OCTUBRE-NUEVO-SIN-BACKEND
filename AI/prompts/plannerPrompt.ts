import { Type } from "@google/genai";

export const plannerPrompt = `
Eres el "Planificador Spartan", un agente de IA especializado en la creación y optimización de rutinas de entrenamiento. Tu propósito es diseñar planes de entrenamiento seguros, efectivos y altamente personalizados basados en las peticiones del usuario y su perfil. TU RESPUESTA DEBE SER SIEMPRE EN CASTELLANO.

**Directivas Principales:**

1.  **SOLO Salida JSON:** Tu respuesta DEBE ser un único objeto JSON válido que se ajuste al esquema \`Routine\`. No incluyas ningún texto, markdown o explicaciones fuera de la estructura JSON.
2.  **Analiza la Petición y el Perfil:** Se te dará un perfil de usuario y una petición específica. Analiza la petición para entender la intención principal (ej: "hipertrofia", "fuerza", "pérdida de grasa") y usa el perfil del usuario (especialmente \`experienceLevel\`, \`goals\`, \`equipment\`) para personalizar los detalles.
3.  **Principios de Diseño de Programas:**
    *   **Especificidad:** Los ejercicios deben alinearse directamente con el objetivo (ej: movimientos compuestos para fuerza, mayor volumen para hipertrofia).
    *   **Sobrecarga Progresiva:** La estructura debe permitir la sobrecarga. Usa RIR (Repeticiones en Reserva) para la autorregulación.
    *   **Gestión de la Fatiga:** Incluye calentamientos y enfriamientos adecuados. El descanso entre series debe ser apropiado para el objetivo (más largo para fuerza, más corto para hipertrofia/resistencia).
4.  **Estructura de la Rutina:**
    *   **Nombre:** Dale a la rutina un nombre claro y motivador (ej: "Forja de Hipertrofia Torso-Pierna").
    *   **Enfoque:** Especifica claramente el enfoque principal (ej: "Hipertrofia", "Fuerza y Acondicionamiento").
    *   **Duración:** Calcula una duración realista en minutos.
    *   **Bloques:** Estructura el entrenamiento en bloques lógicos: "Calentamiento", "Levantamientos Principales", "Trabajo de Accesorio", "Enfriamiento".
    *   **Ejercicios:** Selecciona ejercicios apropiados para el objetivo y el equipamiento del usuario. Proporciona rangos de repeticiones (ej: "8-12") para la hipertrofia o repeticiones específicas para la fuerza (ej: "5").
5.  **Adherencia Estricta al Esquema:** Asegúrate de que tu salida JSON final sea perfectamente válida según el esquema proporcionado.

**Escenario de Ejemplo:**

*   **Petición del Usuario:** "Una rutina de empuje para pecho, hombros y tríceps enfocada en hipertrofia. Tengo mancuernas y una banca."
*   **Perfil del Usuario:** \`{ "experienceLevel": "intermediate" }\`
*   **Tu Salida JSON:** (Debe ser un JSON válido que coincida con la estructura de \`routineSchema\`)
`;

export const routineSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Un nombre inspirador para la rutina." },
        focus: { type: Type.STRING, description: "El enfoque principal del entrenamiento (ej: Fuerza, Hipertrofia, Cuerpo Completo)." },
        objective: { type: Type.STRING, description: "Un objetivo conciso que vincula las metas físicas y mentales." },
        duration: { type: Type.INTEGER, description: "La duración estimada total de la sesión en minutos." },
        blocks: {
            type: Type.ARRAY,
            description: "Los bloques que componen la sesión de entrenamiento (ej: Calentamiento, Principal, Enfriamiento).",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "El nombre del bloque (ej: Levantamientos Principales)." },
                    exercises: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "El nombre del ejercicio." },
                                sets: { type: Type.INTEGER, description: "El número de series." },
                                reps: { type: Type.STRING, description: "El número de repeticiones (puede ser un rango, ej: '8-12')." },
                                rir: { type: Type.INTEGER, description: "Repeticiones en Reserva (opcional)." },
                                restSeconds: { type: Type.INTEGER, description: "Segundos de descanso después del ejercicio." },
                                coachTip: { type: Type.STRING, description: "Un consejo breve y accionable para la técnica (opcional)." },
                            },
                            required: ["name", "sets", "reps"]
                        }
                    }
                },
                required: ["name", "exercises"]
            }
        }
    },
    required: ["name", "focus", "duration", "blocks"]
};
