import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition.ts';
import NumberStepper from '../../NumberStepper.tsx';
import RirSelector from '../../RirSelector.tsx';
import MicrophoneIcon from '../../icons/MicrophoneIcon.tsx';
import type { Exercise } from '../../../types.ts';
import TrendingUpIcon from '../../icons/TrendingUpIcon.tsx';

interface StrengthModeBodyProps {
    weight: string;
    setWeight: (value: string) => void;
    reps: string;
    setReps: (value: string) => void;
    rir: number | undefined;
    setRir: (value: number | undefined) => void;
    showRir: boolean;
    onSave: () => void;
    exercise: Exercise;
    isProgressionSuggested: boolean;
}

const StrengthModeBody: React.FC<StrengthModeBodyProps> = ({
    weight, setWeight, reps, setReps, rir, setRir,
    showRir, onSave, exercise, isProgressionSuggested
}) => {
    const [statusMessage, setStatusMessage] = useState('Iniciando...');

    const handleTranscriptReady = useCallback((transcript: string) => {
        if (!transcript) {
            setStatusMessage("No se escuchó nada. Toca el micrófono para reintentar.");
            return;
        }

        setStatusMessage(`Procesando: "${transcript}"`);
        let updated = false;
        
        const weightMatch = transcript.match(/(?:peso |w |weight |pesa |levanta )(\d+(\.\d+)?)/i);
        const repsMatch = transcript.match(/(?:reps? |repeticiones )(\d+)/i);
        const rirMatch = transcript.match(/(?:rir |reserva )(\d+)/i);
        const saveMatch = transcript.match(/(guardar|confirma|listo|hecho)/i);

        if (weightMatch) {
            setWeight(weightMatch[1]);
            updated = true;
        }
        if (repsMatch) {
            setReps(repsMatch[1]);
            updated = true;
        }
        if (rirMatch) {
            setRir(parseInt(rirMatch[1], 10));
            updated = true;
        }

        if (saveMatch) {
            onSave();
        } else if (updated) {
            setStatusMessage("Datos actualizados. Toca Guardar o el micrófono de nuevo.");
        } else {
            setStatusMessage(`Comando no reconocido. Toca el micrófono para reintentar.`);
        }
    }, [onSave, setWeight, setReps, setRir]);

    const handleRecognitionError = useCallback((error: string) => {
        if (error === 'no-speech') {
            setStatusMessage("Toca el micrófono para registrar por voz.");
        } else if (error !== 'aborted') {
            setStatusMessage("Error de reconocimiento. Usa los controles manuales.");
        }
    }, []);

    const { isListening, startListening, isSupported } = useSpeechRecognition(handleTranscriptReady, handleRecognitionError);

    useEffect(() => {
        if (isSupported) {
            startListening();
        } else {
            setStatusMessage('Reconocimiento de voz no compatible.');
        }
    }, [isSupported, startListening]);
    
    useEffect(() => {
        if(isListening) {
            setStatusMessage('Escuchando...');
        }
    }, [isListening]);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-spartan-text-secondary mb-2">
                        <div className="flex items-center gap-2">
                            <span>PESO (kg)</span>
                            {isProgressionSuggested && (
                                <span title="Progresión sugerida" className="flex items-center gap-1 text-green-400">
                                    <TrendingUpIcon className="w-4 h-4" />
                                </span>
                            )}
                        </div>
                    </label>
                    <NumberStepper value={weight} onChange={setWeight} step={2.5} size="large" />
                </div>
                <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-spartan-text-secondary mb-2">
                        REPS <span className="font-normal">(Objetivo: {exercise.reps})</span>
                    </label>
                    <NumberStepper value={reps} onChange={setReps} step={1} size="large" />
                </div>
                {showRir && (
                    <div className="flex flex-col items-center">
                        <label className="block text-sm font-medium text-spartan-text-secondary mb-2">RIR (Repeticiones en Reserva)</label>
                        <RirSelector value={rir} onChange={setRir} size="large" />
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-center text-sm text-spartan-text-secondary italic flex items-center justify-center gap-2">
                 <button
                    type="button"
                    onClick={startListening}
                    disabled={!isSupported || isListening}
                    className="p-1 rounded-full disabled:opacity-50"
                    aria-label="Activar registro por voz"
                 >
                    <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'hover:text-spartan-text'}`} />
                 </button>
                 <span>{statusMessage}</span>
            </div>
        </>
    );
};

export default StrengthModeBody;