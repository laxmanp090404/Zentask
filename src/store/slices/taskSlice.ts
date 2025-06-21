import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    moveTask: (state, action: PayloadAction<{ taskId: string, sourceColumnId: string, destinationColumnId: string }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        // Update the task's column reference (assuming Task has a columnId field)
        task.columnId = action.payload.destinationColumnId;
      } else {
        console.warn(`Task ${action.payload.taskId} not found for moving.`);
      }
    }
  }
});

export const { addTask, updateTask, deleteTask, setTasks, moveTask } = taskSlice.actions;
export default taskSlice.reducer;