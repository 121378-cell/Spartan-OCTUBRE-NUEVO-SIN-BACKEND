import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableDayProps {
  id: string;
  className: string;
  children: React.ReactNode;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ id, className, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? 'rgba(255, 215, 0, 0.2)' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={className} data-date={id}>
      {children}
    </div>
  );
};

export default DroppableDay;