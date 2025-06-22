import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DraggableItemProps {
  id: string;
  index: number;
  type: string;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  type,
  onMove,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (item: any) => {
      if (!item) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);

      // Update the index for the dragged item directly to avoid flickering
      item.index = hoverIndex;
    },
  });

  return (
    <div 
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      {children}
    </div>
  );
};

export default DraggableItem;