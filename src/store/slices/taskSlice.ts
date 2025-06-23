import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';
import taskService from '../../services/taskService';

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (columnId: string, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(columnId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ columnId, taskData }: { columnId: string; taskData: Partial<Task> }, { rejectWithValue }) => {
    try {
      return await taskService.createTask(columnId, taskData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: string; taskData: Partial<Task> }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, taskData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const moveTaskAsync = createAsyncThunk(
  'tasks/moveTask',
  async (
    { taskId, destinationColumnId }: { taskId: string; destinationColumnId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const task = state.tasks.tasks.find((t: Task) => t.id === taskId);
      
      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      // Update task with new column ID
      const updatedTask = await taskService.updateTask(taskId, {
        ...task,
        columnId: destinationColumnId
      });
      
      return {
        task: updatedTask,
        previousColumnId: task.columnId,
        newColumnId: destinationColumnId
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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
    // Keep sync reducers for local state updates
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
        task.columnId = action.payload.destinationColumnId;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      // Add new tasks and update existing ones
      action.payload.forEach(task => {
        const index = state.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          state.tasks[index] = task;
        } else {
          state.tasks.push(task);
        }
      });
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create task
    builder.addCase(createTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update task
    builder.addCase(updateTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
    builder.addCase(updateTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete task
    builder.addCase(deleteTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    });
    builder.addCase(deleteTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Move task
    builder.addCase(moveTaskAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(moveTaskAsync.fulfilled, (state, action) => {
      state.loading = false;
      const task = state.tasks.find(t => t.id === action.payload.task.id);
      if (task) {
        task.columnId = action.payload.newColumnId;
      }
    });
    builder.addCase(moveTaskAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { addTask, updateTask, deleteTask, setTasks, moveTask } = taskSlice.actions;
export default taskSlice.reducer;