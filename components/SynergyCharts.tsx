import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { useChartData } from '../hooks/useChartData.ts';
import SimpleLineChart from './SimpleLineChart.tsx';

const SynergyCharts: React.FC = () => {
    const { workoutHistory, weeklyCheckIns } = useAppContext();
    const chartData = useChartData(workoutHistory, weeklyCheckIns);

    return (
        <div className="bg-spartan-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-spartan-gold mb-2">Gráficos Sinérgicos</h2>
            <p className="text-spartan-text-secondary mb-6">
                Observa la relación entre tu esfuerzo y tu recuperación. Esta es tu 'Firma de Desgaste' personal, la clave para un progreso sostenible.
            </p>
            
            {chartData.length > 1 ? (
                <div className="h-80">
                    <SimpleLineChart 
                        data={chartData} 
                        dataKey1="load" 
                        dataKey2="stress"
                        color1="#D4AF37" // spartan-gold
                        color2="#EF4444" // red-500
                    />
                     <div className="flex justify-center items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-spartan-gold"></div>
                            <span className="text-sm">Carga de Entrenamiento</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-sm">Estrés Percibido</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-spartan-text-secondary">No hay suficientes datos para generar gráficos. Completa algunos entrenamientos y registros semanales.</p>
                </div>
            )}
        </div>
    );
};

export default SynergyCharts;