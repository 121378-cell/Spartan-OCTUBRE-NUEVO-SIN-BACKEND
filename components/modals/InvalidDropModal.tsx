import React from 'react';
import { useAppContext } from '../../context/AppContext';

const InvalidDropModal: React.FC = () => {
  const { closeModal } = useAppContext();

  return (
    <div className="p-6 bg-spartan-card border border-spartan-border rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold text-spartan-gold mb-4">Acción no permitida</h2>
      <p className="text-spartan-text mb-6">
        No puedes mover una sesión a un día de descanso. El descanso es crucial para la recuperación y el progreso.
      </p>
      <button
        onClick={closeModal}
        className="bg-spartan-gold text-spartan-background font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
      >
        Entendido
      </button>
    </div>
  );
};

export default InvalidDropModal;