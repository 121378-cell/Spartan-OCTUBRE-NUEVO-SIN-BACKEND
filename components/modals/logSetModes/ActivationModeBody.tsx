import React from 'react';
import type { SetProgress } from '../../../types.ts';
import FocusIcon from '../../icons/FocusIcon.tsx';
import CheckIcon from '../../icons/CheckIcon.tsx';
import DistractedIcon from '../../icons/DistractedIcon.tsx';

interface ActivationModeBodyProps {
    quality: SetProgress['quality'];
    setQuality: (value: SetProgress['quality']) => void;
}

const QualityButton: React.FC<{
    label: string;
    value: SetProgress['quality'];
    icon: React.ReactNode;
    currentValue: SetProgress['quality'];
    onClick: (value: SetProgress['quality']) => void;
}> = ({ label, value, icon, currentValue, onClick }) => {
    const isSelected = currentValue === value;
    return (
        <button
            type="button"
            onClick={() => onClick(value)}
            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                isSelected ? 'bg-spartan-gold text-spartan-bg border-spartan-gold' : 'bg-spartan-card border-spartan-border'
            }`}
        >
            {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
};

const ActivationModeBody: React.FC<ActivationModeBodyProps> = ({ quality, setQuality }) => {
    
    return (
        <div className="min-h-[350px] flex flex-col items-center justify-center gap-4">
            <p className="text-lg font-medium text-spartan-text-secondary mb-4">
                Evalúa la calidad y el foco de tu ejecución:
            </p>
            <div className="w-full flex justify-center gap-4">
                <QualityButton
                    label="Máximo Foco"
                    value="max_focus"
                    icon={<FocusIcon />}
                    currentValue={quality}
                    onClick={setQuality}
                />
                <QualityButton
                    label="Aceptable"
                    value="acceptable"
                    icon={<CheckIcon />}
                    currentValue={quality}
                    onClick={setQuality}
                />
                <QualityButton
                    label="Distraído"
                    value="distracted"
                    icon={<DistractedIcon />}
                    currentValue={quality}
                    onClick={setQuality}
                />
            </div>
            <p className="text-xs text-spartan-text-secondary mt-4 text-center">
                Tu feedback informa a la IA para ajustar futuros calentamientos y focos biomecánicos.
            </p>
        </div>
    );
};

export default ActivationModeBody;
