


import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import type { SetProgress } from '../types.ts';
import CheckIcon from './icons/CheckIcon.tsx';
import RestTimer from './RestTimer.tsx';
import CooldownProtocol from './CooldownProtocol.tsx';
import TerminalIcon from './icons/TerminalIcon.tsx';
import { useSynergisticLoad } from '../hooks/useSynergisticLoad.ts';
import HologramIcon from './icons/HologramIcon.tsx';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary.ts';
import CogIcon from './icons/CogIcon.tsx';

const WorkoutSession: React.FC = () => {
    const { activeSession, updateSetProgress, endWorkout, showModal, modal, showToast, workoutHistory, dailyLogs } = useAppContext();
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [restDuration, setRestDuration] = useState(0);
    const [timerKey, setTimerKey] = useState(Date.now().toString());
    const [isCooldown, setIsCooldown] = useState(false);
    const [showExertionFlash, setShowExertionFlash] = useState(false);
    const [commandInput, setCommandInput] = useState('');
    const [loggingSetIndex, setLoggingSetIndex] = useState(0);

    const synergisticLoad = useSynergisticLoad(workoutHistory, dailyLogs);

    useEffect(() => {
        if (activeSession) {
            setCurrentBlockIndex(0);
            setCurrentExerciseIndex(0);
            setShowRestTimer(false);
            setIsCooldown(false);
        }
    }, [activeSession]);

    const handleNext = () => {
        setShowRestTimer(false);

        if (currentExerciseIndex < currentBlock.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        }
        else if (currentBlockIndex < routine.blocks.length - 1) {
            setCurrentBlockIndex(prev => prev + 1);
            setCurrentExerciseIndex(0);
        }
        else {
            setIsCooldown(true);
        }
    };
    
    useEffect(() => {
        if (!activeSession || modal.isOpen || showRestTimer) return;

        const { routine, progress } = activeSession;
        const currentBlock = routine.blocks[currentBlockIndex];
        if (!currentBlock) return;
        const currentExerciseProgress = progress[currentBlockIndex]?.[currentExerciseIndex];
        if (!currentExerciseProgress) return;
        
        const allSetsCompleted = currentExerciseProgress.sets.every(s => s.completed);
        
        const isWorkoutFinished = 
            currentBlockIndex >= routine.blocks.length - 1 && 
            currentExerciseIndex >= currentBlock.exercises.length - 1;

        if (allSetsCompleted && !isWorkoutFinished) {
            const timer = setTimeout(() => {
                handleNext();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeSession?.progress, modal.isOpen, showRestTimer, currentBlockIndex, currentExerciseIndex]);


    if (isCooldown) {
        return <CooldownProtocol onComplete={endWorkout} onSkip={endWorkout} />;
    }

    if (!activeSession) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold">No Active Workout</h1>
                <p className="text-spartan-text-secondary">Start a routine from the Routines page.</p>
            </div>
        );
    }

    const { routine, progress } = activeSession;
    const currentBlock = routine.blocks[currentBlockIndex];
    const currentExercise = currentBlock?.exercises[currentExerciseIndex];
    const currentProgress = progress[currentBlockIndex]?.[currentExerciseIndex];

    const handleSetComplete = (setIndex: number) => {
        setLoggingSetIndex(setIndex);
        const rest = currentExercise.restSeconds || 60;
        setRestDuration(rest);
        setShowRestTimer(true);
        setTimerKey(Date.now().toString());
    };

    const handleRestFinished = (setIndex: number) => {
        setShowRestTimer(false);
        showModal('log-set', { 
            blockIndex: currentBlockIndex, 
            exerciseIndex: currentExerciseIndex, 
            setIndex 
        });
    };
    
    const handleReportDiscomfortFromTimer = () => {
        setShowRestTimer(false); // Make sure timer is hidden
        showModal('discomfort-report', { exerciseName: currentExercise.name });
    };

    const handleOpenExerciseOptions = () => {
        showModal('exercise-options', { exerciseName: currentExercise.name });
    };

    const handleCommand = () => {
        if (!commandInput.trim()) return;
        const command = commandInput.trim().toLowerCase();
        const setIndexToUpdate = currentProgress.sets.findIndex(s => !s.completed);

        if (setIndexToUpdate === -1) {
            showToast("Todos los sets están completados.");
            setCommandInput('');
            return;
        }

        const updates: Partial<SetProgress> = {};
        const weightMatch = command.match(/(?:peso |w |weight )(\d+(\.\d+)?)/);
        const repsMatch = command.match(/(?:reps? )(\d+)/);
        const rirMatch = command.match(/(?:rir )(\d+)/);

        if (weightMatch) updates.weight = weightMatch[1];
        if (repsMatch) updates.reps = repsMatch[1];
        if (rirMatch) updates.rir = parseInt(rirMatch[1], 10);
        
        if (Object.keys(updates).length > 0) {
            updateSetProgress(currentBlockIndex, currentExerciseIndex, setIndexToUpdate, updates);
            showToast("Set actualizado por comando.");
        } else {
            showToast("Comando no reconocido. Usa 'peso', 'reps', 'rir'.");
        }
        
        setCommandInput('');
    };

    if (showRestTimer) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <RestTimer 
                    duration={restDuration} 
                    onComplete={() => handleRestFinished(loggingSetIndex)}
                    timerKey={timerKey}
                    synergisticLoadScore={synergisticLoad.score}
                    onReportDiscomfort={handleReportDiscomfortFromTimer}
                />
            </div>
        );
    }

    if (!currentExercise || !currentProgress) {
        endWorkout();
        return null;
    }
    
    const allSetsCompleted = currentProgress.sets.every(s => s.completed);
    
    const isWorkoutFinished = 
        currentBlockIndex >= routine.blocks.length -1 && 
        currentExerciseIndex >= routine.blocks[routine.blocks.length - 1].exercises.length - 1 &&
        allSetsCompleted;

    return (
        <div className={`relative animate-fadeIn max-w-4xl mx-auto p-8 ${showExertionFlash ? 'high-exertion-flash' : ''}`}>
            <header className="mb-4 text-center">
                <p className="text-sm uppercase text-spartan-text-secondary">{currentBlock.name}</p>
                <h1 className="text-4xl font-bold text-spartan-gold">{currentExercise.name}</h1>
                <p className="text-lg font-mono">{currentExercise.sets} x {currentExercise.reps} reps</p>
                <div className="flex justify-center gap-4 mt-3">
                    <button
                        onClick={() => showModal('exercise-detail', { exerciseId: EXERCISE_LIBRARY.find(ex => ex.name.toLowerCase() === currentExercise.name.toLowerCase())?.id }, { size: 'xl' })}
                        className="flex items-center gap-2 bg-spartan-surface px-3 py-1 rounded-full text-sm hover:bg-spartan-border transition-colors"
                        aria-label="Ver holograma 3D del ejercicio"
                    >
                        <HologramIcon className="w-5 h-5 text-spartan-gold" />
                        Holograma 3D
                    </button>
                    <button
                        onClick={handleOpenExerciseOptions}
                        className="flex items-center gap-2 bg-spartan-surface px-3 py-1 rounded-full text-sm hover:bg-spartan-border transition-colors"
                        aria-label="Más opciones para este ejercicio"
                    >
                        <CogIcon className="w-5 h-5"/>
                        Opciones
                    </button>
                </div>
                {currentExercise.coachTip && (
                    <div className="mt-4 p-4 bg-spartan-gold/10 border-l-4 border-spartan-gold">
                        <p className="text-md italic text-spartan-text">"{currentExercise.coachTip}"</p>
                    </div>
                )}
            </header>

            <div className="space-y-4">
                {currentProgress.sets.map((set, setIndex) => (
                    <div key={setIndex} className={`p-4 rounded-lg flex items-center gap-4 transition-all ${set.completed ? 'bg-spartan-gold/10' : 'bg-spartan-card'}`}>
                        <div className="w-10 h-10 bg-spartan-surface rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                            {setIndex + 1}
                        </div>
                        
                        <div className="flex-1">
                            {set.completed ? (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm">
                                    <span>PESO: {set.weight} kg</span>
                                    <span>REPS: {set.reps}</span>
                                    {set.rir !== undefined && <span>RIR: {set.rir}</span>}
                                </div>
                            ) : (
                                <p className="text-spartan-text-secondary italic">Pendiente de completar...</p>
                            )}
                        </div>

                        <button
                            onClick={() => handleSetComplete(setIndex)}
                            disabled={set.completed || showRestTimer}
                            className={`p-4 rounded-full transition-colors ${set.completed ? 'bg-spartan-gold text-spartan-bg' : 'bg-spartan-surface hover:bg-spartan-gold/30 disabled:bg-spartan-border disabled:cursor-not-allowed'}`}
                            aria-label={`Completar set ${setIndex + 1}`}
                        >
                            <CheckIcon className="w-6 h-6" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center pb-24">
                 {isWorkoutFinished ? (
                    <button
                        onClick={() => setIsCooldown(true)}
                        className="bg-spartan-gold text-spartan-bg font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-500 transition-colors"
                    >
                        Finalizar Entrenamiento
                    </button>
                 ) : allSetsCompleted ? (
                    <p className="text-spartan-text-secondary italic animate-pulse">Preparando siguiente ejercicio...</p>
                 ) : null}
            </div>
            
             <div className="fixed bottom-0 left-0 right-0 bg-spartan-surface/90 backdrop-blur-sm p-3 border-t border-spartan-border z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <TerminalIcon className="w-6 h-6 text-spartan-gold flex-shrink-0" />
                        <input 
                            type="text"
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
                            placeholder="Modo Comando: ej. peso 50 reps 10 rir 2"
                            className="flex-1 bg-spartan-card border border-spartan-border rounded-lg p-2 focus:ring-2 focus:ring-spartan-gold focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSession;