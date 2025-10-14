import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import CheckIcon from '../icons/CheckIcon.tsx';

interface WorkoutSummary {
    name: string;
    duration: number;
    volume: number;
}

interface WorkoutSummaryModalProps {
    summary: WorkoutSummary;
}

const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({ summary }) => {
    const { hideModal } = useAppContext();

    return (
        <div className="text-center">
            <div className="w-20 h-20 bg-spartan-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-12 h-12 text-spartan-bg" />
            </div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-2">¡Entrenamiento Completado!</h2>
            <p className="text-spartan-text-secondary mb-6">Buen trabajo, has completado la rutina: <strong>{summary.name}</strong>.</p>

            <div className="grid grid-cols-2 gap-4 text-left bg-spartan-card p-4 rounded-lg">
                <div>
                    <p className="text-sm text-spartan-text-secondary">Duración</p>
                    <p className="text-2xl font-bold">{summary.duration} <span className="text-base font-normal">minutos</span></p>
                </div>
                <div>
                    <p className="text-sm text-spartan-text-secondary">Volumen Total</p>
                    <p className="text-2xl font-bold">{summary.volume.toLocaleString()} <span className="text-base font-normal">kg</span></p>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={hideModal}
                    className="py-2 px-6 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Hecho
                </button>
            </div>
        </div>
    );
};

export default WorkoutSummaryModal;
