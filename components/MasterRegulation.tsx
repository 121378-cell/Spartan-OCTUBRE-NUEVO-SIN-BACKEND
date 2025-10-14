
import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import CogIcon from './icons/CogIcon.tsx';
import MoonIcon from './icons/MoonIcon.tsx';
import LungsIcon from './icons/LungsIcon.tsx';
import SunIcon from './icons/SunIcon.tsx';
import NeuroIcon from './icons/NeuroIcon.tsx';
import NeuroActivationCard from './NeuroActivationCard.tsx';

const ProtocolCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onAction?: () => void; actionLabel?: string }> = ({ title, description, icon, onAction, actionLabel }) => (
    <div className="bg-spartan-card p-6 rounded-lg shadow-md flex flex-col">
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-spartan-surface rounded-full flex items-center justify-center text-spartan-gold">
                {icon}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-spartan-text-secondary flex-grow">{description}</p>
        {onAction && actionLabel && (
            <button
                onClick={onAction}
                className="w-full mt-4 text-sm py-2 px-4 border-2 border-dashed border-spartan-border text-spartan-text-secondary hover:bg-spartan-surface rounded-lg transition-colors"
            >
                {actionLabel}
            </button>
        )}
    </div>
);


const MasterRegulation: React.FC = () => {
    const { showModal, userProfile } = useAppContext();

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-4xl font-bold text-spartan-gold">Regulación Maestra</h1>
                <button
                    onClick={() => showModal('master-regulation-settings')}
                    className="flex items-center gap-2 bg-spartan-card text-spartan-text hover:bg-spartan-border font-bold py-2 px-4 rounded-lg transition-colors"
                    title="Ajustes de Regulación Maestra"
                >
                    <CogIcon className="w-5 h-5" />
                    Ajustes
                </button>
            </div>
            <p className="text-lg text-spartan-text-secondary mb-8">
                Domina tu sistema nervioso para desbloquear la recuperación de élite y un rendimiento constante.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <div className="bg-spartan-surface p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Protocolos de Regulación</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProtocolCard
                                title="Protocolo Pre-Sueño"
                                description="Una secuencia de 15 minutos de apagado para maximizar la calidad del sueño. Incluye cero pantallas, estiramiento ligero y respiración diafragmática."
                                icon={<MoonIcon className="w-6 h-6"/>}
                                onAction={() => alert("Iniciando Protocolo Pre-Sueño...")}
                                actionLabel="Iniciar Guía de Protocolo"
                            />
                             <ProtocolCard
                                title="Protocolo de Despertar"
                                description="Una rutina de 10 minutos para calibrar tu ritmo circadiano. Incluye exposición a la luz solar, hidratación y movimiento ligero."
                                icon={<SunIcon className="w-6 h-6"/>}
                                onAction={() => alert("Iniciando Protocolo de Despertar...")}
                                actionLabel="Iniciar Guía de Protocolo"
                            />
                             <ProtocolCard
                                title="Respiración de Coherencia"
                                description="Una técnica de 5 minutos para reducir el estrés agudo y mejorar el enfoque. Ideal antes de reuniones importantes o después de un día intenso."
                                icon={<LungsIcon className="w-6 h-6"/>}
                                onAction={() => alert("Iniciando Respiración de Coherencia...")}
                                actionLabel="Iniciar Sesión Guiada"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-spartan-surface p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Tu Cronotipo</h2>
                        <p className="text-spartan-text-secondary mb-4">
                            Entender tu reloj biológico interno es clave para alinear tus entrenamientos y tu recuperación.
                        </p>
                        <button
                            onClick={() => showModal('chronotype-questionnaire')}
                            className="w-full flex items-center justify-center gap-2 bg-spartan-card hover:bg-spartan-border font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                             <NeuroIcon className="w-6 h-6 text-spartan-gold" />
                             Descubre tu Cronotipo
                        </button>
                    </div>
                    <NeuroActivationCard />
                </div>
            </div>
        </div>
    );
};

export default MasterRegulation;
