import React from 'react';
// Fix: Correct import path for types
import type { Routine } from '../types.ts';
// Fix: Correct import path for AppContext
import { useAppContext } from '../context/AppContext.tsx';
import PlayIcon from './icons/PlayIcon.tsx';
import DumbbellIcon from './icons/DumbbellIcon.tsx';

interface WorkoutCardProps {
  routine: Routine;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ routine }) => {
  const { startWorkout } = useAppContext();
  const allExercises = routine.blocks.flatMap(block => block.exercises);

  return (
    <div className="bg-spartan-card p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 flex flex-col md:flex-row items-center gap-6">
      <div className="p-4 bg-spartan-surface rounded-full">
        <DumbbellIcon className="w-8 h-8 text-spartan-gold" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold">{routine.name}</h3>
        <p className="text-sm uppercase text-spartan-text-secondary">{routine.focus} • {routine.duration} MINS</p>
        <p className="text-sm text-spartan-text-secondary mt-1 hidden md:block">
            {allExercises.slice(0, 3).map(e => e.name).join(', ')}{allExercises.length > 3 ? '...' : ''}
        </p>
      </div>
      <button 
        onClick={() => startWorkout(routine)}
        className="flex items-center justify-center gap-2 bg-spartan-gold text-spartan-bg font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors w-full md:w-auto"
      >
        <PlayIcon className="w-5 h-5"/>
        Empezar Entrenamiento
      </button>
    </div>
  );
};

export default WorkoutCard;
