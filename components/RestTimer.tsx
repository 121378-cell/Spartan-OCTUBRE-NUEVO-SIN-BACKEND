import React, { useState, useEffect } from 'react';

interface RestTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  timerKey: string; // Add a key to force re-render
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, onComplete, timerKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / duration) * circumference;

  useEffect(() => {
    setTimeLeft(duration); // Reset timer when key changes
  }, [timerKey, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 bg-spartan-surface rounded-lg">
      <p className="text-lg font-bold text-spartan-gold">DESCANSO</p>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-spartan-border"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="text-spartan-gold"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-mono">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      </div>
      <button 
        onClick={onComplete}
        className="text-sm bg-spartan-card hover:bg-spartan-border px-4 py-1 rounded-full transition-colors"
      >
        Saltar Descanso
      </button>
    </div>
  );
};

export default RestTimer;