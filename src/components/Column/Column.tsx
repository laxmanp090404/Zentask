import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Column as ColumnType, Task } from '../../types';
import TaskList from '../Task/TaskList';
import TaskForm from '../Task/TaskForm';
import Button from '../UI/Button';
import { useAppDispatch } from '../../store/hooks';
import { updateColumn, deleteColumn } from '../../store/slices/columnSlice';
import { moveTask } from '../../store/slices/taskSlice';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

interface DropItem {
  id: string;
  sourceColumnId: string;
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const dispatch = useAppDispatch();
  
  // Create a ref to attach to the div
  const columnRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DropItem, unknown, { isOver: boolean }>({
    accept: 'TASK',
    drop: (item) => {
      if (item.sourceColumnId !== column.id) {
        dispatch(
          moveTask({
            taskId: item.id,
            sourceColumnId: item.sourceColumnId,
            destinationColumnId: column.id
          })
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  // Connect the drop to the ref
  drop(columnRef);

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      dispatch(updateColumn({ ...column, title: editTitle.trim() }));
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = () => {
    // In a real app, add confirmation dialog
    dispatch(deleteColumn(column.id));
  };

  return (
    <div
      ref={columnRef}
      className={`bg-gray-100 rounded-md p-3 w-80 flex-shrink-0 h-full flex flex-col ${
        isOver ? 'bg-gray-200' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 flex-grow"
              autoFocus
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
              }}
            />
            <Button variant="primary" onClick={handleSaveTitle}>
              Save
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-800">{column.title}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDeleteColumn}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <TaskList tasks={tasks} columnId={column.id} />
      </div>
      
      {isAddingTask ? (
        <TaskForm
          columnId={column.id}
          onClose={() => setIsAddingTask(false)}
        />
      ) : (
        <Button
          variant="secondary"
          className="w-full mt-3"
          onClick={() => setIsAddingTask(true)}
        >
          + Add Task
        </Button>
      )}
    </div>
  );
};

export default Column;