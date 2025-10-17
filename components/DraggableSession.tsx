import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Routine } from '../types';

interface DraggableSessionProps {
  id: string;
  routine: Routine;
  onMouseEnter: (content: string, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onTouchStart: (content: string, e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const DraggableSession: React.FC<DraggableSessionProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-sm font-bold text-spartan-gold px-2 py-1 rounded-md truncate border-2 border-dashed border-spartan-gold/50 cursor-grab active:cursor-grabbing"
      onMouseEnter={(e) => props.onMouseEnter(`Foco: ${props.routine.focus}.`, e)}
      onMouseLeave={props.onMouseLeave}
      onTouchStart={(e) => props.onTouchStart(`Foco: ${props.routine.focus}.`, e)}
      onTouchEnd={props.onTouchEnd}
    >
      {props.routine.focus}
    </div>
  );
};

export default DraggableSession;