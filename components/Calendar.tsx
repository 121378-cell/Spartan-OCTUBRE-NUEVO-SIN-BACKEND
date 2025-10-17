import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableSession from './DraggableSession';
import DroppableDay from './DroppableDay';
import type { Routine, ScheduledWorkout } from '../types.ts';
import FocusIcon from './icons/FocusIcon.tsx';

const Calendar: React.FC = () => {
  const { scheduledWorkouts, showModal, routines, workoutHistory, rescheduleWorkout } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number } | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);

  // Local state to manage the schedule for drag-and-drop
  const [schedule, setSchedule] = useState<ScheduledWorkout[]>([]);

  useEffect(() => {
    // Create a schedule that includes empty days for drag-and-drop
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthSchedule: any[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dayString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        const scheduledWorkout = scheduledWorkouts.find(sw => sw.date === dayString);
        if (scheduledWorkout) {
            monthSchedule.push(scheduledWorkout);
        } else {
            monthSchedule.push({ id: dayString, date: dayString, routineId: null });
        }
    }
    setSchedule(monthSchedule);
  }, [scheduledWorkouts, currentDate]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const overItem = schedule.find(item => item.id === over.id);

      if (overItem && !overItem.routineId) {
        showModal('invalid-drop');
        return;
      }

      // This is a simplified state update for demonstration.
      // A real implementation would call a function to update the backend.
      setSchedule((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const generateFocusInstruction = (routine: Routine): string => {
    let instruction = `Foco: ${routine.focus}.`;
    if (routine.objective) {
        instruction += `\nObjetivo: "${routine.objective}"`;
    }
    const mainLift = routine.blocks.flatMap(b => b.exercises).find(ex => ex.rir !== undefined);
    if (mainLift) {
        instruction += `\nClave: RIR ${mainLift.rir} en ${mainLift.name}.`;
    }
    return instruction;
  };

  const showTooltip = (content: string, e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
        visible: true,
        content,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
    });
  };

  const hideTooltip = () => {
    if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
    }
    setTooltip(null);
  };

  const handleTouchStart = (content: string, e: React.TouchEvent) => {
    longPressTimeoutRef.current = window.setTimeout(() => {
        showTooltip(content, e);
    }, 500); // 500ms for long press
  };

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const renderDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-spartan-border rounded-md opacity-50"></div>);
    }

    schedule.forEach((item) => {
        const day = new Date(item.date).getDate();
        const dayDate = new Date(item.date);
        const dayString = item.date;
        const isToday = dayDate.getTime() === today.getTime();
        const workoutsForDay = workoutHistory.filter(wh => wh.date === dayString);
        
        let dayClass = `p-2 border border-spartan-border rounded-md flex flex-col justify-start items-start min-h-[120px] transition-colors relative`;
        if (isToday) dayClass += " bg-spartan-surface";

        const routine = item.routineId ? routines.find(r => r.id === item.routineId) : null;

        days.push(
            <DroppableDay key={item.id} id={item.id} className={dayClass}>
                <span className={`font-bold ${isToday ? 'text-spartan-gold' : 'text-spartan-text'}`}>{day}</span>
                <div className="mt-1 space-y-1 w-full">
                    {workoutsForDay.map((workout, index) => (
                         <div key={index} className="text-xs text-white px-2 py-1 rounded-md truncate bg-green-600">
                            {workout.routineName}
                        </div>
                    ))}
                    {routine && (
                        <DraggableSession
                          id={item.id}
                          routine={routine}
                          onMouseEnter={(content, e) => showTooltip(content, e)}
                          onMouseLeave={hideTooltip}
                          onTouchStart={(content, e) => handleTouchStart(content, e)}
                          onTouchEnd={hideTooltip}
                        />
                    )}
                    {!routine && workoutsForDay.length === 0 && (
                        <div className="text-xs text-spartan-text-secondary">Descanso</div>
                    )}
                </div>
            </DroppableDay>
        );
    });
    return days;
  };
  
  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="animate-fadeIn">
      {tooltip?.visible && (
        <div 
            className="fixed z-50 bg-spartan-card p-3 rounded-lg shadow-xl max-w-xs text-sm border border-spartan-border whitespace-pre-wrap animate-fadeIn"
            style={{ 
                top: tooltip.y, 
                left: tooltip.x,
                transform: 'translate(-50%, -100%)'
            }}
        >
          <div className="flex items-start gap-2">
            <FocusIcon className="w-5 h-5 text-spartan-gold flex-shrink-0 mt-0.5"/>
            <p>{tooltip.content}</p>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6 text-spartan-gold">Calendario de Entrenamiento</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="bg-spartan-surface p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-spartan-card">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-2xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
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
      </DndContext>
    </div>
  );
};

export default Calendar;