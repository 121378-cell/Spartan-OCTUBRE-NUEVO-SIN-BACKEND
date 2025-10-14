import React from 'react';
// Fix: Correct import path for AppContext
import { useAppContext } from '../context/AppContext.tsx';
import CogIcon from './icons/CogIcon.tsx';

const Nutrition: React.FC = () => {
  const { showModal } = useAppContext();

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-spartan-gold">Nutrición</h1>
        <button 
          onClick={() => showModal('nutrition-settings')}
          className="flex items-center gap-2 bg-spartan-card text-spartan-text hover:bg-spartan-border font-bold py-2 px-4 rounded-lg transition-colors"
          title="Ajustes de Nutrición"
        >
          <CogIcon className="w-5 h-5" />
          Ajustes
        </button>
      </div>

      <div className="bg-spartan-surface p-10 rounded-lg text-center">
        <h2 className="text-2xl font-semibold">Próximamente</h2>
        <p className="text-spartan-text-secondary mt-2">
          El módulo de nutrición está en desarrollo. Pronto podrás hacer seguimiento de tus macros,
          obtener planes de comidas de la IA y mucho más.
        </p>
      </div>
    </div>
  );
};

export default Nutrition;
