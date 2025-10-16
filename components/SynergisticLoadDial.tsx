import React from 'react';

interface SynergisticLoadDialProps {
  score: number;
}

const SynergisticLoadDial: React.FC<SynergisticLoadDialProps> = ({ score }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let colorClass = 'text-red-500'; // 0-49: Riesgo/Priorizar Recuperación
    if (score >= 80) {
        colorClass = 'text-green-500'; // 80-100: Máximo Rendimiento
    } else if (score >= 50) {
        colorClass = 'text-yellow-500'; // 50-79: Precaución/Moderar
    }

    return (
        <div className="relative w-52 h-52">
            <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                    className="text-spartan-surface"
                    strokeWidth="15"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                />
                <circle
                    className={colorClass}
                    strokeWidth="15"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    transform="rotate(-90 100 100)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold ${colorClass}`}>{score}</span>
                <span className="text-sm text-spartan-text-secondary uppercase tracking-widest">Carga</span>
            </div>
        </div>
    );
};

export default SynergisticLoadDial;