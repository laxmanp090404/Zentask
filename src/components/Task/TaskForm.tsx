import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Dropdown from '../UI/Dropdown';
import { useAppDispatch } from '../../store/hooks';
import { createTask, updateTaskAsync } from '../../store/slices/taskSlice';
import { Task, Priority, User } from '../../types';
import userService from '../../services/userService';

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
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState(existingTask?.assignedTo?.id || '');
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await userService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // This payload contains only the data the user can edit or create.
    // The backend will handle 'createdBy' and 'createdAt'.
    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      assignedTo: assignedTo ? users.find(u => u.id === assignedTo) : undefined,
    };
    
    if (isEditing && existingTask) {
      // Dispatch the async thunk to update the task via the API
      dispatch(updateTaskAsync({ id: existingTask.id, taskData: taskPayload }));
    } else {
      // Dispatch the async thunk to create the task via the API
      dispatch(createTask({ columnId, taskData: taskPayload }));
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
          disabled={loading}
        >
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {loading && <p className="text-xs text-gray-500 mt-1">Loading users...</p>}
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