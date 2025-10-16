import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary.ts';
import FocusIcon from '../icons/FocusIcon.tsx';
import ShieldIcon from '../icons/ShieldIcon.tsx'; // Using as a placeholder for safety/injury icon
import HologramViewer from '../HologramViewer.tsx';

const ExerciseDetailModal: React.FC = () => {
    const { hideModal, modal } = useAppContext();
    const { exerciseId, exerciseName, openWithDeviation } = modal.payload || {};

    const exercise = exerciseId 
        ? EXERCISE_LIBRARY.find(ex => ex.id === exerciseId)
        : EXERCISE_LIBRARY.find(ex => ex.name.toLowerCase() === exerciseName?.toLowerCase());

    const [animationType, setAnimationType] = useState<'ideal' | 'deviation'>(
        openWithDeviation && exercise?.deviation ? 'deviation' : 'ideal'
    );

    if (!exercise) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-spartan-gold mb-4">Ejercicio no Encontrado</h2>
                <p className="text-spartan-text-secondary">No se pudo encontrar la información para este ejercicio.</p>
                 <div className="flex justify-end mt-8">
                    <button onClick={hideModal} className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600">Cerrar</button>
                </div>
            </div>
        );
    }
    
    const hasModifications = Object.keys(exercise.injuryModifications).length > 0;
    const targetMuscle = exercise.muscleGroups.length > 0 ? exercise.muscleGroups[0] : undefined;

    return (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
            <h2 className="text-3xl font-bold text-spartan-gold mb-2">{exercise.name}</h2>
            <p className="text-md uppercase text-spartan-text-secondary mb-4">{exercise.muscleGroups.join(' • ')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <div className="flex justify-center mb-2">
                        <div className="bg-spartan-card p-1 rounded-lg flex gap-1 text-sm">
                            <button 
                                onClick={() => setAnimationType('ideal')} 
                                className={`px-3 py-1 rounded-md transition-colors ${animationType === 'ideal' ? 'bg-spartan-gold text-spartan-bg' : 'hover:bg-spartan-surface'}`}
                            >
                                Ejecución Ideal
                            </button>
                            {exercise.deviation && (
                            <button 
                                onClick={() => setAnimationType('deviation')}
                                className={`px-3 py-1 rounded-md transition-colors ${animationType === 'deviation' ? 'bg-spartan-gold text-spartan-bg' : 'hover:bg-spartan-surface'}`}
                            >
                                Desvío Común
                            </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-spartan-bg rounded-lg h-96">
                        <HologramViewer 
                            modelUrl="/assets/hologram_model_with_deviations.glb" 
                            targetMuscle={targetMuscle}
                            animationType={animationType}
                            deviationPart={exercise.deviation?.highlightPart}
                            suggestedView={exercise.suggestedView}
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Biomechanics Focus */}
                    <div className="bg-spartan-gold/10 border-l-4 border-spartan-gold p-4 rounded-md">
                        <div className="flex items-start gap-3">
                            <FocusIcon className="w-6 h-6 text-spartan-gold flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-bold text-spartan-gold text-lg">Foco Biomecánico</h4>
                                <p className="text-md italic text-spartan-text">{exercise.biomechanicsFocus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-xl font-bold mb-2">Instrucciones</h3>
                        <ol className="list-decimal list-inside space-y-1 text-spartan-text-secondary bg-spartan-card p-4 rounded-lg">
                            {exercise.instructions.map((step, index) => <li key={index}>{step}</li>)}
                        </ol>
                    </div>

                    {/* Injury Modifications */}
                    {hasModifications && (
                        <div>
                            <h3 className="text-xl font-bold mb-2">Modificaciones y Seguridad</h3>
                            <div className="bg-spartan-card p-4 rounded-lg space-y-3">
                                {Object.entries(exercise.injuryModifications).map(([key, mod]) => (
                                    <div key={key} className="flex items-start gap-3">
                                        <ShieldIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1"/>
                                        <div>
                                            <p><span className="font-semibold text-yellow-500">Alternativa:</span> {mod.modification}</p>
                                            <p className="text-sm text-spartan-text-secondary">{mod.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="flex justify-end mt-8 sticky bottom-0 bg-spartan-surface py-2">
                <button
                    onClick={hideModal}
                    className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default ExerciseDetailModal;