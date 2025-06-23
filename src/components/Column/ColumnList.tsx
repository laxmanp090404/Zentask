import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import ColumnForm from './ColumnForm';
import Button from '../UI/Button';
import { Column as ColumnType, Task } from '../../types';

interface ColumnListProps {
  columns: ColumnType[];
  tasks: Task[];
  boardId: string;
  onAddColumn: (title: string) => void;
}

const ColumnList: React.FC<ColumnListProps> = ({ columns, tasks, onAddColumn }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Filter tasks by column using the task's columnId property
  const getColumnTasks = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  const handleAddColumn = (title: string) => {
    onAddColumn(title);
    setIsAddingColumn(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-h-[500px]">
          {columns.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.id)}
            />
          ))}
          
          {isAddingColumn ? (
            <ColumnForm
              onSubmit={handleAddColumn}
              onClose={() => setIsAddingColumn(false)}
            />
          ) : (
            <div className="w-80 flex-shrink-0">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsAddingColumn(true)}
              >
                + Add Column
              </Button>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ColumnList;