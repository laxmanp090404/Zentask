import api from './api';
import { Task, Priority } from '../types';

// Transform server response to match our frontend types
const transformTask = (taskData: any): Task => ({
  id: taskData._id,
  title: taskData.title,
  description: taskData.description,
  createdBy: {
    id: taskData.createdBy._id || taskData.createdBy,
    name: taskData.createdBy.name || 'Unknown'
  },
  assignedTo: taskData.assignedTo ? {
    id: taskData.assignedTo._id || taskData.assignedTo,
    name: taskData.assignedTo.name || 'Unknown'
  } : undefined,
  priority: taskData.priority as Priority,
  dueDate: taskData.dueDate,
  createdAt: taskData.createdAt,
  columnId: taskData.columnId
});

const taskService = {
  getTasks: async (columnId: string): Promise<Task[]> => {
    const response = await api.get(`/columns/${columnId}/tasks`);
    return response.data.map(transformTask);
  },
  
  createTask: async (columnId: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.post(`/columns/${columnId}/tasks`, {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignedTo: taskData.assignedTo?.id // Send only the ID
    });
    return transformTask(response.data);
  },
  
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignedTo: taskData.assignedTo?.id,
      columnId: taskData.columnId
    });
    return transformTask(response.data);
  },
  
  deleteTask: async (id: string): Promise<string> => {
    await api.delete(`/tasks/${id}`);
    return id;
  },

  moveTask: async (
    taskId: string,
    destColumnId: string,
    destIndex: number
  ): Promise<void> => {
    await api.put(`/tasks/${taskId}/move`, { destColumnId, destIndex });
  },
};

export default taskService;