import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import type { EvaluationFormData, Routine } from '../../types.ts';
import { generateInitialPlan } from '../../services/aiService.ts';
import LoadingSpinner from '../LoadingSpinner.tsx';

type ModalState = 'collecting_data' | 'loading_plan' | 'previewing_plan' | 'error';

const OnboardingModal: React.FC = () => {
    const { completeOnboarding } = useAppContext();
    const [step, setStep] = useState(0);
    const [modalState, setModalState] = useState<ModalState>('collecting_data');
    const [userName, setUserName] = useState('');
    const [generatedRoutine, setGeneratedRoutine] = useState<Omit<Routine, 'id'> | null>(null);

    const [formData, setFormData] = useState<EvaluationFormData>({
        physicalGoals: '',
        mentalGoals: '',
        experienceLevel: 'beginner',
        energyLevel: 5,
        stressLevel: 5,
        focusLevel: 5,
        equipment: '',
        daysPerWeek: 3,
        timePerSession: 60,
        history: '',
        lifestyle: '',
        painPoint: '',
        communicationTone: 'analytical',
    });

    const totalSteps = 4; // 1 for name + 3 for evaluation dimensions

    const handleNext = async () => {
        if (step === totalSteps - 1) {
            setModalState('loading_plan');
            const routine = await generateInitialPlan(formData, userName);
            if (routine) {
                setGeneratedRoutine(routine);
                setModalState('previewing_plan');
            } else {
                setModalState('error');
            }
        } else {
            setStep(prev => Math.min(prev + 1, totalSteps - 1));
        }
    };
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSliderChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleAcceptPlan = () => {
        if (generatedRoutine) {
            completeOnboarding(userName, formData, generatedRoutine);
        }
    };
    
    const isNextDisabled = () => {
        switch (step) {
            case 0:
                return !userName.trim();
            case 1:
                return !formData.physicalGoals.trim() || !formData.equipment.trim() || !formData.history.trim();
            case 2:
                return !formData.mentalGoals.trim() || !formData.painPoint.trim();
            case 3:
                return !formData.lifestyle.trim();
            default:
                return false;
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-center">Bienvenido a Spartan</h3>
                        <p className="text-spartan-text-secondary mb-6 text-center">Empecemos tu viaje. ¿Cómo te llamas?</p>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g., Leonidas" className="w-full bg-spartan-card p-3 rounded-md border border-spartan-border focus:ring-2 focus:ring-spartan-gold focus:outline-none text-center text-lg"/>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Dimensión Física</h3>
                        <div className="space-y-4">
                            <textarea name="physicalGoals" value={formData.physicalGoals} onChange={handleChange} rows={2} placeholder="Metas Físicas (ej: composición corporal, fuerza, resistencia)" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none">
                                <option value="beginner">Nivel: Principiante</option>
                                <option value="intermediate">Nivel: Intermedio</option>
                                <option value="advanced">Nivel: Avanzado</option>
                            </select>
                            <textarea name="equipment" value={formData.equipment} onChange={handleChange} rows={2} placeholder="¿Con qué equipamiento cuentas?" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-spartan-text-secondary mb-1">Días por semana</label>
                                    <input type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange} min="1" max="7" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-spartan-text-secondary mb-1">Minutos por sesión</label>
                                    <input type="number" name="timePerSession" value={formData.timePerSession} onChange={handleChange} min="10" step="5" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                                </div>
                            </div>
                            <textarea name="history" value={formData.history} onChange={handleChange} rows={2} placeholder="¿Tienes alguna lesión crónica, condición médica o limitación relevante?" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Dimensión Mental</h3>
                        <div className="space-y-4">
                            <textarea name="mentalGoals" value={formData.mentalGoals} onChange={handleChange} rows={2} placeholder="Metas Mentales (ej: nivel de enfoque, gestión del estrés, autoconfianza)" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                             <div>
                                <label className="block text-sm font-medium text-spartan-text-secondary">Nivel de Estrés: {formData.stressLevel}/10</label>
                                <input type="range" min="1" max="10" name="stressLevel" value={formData.stressLevel} onChange={(e) => handleSliderChange('stressLevel', e.target.value)} className="w-full h-2 bg-spartan-border rounded-lg appearance-none cursor-pointer accent-spartan-gold" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-spartan-text-secondary">Nivel de Enfoque: {formData.focusLevel}/10</label>
                                <input type="range" min="1" max="10" name="focusLevel" value={formData.focusLevel} onChange={(e) => handleSliderChange('focusLevel', e.target.value)} className="w-full h-2 bg-spartan-border rounded-lg appearance-none cursor-pointer accent-spartan-gold" />
                            </div>
                            <textarea name="painPoint" value={formData.painPoint} onChange={handleChange} rows={2} placeholder="¿Qué te ha frenado en el pasado o cuál es tu principal 'piedra en el zapato'?" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                             <div>
                                <label className="block text-sm font-medium text-spartan-text-secondary mb-1">Tono de IA preferido</label>
                                <select name="communicationTone" value={formData.communicationTone} onChange={handleChange} className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none">
                                    <option value="motivator">Motivador/Energético</option>
                                    <option value="analytical">Empático/Analítico</option>
                                    <option value="technical">Directo/Técnico</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
             case 3:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Dimensión de Estilo de Vida</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-spartan-text-secondary">Nivel de Energía General: {formData.energyLevel}/10</label>
                                <input type="range" min="1" max="10" name="energyLevel" value={formData.energyLevel} onChange={(e) => handleSliderChange('energyLevel', e.target.value)} className="w-full h-2 bg-spartan-border rounded-lg appearance-none cursor-pointer accent-spartan-gold" />
                            </div>
                            <textarea name="lifestyle" value={formData.lifestyle} onChange={handleChange} rows={4} placeholder="¿Cómo son tu higiene del sueño y tus patrones alimenticios (ej: consumo de proteína, hidratación)? ¿Qué haces actualmente para manejar el estrés?" className="w-full bg-spartan-card p-2 rounded-md border border-spartan-border focus:ring-spartan-gold focus:outline-none"/>
                             <p className="text-xs text-spartan-text-secondary mt-2">Descargo de responsabilidad: Consulta siempre a un profesional médico. Este plan es una sugerencia, no una prescripción médica.</p>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    const progress = (step / (totalSteps -1)) * 100;

    const renderContent = () => {
        switch(modalState) {
            case 'collecting_data':
                return (
                    <>
                        <div className="w-full bg-spartan-border rounded-full h-2 mb-6">
                            <div className="bg-spartan-gold h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                        </div>

                        <div className="min-h-[420px]">{renderStep()}</div>

                        <div className="flex justify-between items-center mt-8">
                            <button onClick={handlePrev} disabled={step === 0} className="py-2 px-4 bg-spartan-card hover:bg-spartan-border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                            <button onClick={handleNext} disabled={isNextDisabled()} className="py-2 px-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-spartan-border">
                                {step < totalSteps - 1 ? 'Siguiente' : 'Generar Plan'}
                            </button>
                        </div>
                    </>
                );
            case 'loading_plan':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <LoadingSpinner />
                        <p className="mt-4 text-lg text-spartan-text-secondary">SynergyCoach está diseñando tu plan personalizado...</p>
                    </div>
                );
            case 'previewing_plan':
                if (!generatedRoutine) return null;
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-center">¡Tu Plan Inicial está Listo!</h3>
                        <div className="bg-spartan-card p-4 rounded-lg my-4">
                            <h4 className="text-lg font-bold text-spartan-gold">{generatedRoutine.name}</h4>
                            <p className="text-sm uppercase text-spartan-text-secondary mb-3">{generatedRoutine.focus} • {generatedRoutine.duration} MINS</p>
                            <p className="text-sm italic text-spartan-text-secondary mb-3">"{generatedRoutine.objective}"</p>
                            <p className="text-sm font-bold text-spartan-text-secondary uppercase tracking-wider">Ejercicios Clave:</p>
                            <ul className="pl-2 mt-1 space-y-1 border-l-2 border-spartan-border text-sm">
                                {generatedRoutine.blocks.flatMap(b => b.exercises).slice(0, 4).map((ex, i) => <li key={i} className="pl-2">{ex.name}</li>)}
                            </ul>
                        </div>
                        <button onClick={handleAcceptPlan} className="w-full py-3 mt-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors">Aceptar y Empezar Viaje</button>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <p className="text-red-500 font-bold">Error al generar el plan.</p>
                        <p className="text-spartan-text-secondary mt-2">Hubo un problema con la IA. Por favor, inténtalo de nuevo.</p>
                        <button onClick={() => setModalState('collecting_data')} className="mt-4 py-2 px-4 bg-spartan-card hover:bg-spartan-border rounded-lg transition-colors">Reintentar</button>
                    </div>
                );

        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-2">Protocolo de Incorporación</h2>
            {renderContent()}
        </div>
    );
};

// Renaming the export to match the new file name convention for clarity
export default OnboardingModal;