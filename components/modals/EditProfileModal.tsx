import React, { useState } from 'react';
// Fix: Correct import path for AppContext
import { useAppContext } from '../../context/AppContext.tsx';

const EditProfileModal: React.FC = () => {
  const { userProfile, updateProfile, hideModal, showToast } = useAppContext();
  const [name, setName] = useState(userProfile.name);

  const handleSave = () => {
    updateProfile({ name });
    showToast('¡Perfil actualizado correctamente!');
    hideModal();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-spartan-gold mb-4">Editar Perfil</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-spartan-text-secondary mb-1">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-spartan-card border border-spartan-border rounded-lg p-2 focus:ring-2 focus:ring-spartan-gold focus:outline-none"
        />
      </div>
      {/* Add more fields here as needed */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={hideModal}
          className="py-2 px-4 bg-spartan-card hover:bg-spartan-border rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="py-2 px-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
