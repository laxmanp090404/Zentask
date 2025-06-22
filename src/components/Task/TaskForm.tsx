import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../UI/Button';
import Dropdown from '../UI/Dropdown';
import { useAppDispatch } from '../../store/hooks';
import { addTask, updateTask } from '../../store/slices/taskSlice';
import { Task, Priority } from '../../types';

interface TaskFormProps {
  columnId: string;
  onClose: () => void;
  existingTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({
  columnId,
  onClose,
  existingTask
}) => {
  const isEditing = !!existingTask;
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(
    existingTask?.dueDate 
      ? new Date(existingTask.dueDate).toISOString().split('T')[0]
      : ''
  );
  
  // In a real app, you'd have a list of users to assign to
  // For now we'll use a mock user
  const mockUsers = [
    { id: '1', name: 'Test User 1' },
    { id: '2', name: 'Test User 2' }
  ];
  
  const [assignedTo, setAssignedTo] = useState(existingTask?.assignedTo?.id || '');
  
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    // In a real app, user would come from auth
    const mockUser = { id: '1', name: 'Test User' };
    
    if (isEditing && existingTask) {
      const updatedTask: Task = {
        ...existingTask,
        title: title.trim(),
        description: description.trim(),
        priority,
        columnId, // Associate task with column
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        assignedTo: assignedTo ? mockUsers.find(user => user.id === assignedTo) : undefined
      };
      
      dispatch(updateTask(updatedTask));
    } else {
      const newTask: Task = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        createdBy: mockUser,
        priority,
        columnId, // Associate task with column
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        assignedTo: assignedTo ? mockUsers.find(user => user.id === assignedTo) : undefined,
        createdAt: new Date().toISOString()
      };
      
      dispatch(addTask(newTask));
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="taskTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Title
        </label>
        <input
          type="text"
          id="taskTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label
          htmlFor="taskDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Dropdown
          label="Priority"
          options={[
            { value: Priority.LOW, label: 'Low' },
            { value: Priority.MEDIUM, label: 'Medium' },
            { value: Priority.HIGH, label: 'High' },
          ]}
          value={priority}
          onChange={(value) => setPriority(value as Priority)}
        />
        
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label
          htmlFor="assignedTo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Assigned To
        </label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Unassigned</option>
          {mockUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;