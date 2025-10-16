import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { getPainManagementProtocol } from '../../services/aiService.ts';
import LoadingSpinner from '../LoadingSpinner.tsx';
import type { BodyPart } from '../../types.ts';
import BodyMap from '../BodyMap.tsx';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary.ts';

const DiscomfortReportModal: React.FC = () => {
    const { userProfile, hideModal, showModal, showToast, modal } = useAppContext();
    const { exerciseName } = modal.payload || {};
    const [painArea, setPainArea] = useState<BodyPart | null>(null);
    const [painDescription, setPainDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!painArea) {
            showToast("Por favor, selecciona un área en el mapa corporal.");
            return;
        }
        if (!painDescription.trim()) {
            showToast("Por favor, describe tu molestia.");
            return;
        }
        setIsLoading(true);

        // HOLO5: Intervention-based activation logic
        if (exerciseName && painArea) {
            const exercise = EXERCISE_LIBRARY.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase());
            if (exercise?.deviation && exercise.deviation.highlightPart.toLowerCase() === painArea.toLowerCase()) {
                hideModal();
                showToast(`Intervención: Mostrando desvío común para ${exerciseName}.`);
                showModal('exercise-detail', { exerciseId: exercise.id, openWithDeviation: true }, { size: 'xl' });
                return; // End flow here, prioritizing hologram intervention
            }
        }
        
        // Original flow if no specific deviation is matched
        const protocol = await getPainManagementProtocol(painArea, painDescription, userProfile);
        setIsLoading(false);

        if (protocol) {
            hideModal();
            showModal('prehab-protocol', { protocol });
        } else {
            showToast("La IA no pudo generar un protocolo. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-4">Reporte de Molestia</h2>
            <p className="text-spartan-text-secondary mb-6">
                Selecciona el área y describe la molestia para que el especialista de IA pueda ayudarte.
            </p>
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <LoadingSpinner />
                    <p className="mt-4 text-spartan-text-secondary">Analizando tu reporte...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-spartan-text-secondary mb-2">1. Selecciona el Área de la Molestia</label>
                        <BodyMap 
                            selectedParts={painArea ? [painArea] : []}
                            onPartSelect={(part) => setPainArea(part as BodyPart)}
                            multiple={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="painDescription" className="block text-sm font-medium text-spartan-text-secondary mb-1">2. Describe la Sensación</label>
                        <textarea
                            id="painDescription"
                            rows={3}
                            value={painDescription}
                            onChange={(e) => setPainDescription(e.target.value)}
                            className="w-full bg-spartan-card border border-spartan-border rounded-lg p-2 focus:ring-2 focus:ring-spartan-gold focus:outline-none"
                            placeholder="Ej: 'Dolor sordo en la parte frontal del hombro al hacer press de banca' o 'Pinchazo en la rodilla al bajar en la sentadilla'."
                        />
                    </div>
                </div>
            )}


            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={hideModal}
                    disabled={isLoading}
                    className="py-2 px-4 bg-spartan-surface hover:bg-spartan-border rounded-lg transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="py-2 px-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-spartan-border"
                >
                    {isLoading ? 'Analizando...' : 'Analizar y Obtener Protocolo'}
                </button>
            </div>
        </div>
    );
};

export default DiscomfortReportModal;