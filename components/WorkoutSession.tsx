import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import type { SetProgress } from '../types.ts';
import RestTimer from './RestTimer.tsx';
import CheckIcon from './icons/CheckIcon.tsx';
import BrainIcon from './icons/BrainIcon.tsx';

const WorkoutSession: React.FC = () => {
    const { activeSession, endWorkout, updateSetProgress, showModal } = useAppContext();
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timerKey, setTimerKey] = useState(Date.now().toString());

    if (!activeSession) {
        return (
            <div className="text-center">
                <p>No active session. Start a workout from the routines page.</p>
            </div>
        );
    }

    const { routine, progress } = activeSession;
    const currentBlock = routine.blocks[currentBlockIndex];
    const currentExercise = currentBlock.exercises[currentExerciseIndex];
    const currentProgress = progress[currentBlockIndex][currentExerciseIndex];

    const handleSetChange = (setIndex: number, field: keyof SetProgress, value: any) => {
        updateSetProgress(currentBlockIndex, currentExerciseIndex, setIndex, { [field]: value });
    };

    const handleSetComplete = (setIndex: number, isCompleted: boolean) => {
        const setProgress = currentProgress.sets[setIndex];
        // Only trigger rest timer if completing a non-empty set
        if (isCompleted && setProgress.reps.trim() && setProgress.weight.trim()) {
            setIsResting(true);
            setTimerKey(Date.now().toString());
        }
        updateSetProgress(currentBlockIndex, currentExerciseIndex, setIndex, { completed: isCompleted });
    };

    const advanceToNext = () => {
        setIsResting(false);
        if (currentExerciseIndex < currentBlock.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else if (currentBlockIndex < routine.blocks.length - 1) {
            setCurrentBlockIndex(prev => prev + 1);
            setCurrentExerciseIndex(0);
        } else {
            // Last exercise of last block
            endWorkout();
        }
    };
    
    const allSetsCompleted = currentProgress.sets.every(s => s.completed);

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-spartan-gold">{routine.name}</h1>
                <button
                    onClick={endWorkout}
                    className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors"
                >
                    Finalizar Sesión
                </button>
            </div>
            <p className="text-lg text-spartan-text-secondary mb-8">{currentBlock.name}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-spartan-surface p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">{currentExercise.name}</h2>
                    <p className="text-spartan-text-secondary mb-4">{`Series: ${currentExercise.sets} | Reps: ${currentExercise.reps}`}</p>
                    
                    {currentExercise.coachTip && (
                        <div className="flex items-start gap-2 bg-spartan-card p-3 rounded-md mb-4">
                            <BrainIcon className="w-5 h-5 text-spartan-gold flex-shrink-0 mt-1"/>
                            <p className="text-sm italic">{currentExercise.coachTip}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {currentProgress.sets.map((set, setIndex) => (
                            <div key={setIndex} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${set.completed ? 'bg-green-500/10' : 'bg-spartan-card'}`}>
                                <div className="font-bold text-lg w-8 text-center">{setIndex + 1}</div>
                                <div className="flex-1">
                                    <input 
                                        type="number" 
                                        placeholder="Peso"
                                        value={set.weight}
                                        onChange={(e) => handleSetChange(setIndex, 'weight', e.target.value)}
                                        className="w-full bg-spartan-surface p-2 rounded-md text-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="number" 
                                        placeholder="Reps"
                                        value={set.reps}
                                        onChange={(e) => handleSetChange(setIndex, 'reps', e.target.value)}
                                        className="w-full bg-spartan-surface p-2 rounded-md text-center"
                                    />
                                </div>
                                <button
                                    onClick={() => handleSetComplete(setIndex, !set.completed)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${set.completed ? 'bg-spartan-gold text-spartan-bg' : 'bg-spartan-border hover:bg-spartan-gold/20'}`}
                                >
                                    <CheckIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        ))}
                    </div>

                     <button 
                        onClick={() => showModal('video-feedback', { exerciseName: currentExercise.name })}
                        className="w-full mt-6 text-sm py-2 px-4 border-2 border-dashed border-spartan-border text-spartan-text-secondary hover:bg-spartan-card rounded-lg transition-colors"
                    >
                        Obtener Feedback de Técnica por IA (Video)
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center">
                    {isResting ? (
                        <RestTimer duration={currentExercise.restSeconds || 60} onComplete={advanceToNext} timerKey={timerKey} />
                    ) : (
                        <div className="text-center">
                            <p className="text-lg text-spartan-text-secondary mb-4">
                                {allSetsCompleted ? '¡Ejercicio completado!' : 'Completa todas las series para continuar.'}
                            </p>
                            <button
                                onClick={advanceToNext}
                                disabled={!allSetsCompleted}
                                className="py-3 px-8 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-spartan-border disabled:cursor-not-allowed"
                            >
                                Siguiente Ejercicio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;