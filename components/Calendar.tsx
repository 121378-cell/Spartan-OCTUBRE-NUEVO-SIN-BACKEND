import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';

const Calendar: React.FC = () => {
  const { workoutHistory } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const focusColors: { [key: string]: string } = {
      'Fuerza': 'bg-red-600',
      'Hipertrofia': 'bg-blue-600',
      'Fuerza & Hipertrofia': 'bg-purple-600',
      'Resistencia': 'bg-green-600',
      'HIIT': 'bg-yellow-500',
      'Default': 'bg-spartan-gold'
  }

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-spartan-border rounded-md"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        let dayClass = "p-2 border border-spartan-border rounded-md flex flex-col justify-start items-start min-h-[100px] hover:bg-spartan-card transition-colors";
        const dayDate = new Date(year, month, day);
        const dayString = dayDate.toISOString().split('T')[0];
        let isToday = new Date().toDateString() === dayDate.toDateString();
        
        if (isToday) dayClass += " bg-spartan-surface";

        const workoutsForDay = workoutHistory.filter(wh => wh.date === dayString);
        
        days.push(
            <div key={day} className={dayClass}>
                <span className={`font-bold ${isToday ? 'text-spartan-gold' : 'text-spartan-text'}`}>{day}</span>
                <div className="mt-1 space-y-1 w-full">
                    {workoutsForDay.map((workout, index) => {
                        const colorKey = Object.keys(focusColors).find(key => workout.focus.includes(key)) || 'Default';
                        return (
                             <div key={index} className={`text-xs text-white px-2 py-1 rounded-full truncate ${focusColors[colorKey]}`}>
                                {workout.routineName}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
    return days;
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };


  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold mb-6 text-spartan-gold">Calendario de Entrenamiento</h1>
      <div className="bg-spartan-surface p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-spartan-card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-spartan-card">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => (
            <div key={day} className="font-bold text-center text-spartan-text-secondary">{day}</div>
          ))}
          {renderDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
