import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateNewCyclePlan, getCycleReview } from '../../services/aiService';
import type { Routine, TrainingCycle, CycleReviewResponse } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import BrainIcon from '../icons/BrainIcon';
import DumbbellIcon from '../icons/DumbbellIcon';
import ZapIcon from '../icons/ZapIcon';
import CycleIcon from '../icons/CycleIcon';
import TargetIcon from '../icons/TargetIcon';
import DetailedSynergyChart from '../DetailedSynergyChart';

type ModalView = 'loadingReview' | 'showReview' | 'generatingPlan' | 'error';

const NewTrainingCycleModal: React.FC = () => {
    const { userProfile, startNewCycle, hideModal, workoutHistory, habitLogs, extendCurrentCycle } = useAppContext();
    const [view, setView] = useState<ModalView>('loadingReview');
    const [review, setReview] = useState<CycleReviewResponse | null>(null);

    const currentPhase = userProfile.trainingCycle?.phase || 'adaptation';
    
    const phaseProgression: Record<TrainingCycle['phase'], TrainingCycle['phase']> = {
        adaptation: 'hypertrophy',
        hypertrophy: 'strength',
        strength: 'adaptation',
    };
    const nextPhase = phaseProgression[currentPhase];
    
    const phaseDetails: Record<TrainingCycle['phase'], { title: string; description: string; icon: React.ReactNode }> = {
        adaptation: { title: "Adaptación", description: "Construye una base sólida y perfecciona la técnica.", icon: <BrainIcon className="w-8 h-8" /> },
        hypertrophy: { title: "Hipertrofia", description: "Maximiza el volumen para el crecimiento muscular.", icon: <DumbbellIcon className="w-8 h-8" /> },
        strength: { title: "Fuerza", description: "Enfócate en levantamientos pesados para aumentar la potencia.", icon: <ZapIcon className="w-8 h-8" /> }
    };
    const nextPhaseDetails = phaseDetails[nextPhase];

    useEffect(() => {
        const fetchReview = async () => {
            const reviewData = await getCycleReview(userProfile, workoutHistory, habitLogs);
            if (reviewData) {
                setReview(reviewData);
                setView('showReview');
            } else {
                setView('error');
            }
        };
        fetchReview();
    }, [userProfile, workoutHistory, habitLogs]);

    const handleGeneratePlan = async () => {
        setView('generatingPlan');
        const newRoutine = await generateNewCyclePlan(userProfile, nextPhase);
        if (newRoutine) {
            startNewCycle(newRoutine, nextPhase);
        } else {
            setView('error');
        }
    };
    
    const handleExtendCycle = () => {
        extendCurrentCycle();
        hideModal();
    }
    
    const renderContent = () => {
        switch (view) {
            case 'loadingReview':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <LoadingSpinner />
                        <p className="mt-4 text-spartan-text-secondary">Analizando el rendimiento de tu último ciclo...</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <p className="text-red-500 font-bold">Error en el análisis.</p>
                        <p className="text-spartan-text-secondary mt-2">No se pudo generar una recomendación. Inténtalo más tarde.</p>
                         <button onClick={hideModal} className="mt-4 py-2 px-4 bg-spartan-card hover:bg-spartan-border rounded-lg">Cerrar</button>
                    </div>
                );
            case 'generatingPlan':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <LoadingSpinner />
                        <p className="mt-4 text-spartan-text-secondary">Generando tu nuevo plan de {nextPhaseDetails.title}...</p>
                    </div>
                );
            case 'showReview':
                if (!review) return null;

                const decisionContent = review.decision === 'progress' ? (
                     <div className="bg-spartan-surface p-6 rounded-lg text-center">
                        <p className="text-sm text-spartan-text-secondary">PRÓXIMA FASE SUGERIDA</p>
                        <div className="w-16 h-16 bg-spartan-card rounded-full flex items-center justify-center mx-auto my-3 text-spartan-gold">
                            {nextPhaseDetails.icon}
                        </div>
                        <h3 className="text-xl font-bold">{nextPhaseDetails.title}</h3>
                        <p className="text-sm text-spartan-text-secondary mt-1">{nextPhaseDetails.description}</p>
                    </div>
                ) : (
                     <div className="bg-spartan-surface p-6 rounded-lg h-full">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><TargetIcon className="w-5 h-5"/>Puntos de Enfoque para Consolidar:</h3>
                        <ul className="space-y-2 list-disc list-inside">
                            {review.focusPoints.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </div>
                );

                const actionButtons = review.decision === 'progress' ? (
                     <div className="flex justify-end gap-4 mt-8">
                        <button onClick={hideModal} className="py-2 px-6 bg-spartan-surface hover:bg-spartan-border rounded-lg">Decidiré Más Tarde</button>
                        <button onClick={handleGeneratePlan} className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600">Generar Plan de {nextPhaseDetails.title}</button>
                    </div>
                ) : (
                     <div className="flex justify-end mt-8">
                         <button onClick={handleExtendCycle} className="w-full py-3 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600">Entendido, a consolidar</button>
                    </div>
                );

                return (
                     <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-6">
                            <div className="space-y-4">
                                <div className="bg-spartan-card p-4 rounded-lg">
                                    <h3 className="font-bold text-spartan-gold">Análisis del Estratega:</h3>
                                    <p className="text-sm italic">"{review.reasoning}"</p>
                                </div>
                                {decisionContent}
                            </div>
                            <div className="lg:h-[450px]">
                                <DetailedSynergyChart />
                            </div>
                        </div>
                        {actionButtons}
                    </>
                );
        }
    };
    
    return (
        <div className="p-4">
            <div className="text-center mb-6">
                <CycleIcon className="w-16 h-16 mx-auto text-spartan-gold mb-4"/>
                <h2 className="text-3xl font-bold text-spartan-gold">Revisión Cíclica Colaborativa</h2>
            </div>
            {renderContent()}
        </div>
    );
};

export default NewTrainingCycleModal;