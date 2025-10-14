
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import WorkoutCard from './WorkoutCard.tsx';
import PlayIcon from './icons/PlayIcon.tsx';
import { getMotivationalQuote, getDailyBriefing } from '../services/aiService.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import SparklesIcon from './icons/SparklesIcon.tsx';
import { useBurnoutPrediction } from '../hooks/useBurnoutPrediction.ts';
import PropheticAlert from './PropheticAlert.tsx';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-spartan-card p-6 rounded-lg shadow-md flex items-center transform hover:scale-105 transition-transform duration-300">
    <div className="p-3 bg-spartan-gold rounded-full mr-4 text-spartan-bg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-spartan-text-secondary uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

type Readiness = 'Energized' | 'Normal' | 'Fatigued';

const Dashboard: React.FC = () => {
  const { userProfile, routines, activeSession, setCurrentPage, dailyLogs, habitLogs, showModal } = useAppContext();
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  const { isSignatureDetected, reason } = useBurnoutPrediction(
      dailyLogs, 
      habitLogs, 
      userProfile.keystoneHabits
  );

  const nextWorkout = routines.length > 0 ? routines[0] : null;

  useEffect(() => {
    const fetchQuote = async () => {
      const result = await getMotivationalQuote();
      setQuote(result);
    };
    fetchQuote();
  }, []);

  useEffect(() => {
    const fetchBriefing = async () => {
      if (readiness) {
        setIsBriefingLoading(true);
        setBriefing(null);
        const result = await getDailyBriefing(readiness, userProfile);
        setBriefing(result);
        setIsBriefingLoading(false);
      }
    };
    fetchBriefing();
  }, [readiness, userProfile]);

  return (
    <div className="animate-fadeIn">
      {isSignatureDetected && reason && (
          <PropheticAlert 
              reason={reason} 
              onAcknowledge={() => showModal('prophetic-intervention')} 
          />
      )}
      <h1 className="text-4xl font-bold mb-2 text-spartan-gold">Bienvenido de nuevo, {userProfile.name.split(' ')[0]}</h1>
      <p className="text-lg text-spartan-text-secondary mb-8">¿Listo para conquistar el día? Aquí está tu progreso.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Entrenamientos Totales" value={userProfile.stats.totalWorkouts.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard title="Racha Actual" value={`${userProfile.stats.currentStreak} Días`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A5 5 0 0014.142 11.858" /></svg>} />
        <StatCard title="Miembro desde" value={userProfile.stats.joinDate} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-spartan-card p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Briefing Diario</h2>
                {!readiness && (
                    <div>
                        <p className="text-spartan-text-secondary mb-4">¿Cómo te sientes hoy?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setReadiness('Energized')} className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors">Con energía</button>
                            <button onClick={() => setReadiness('Normal')} className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">Normal</button>
                            <button onClick={() => setReadiness('Fatigued')} className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-colors">Fatigado</button>
                        </div>
                    </div>
                )}
                {isBriefingLoading && <div className="flex justify-center items-center p-4"><LoadingSpinner /></div>}
                {briefing && (
                    <div className="flex items-start gap-3 animate-fadeIn">
                         <SparklesIcon className="w-6 h-6 text-spartan-gold flex-shrink-0 mt-1"/>
                         <p className="text-lg italic">{briefing}</p>
                    </div>
                )}
            </div>
            
            {activeSession ? (
                <div className="bg-spartan-card p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold">{activeSession.routine.name}</h3>
                    <p className="text-spartan-text-secondary mb-4">Sesión en progreso...</p>
                    <button 
                        onClick={() => setCurrentPage('session')}
                        className="flex items-center gap-2 bg-spartan-gold text-spartan-bg font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        <PlayIcon className="w-5 h-5"/>
                        Continuar Entrenamiento
                    </button>
                </div>
            ) : nextWorkout ? (
                <WorkoutCard routine={nextWorkout} />
            ) : (
                <div className="bg-spartan-card p-6 rounded-lg shadow-md text-center">
                    <p className="text-spartan-text-secondary">No se encontraron rutinas. ¡Usa el Entrenador IA para crear una!</p>
                </div>
            )}
        </div>

        <div className="bg-spartan-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-spartan-gold">Cita del Día</h2>
          <blockquote className="border-l-4 border-spartan-gold pl-4 italic">
            {quote ? (
                <>
                    <p className="text-lg">"{quote.quote}"</p>
                    <cite className="block text-right mt-2 text-spartan-text-secondary">- {quote.author}</cite>
                </>
            ) : (
                 <p className="text-spartan-text-secondary">Buscando inspiración...</p>
            )}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
