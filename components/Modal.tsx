import React, { ReactNode } from 'react';
// Fix: Correct import path for AppContext
import { useAppContext } from '../context/AppContext.tsx';

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { modal, hideModal } = useAppContext();

  if (!modal.isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={hideModal}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-spartan-surface rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={hideModal}
          className="absolute top-3 right-3 text-spartan-text-secondary hover:text-spartan-text"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
