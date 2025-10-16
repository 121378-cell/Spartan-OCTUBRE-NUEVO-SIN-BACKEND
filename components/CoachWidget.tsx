import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { getStrategistTip } from '../services/aiService.ts';
import BrainIcon from './icons/BrainIcon.tsx';

interface CoachWidgetProps {
    synergisticLoadScore: number;
}

const CoachWidget: React.FC<CoachWidgetProps> = ({ synergisticLoadScore }) => {
    const { userProfile } = useAppContext();
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            setIsLoading(true);
            const newTip = await getStrategistTip(userProfile, synergisticLoadScore);
            setTip(newTip);
            setIsLoading(false);
        };
        fetchTip();
    }, [userProfile, synergisticLoadScore]);

    return (
        <div className="bg-spartan-card p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-xl font-semibold text-spartan-gold mb-4 flex items-center gap-2">
                <BrainIcon className="w-6 h-6"/>
                El Porqué del Día
            </h3>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex items-center gap-1.5 h-5">
                        <span className="w-2 h-2 bg-spartan-text-secondary rounded-full animate-pulse [animation-delay:0s]"></span>
                        <span className="w-2 h-2 bg-spartan-text-secondary rounded-full animate-pulse [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-spartan-text-secondary rounded-full animate-pulse [animation-delay:0.4s]"></span>
                    </div>
                </div>
            ) : (
                <p className="text-spartan-text-secondary italic flex-grow">"{tip}"</p>
            )}
        </div>
    );
};

export default CoachWidget;
