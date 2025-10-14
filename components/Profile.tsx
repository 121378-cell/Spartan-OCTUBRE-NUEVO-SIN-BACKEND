import React, { useMemo } from 'react';
// Fix: Correct import paths for AppContext and types
import { useAppContext } from '../context/AppContext.tsx';
import PencilIcon from './icons/PencilIcon.tsx';
import ShieldIcon from './icons/ShieldIcon.tsx';
import type { Trial } from '../types.ts';

const TrialCard: React.FC<{ trial: Trial; currentProgress: number }> = ({ trial, currentProgress }) => {
    const percentage = Math.min((currentProgress / trial.target) * 100, 100);
    const isCompleted = currentProgress >= trial.target;

    return (
        <div className={`p-4 rounded-lg flex flex-col gap-2 ${isCompleted ? 'bg-spartan-gold/20' : 'bg-spartan-card'}`}>
            <div>
                <h4 className="font-bold text-lg text-spartan-gold">{trial.title}</h4>
                <p className="text-sm text-spartan-text-secondary">{trial.description}</p>
            </div>
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold">{isCompleted ? '¡Completado!' : `${Math.floor(currentProgress).toLocaleString()} / ${trial.target.toLocaleString()} ${trial.unit}`}</span>
                    <span className="text-sm font-bold text-spartan-gold">{Math.floor(percentage)}%</span>
                </div>
                 <div className="w-full bg-spartan-surface rounded-full h-2.5">
                    <div className="bg-spartan-gold h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};


const Profile: React.FC = () => {
  const { userProfile, showModal, workoutHistory } = useAppContext();

  const trialProgress = useMemo(() => {
    const progress: { [key: string]: number } = {};
    if (!userProfile.trials) return progress;

    const totalWeightLifted = workoutHistory.reduce((sum, entry) => sum + (entry.totalWeightLifted || 0), 0);

    userProfile.trials.forEach(trial => {
        switch(trial.unit) {
            case 'kg':
                progress[trial.id] = totalWeightLifted;
                break;
            case 'workouts':
                progress[trial.id] = userProfile.stats.totalWorkouts;
                break;
            case 'days':
                 progress[trial.id] = userProfile.stats.currentStreak;
                 break;
            default:
                progress[trial.id] = 0;
        }
    });
    return progress;
  }, [userProfile, workoutHistory]);

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-spartan-gold">La Armería</h1>
        <button 
            onClick={() => showModal('edit-profile')}
            className="flex items-center gap-2 bg-spartan-card hover:bg-spartan-border font-bold py-2 px-4 rounded-lg transition-colors">
            <PencilIcon className="w-4 h-4" />
            Editar Perfil
        </button>
      </div>

      <div className="bg-spartan-surface p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Shield Display */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold text-spartan-gold mb-4 text-center">Escudo de Disciplina</h3>
                <ShieldIcon 
                    workouts={userProfile.stats.totalWorkouts} 
                    streak={userProfile.stats.currentStreak} 
                />
                 <div className="text-center mt-4">
                    <p className="text-lg font-bold">{userProfile.name}</p>
                    <p className="text-sm text-spartan-text-secondary">{userProfile.email}</p>
                </div>
            </div>

            {/* Stats and Goals */}
            <div className="lg:col-span-2 space-y-8">
                {userProfile.quest && (
                     <div>
                        <h3 className="text-xl font-semibold text-spartan-gold mb-4">Tu Gesta</h3>
                        <blockquote className="border-l-4 border-spartan-gold pl-4 italic text-lg">
                           "{userProfile.quest}"
                        </blockquote>
                    </div>
                )}
                 <div>
                    <h3 className="text-xl font-semibold text-spartan-gold mb-4">Estadísticas</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-spartan-card p-4 rounded-lg text-center">
                            <p className="text-sm text-spartan-text-secondary">Entrenos Totales</p>
                            <p className="text-3xl font-bold">{userProfile.stats.totalWorkouts}</p>
                        </div>
                        <div className="bg-spartan-card p-4 rounded-lg text-center">
                            <p className="text-sm text-spartan-text-secondary">Racha Actual</p>
                            <p className="text-3xl font-bold">{userProfile.stats.currentStreak} Días</p>
                        </div>
                        <div className="bg-spartan-card p-4 rounded-lg text-center">
                            <p className="text-sm text-spartan-text-secondary">Miembro Desde</p>
                            <p className="text-3xl font-bold">{userProfile.stats.joinDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
       <div className="bg-spartan-surface p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-spartan-gold mb-4">Juicios Heroicos</h2>
            <p className="text-spartan-text-secondary mb-6">Trabajos legendarios para poner a prueba tu fuerza y resolución.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.trials && userProfile.trials.map(trial => (
                    <TrialCard key={trial.id} trial={trial} currentProgress={trialProgress[trial.id] || 0} />
                ))}
            </div>
        </div>

    </div>
  );
};

export default Profile;
