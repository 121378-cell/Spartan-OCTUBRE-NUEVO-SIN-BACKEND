import React from 'react';
// Fix: Correct import path for AppContext
import { useAppContext } from '../../context/AppContext.tsx';

const NutritionSettingsModal: React.FC = () => {
    const { hideModal } = useAppContext();

    return (
        <div>
            <h2 className="text-2xl font-bold text-spartan-gold mb-4">Ajustes de Nutrición</h2>
            <p className="text-spartan-text-secondary mb-6">
                Esta sección está en desarrollo. Próximamente podrás configurar tus objetivos de calorías,
                macros y preferencias dietéticas.
            </p>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={hideModal}
                    className="py-2 px-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default NutritionSettingsModal;
