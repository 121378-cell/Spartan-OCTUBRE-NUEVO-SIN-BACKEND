
import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import StrategistIcon from '../icons/StrategistIcon.tsx';

const PropheticInterventionModal: React.FC = () => {
    const { hideModal, handleAiResponse, showToast, toggleChat } = useAppContext();

    const handleAccept = () => {
        // Use the AI to generate an active recovery plan
        handleAiResponse({
            type: 'action',
            message: "He creado un plan de 'Recuperación Activa' con estiramientos suaves y respiración para ayudar a la reparación muscular y mental. Lo he añadido a tus planes de reacondicionamiento.",
            feedback: "Plan de recuperación sugerido",
            action: {
                name: "addReconditioningPlan",
                payload: {
                    plan: {
                        name: "Recuperación Activa (Preventiva)",
                        focus: "mixed",
                        activities: [
                            { name: "Caminata Ligera", type: "physical", description: "15 minutos a un ritmo fácil para promover el flujo sanguíneo." },
                            { name: "Estiramiento Dinámico", type: "physical", description: "10 minutos de estiramientos de cuerpo completo sin forzar." },
                            { name: "Respiración de Coherencia", type: "mental", description: "5 minutos para calmar el sistema nervioso (Inhala 5s, Exhala 5s)." }
                        ]
                    }
                }
            }
        });
        showToast("Plan de Recuperación Activa añadido.");
        hideModal();
    };
    
    const handleDecline = () => {
        // Provide an alternative
        toggleChat();
        handleAiResponse({
            type: 'response',
            message: "Entendido. Si prefieres continuar con tu plan, asegúrate de escuchar a tu cuerpo. Considera reducir la intensidad un 20% si te sientes fatigado. ¿Hay algo más en lo que pueda ayudarte?",
        });
        hideModal();
    }

    return (
        <div className="text-center">
            <div className="w-20 h-20 bg-spartan-surface rounded-full flex items-center justify-center mx-auto mb-4 text-spartan-gold">
                <StrategistIcon className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-2">Intervención Estratégica</h2>
            <p className="text-spartan-text-secondary mb-6">
                Basado en tu 'Firma de Desgaste' detectada, el Estratega recomienda reemplazar tu próximo entrenamiento de alta intensidad con una sesión de recuperación activa. Esto evitará el agotamiento y asegurará ganancias a largo plazo.
            </p>

            <div className="bg-spartan-card p-4 rounded-lg text-left">
                <p><strong>Sugerencia:</strong> Añadir un plan de "Recuperación Activa" a tu sección de Reacondicionamiento.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                 <button
                    onClick={handleDecline}
                    className="py-2 px-6 bg-spartan-card hover:bg-spartan-border rounded-lg transition-colors"
                >
                    No, gracias
                </button>
                <button
                    onClick={handleAccept}
                    className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Aceptar y Crear Plan
                </button>
            </div>
        </div>
    );
};

export default PropheticInterventionModal;
