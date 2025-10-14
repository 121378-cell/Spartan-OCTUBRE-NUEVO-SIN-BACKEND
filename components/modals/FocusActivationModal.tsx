import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import PlayIcon from '../icons/PlayIcon.tsx';
import StopCircleIcon from '../icons/StopCircleIcon.tsx';

const DEEP_WORK_SECONDS = 45 * 60;

const FocusActivationModal: React.FC = () => {
    const { hideModal } = useAppContext();
    const [step, setStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DEEP_WORK_SECONDS);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number | null = null;
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (!isActive && timeLeft !== 0) {
            if (interval) clearInterval(interval);
        } else if (timeLeft === 0) {
             if (interval) clearInterval(interval);
             setIsActive(false);
             // Optionally play a sound
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderStepContent = () => {
        switch (step) {
            case 0: // Stretching
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Paso 1: Estiramiento Breve (2 min)</h3>
                        <div className="text-spartan-text-secondary space-y-2">
                            <p>1. <strong>Círculos de Cuello:</strong> 3 lentos en cada dirección.</p>
                            <p>2. <strong>Círculos de Hombros:</strong> 5 hacia atrás, 5 hacia adelante.</p>
                            <p>3. <strong>Giro de Torso:</strong> Sentado, gira suavemente hacia cada lado.</p>
                            <p>4. <strong>Estiramiento de Muñecas:</strong> Extiende los brazos y flexiona las muñecas.</p>
                        </div>
                    </div>
                );
            case 1: // Meditation
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Paso 2: Meditación de Foco (3 min)</h3>
                        <div className="text-spartan-text-secondary space-y-2">
                            <p>1. Cierra los ojos y realiza 3 respiraciones profundas y lentas.</p>
                            <p>2. Elige un objeto para tu concentración: puede ser tu respiración, un punto en la pared o una tarea específica.</p>
                            <p>3. Mantén tu atención en ese objeto. Si tu mente divaga, reconócelo sin juzgar y suavemente tráela de vuelta.</p>
                            <p>4. Continúa durante 3 minutos. Esto prepara tu cerebro para la concentración sostenida.</p>
                        </div>
                    </div>
                );
            case 2: // Deep Work Timer
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Paso 3: Bloque de Trabajo Profundo</h3>
                        <p className="text-8xl font-mono my-6">{formatTime(timeLeft)}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsActive(!isActive)} className="p-4 bg-spartan-card rounded-full hover:bg-spartan-border">
                                {isActive ? <StopCircleIcon className="w-8 h-8 text-red-500"/> : <PlayIcon className="w-8 h-8 text-spartan-gold"/>}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-4">Protocolo de Activación de Foco</h2>
            
            <div className="bg-spartan-card p-6 rounded-lg min-h-[250px] flex flex-col justify-center">
                {renderStepContent()}
            </div>

            <div className="flex justify-between items-center mt-8">
                {step < 2 ? (
                     <button onClick={() => setStep(s => s + 1)} className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600">
                        Siguiente
                     </button>
                ) : <div />}
                <button onClick={hideModal} className="py-2 px-4 bg-spartan-surface hover:bg-spartan-border rounded-lg">
                    {step === 2 ? 'Finalizar Sesión' : 'Cancelar'}
                </button>
            </div>
        </div>
    );
};

export default FocusActivationModal;