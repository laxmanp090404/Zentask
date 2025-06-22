import React from 'react';
import Task from './Task';
import { Task as TaskType } from '../../types';

interface TaskListProps {
  tasks: TaskType[];
  columnId: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, columnId }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">
        No tasks yet
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <Task key={task.id} task={task} columnId={columnId} />
      ))}
    </div>
  );
};

export default TaskList;