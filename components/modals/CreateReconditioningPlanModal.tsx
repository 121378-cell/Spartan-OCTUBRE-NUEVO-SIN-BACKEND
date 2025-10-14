import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import type { ReconditioningPlan, ReconditioningActivity } from '../../types.ts';

type PlanData = Omit<ReconditioningPlan, 'id'>;

const CreateReconditioningPlanModal: React.FC = () => {
    const { hideModal, addReconditioningPlan, showToast } = useAppContext();
    
    const [plan, setPlan] = useState<PlanData>({
        name: '',
        focus: 'mixed',
        activities: [{ name: '', type: 'physical', description: '' }]
    });

    const handlePlanChange = (field: keyof PlanData, value: any) => {
        setPlan(prev => ({ ...prev, [field]: value }));
    };

    const handleActivityChange = (index: number, field: keyof ReconditioningActivity, value: string) => {
        const newActivities = [...plan.activities];
        newActivities[index] = { ...newActivities[index], [field]: value };
        handlePlanChange('activities', newActivities);
    };

    const addActivity = () => {
        handlePlanChange('activities', [...plan.activities, { name: '', type: 'physical', description: '' }]);
    };

    const removeActivity = (index: number) => {
        const newActivities = plan.activities.filter((_, i) => i !== index);
        handlePlanChange('activities', newActivities);
    };

    const handleSubmit = () => {
        if (!plan.name.trim()) {
            showToast("Por favor, introduce un nombre para el plan.");
            return;
        }
        if (plan.activities.some(a => !a.name.trim() || !a.description.trim())) {
            showToast("Por favor, rellena todos los campos para cada actividad.");
            return;
        }
        addReconditioningPlan(plan);
        showToast("¡Nuevo plan de reacondicionamiento añadido!");
        hideModal();
    };

  return (
    <div>
      <h2 className="text-2xl font-bold text-spartan-gold mb-4">Crear Plan de Reacondicionamiento</h2>
      <p className="text-spartan-text-secondary mb-6">
        Diseña un plan personalizado para tu recuperación física y mental.
      </p>
      
      <div className="space-y-4">
        <div>
            <label htmlFor="planName" className="block text-sm font-medium text-spartan-text-secondary mb-1">Nombre del Plan</label>
            <input
                id="planName"
                type="text"
                value={plan.name}
                onChange={(e) => handlePlanChange('name', e.target.value)}
                className="w-full bg-spartan-card border border-spartan-border rounded-lg p-2 focus:ring-2 focus:ring-spartan-gold focus:outline-none"
                placeholder="Ej: Reseteo Dominical"
            />
        </div>
        <div>
            <label htmlFor="planFocus" className="block text-sm font-medium text-spartan-text-secondary mb-1">Enfoque</label>
            <select
                id="planFocus"
                value={plan.focus}
                onChange={(e) => handlePlanChange('focus', e.target.value as PlanData['focus'])}
                className="w-full bg-spartan-card border border-spartan-border rounded-lg p-2 focus:ring-2 focus:ring-spartan-gold focus:outline-none"
            >
                <option value="physical">Físico</option>
                <option value="mental">Mental</option>
                <option value="mixed">Mixto</option>
            </select>
        </div>

        <div className="space-y-3">
            <h3 className="text-lg font-semibold border-b border-spartan-border pb-1">Actividades</h3>
            {plan.activities.map((activity, index) => (
                <div key={index} className="bg-spartan-card p-3 rounded-lg space-y-2 relative">
                    <button onClick={() => removeActivity(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400">&times;</button>
                    <div className="grid grid-cols-2 gap-2">
                         <input
                            type="text"
                            value={activity.name}
                            onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                            placeholder="Nombre de la Actividad"
                            className="w-full bg-spartan-surface border border-spartan-border rounded-md p-2 text-sm focus:ring-1 focus:ring-spartan-gold focus:outline-none"
                        />
                        <select
                            value={activity.type}
                            onChange={(e) => handleActivityChange(index, 'type', e.target.value as ReconditioningActivity['type'])}
                            className="w-full bg-spartan-surface border border-spartan-border rounded-md p-2 text-sm focus:ring-1 focus:ring-spartan-gold focus:outline-none"
                        >
                            <option value="physical">Física</option>
                            <option value="mental">Mental</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        placeholder="Descripción (ej: 15 minutos)"
                        className="w-full bg-spartan-surface border border-spartan-border rounded-md p-2 text-sm focus:ring-1 focus:ring-spartan-gold focus:outline-none"
                    />
                </div>
            ))}
             <button
                onClick={addActivity}
                className="w-full text-sm py-2 px-4 border-2 border-dashed border-spartan-border text-spartan-text-secondary hover:bg-spartan-card rounded-lg transition-colors"
            >
                + Añadir Actividad
            </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={hideModal}
          className="py-2 px-4 bg-spartan-card hover:bg-spartan-border rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="py-2 px-4 bg-spartan-gold text-spartan-bg font-bold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Guardar Plan
        </button>
      </div>
    </div>
  );
};

export default CreateReconditioningPlanModal;