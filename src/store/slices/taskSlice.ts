import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';
import taskService from '../../services/taskService'; // Ensure service is imported

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
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
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

export const moveTask = createAsyncThunk(
  'tasks/moveTask',
  async (
    { taskId, destColumnId, destIndex }: { taskId: string; destColumnId: string; destIndex: number },
    { rejectWithValue }
  ) => {
    try {
      await taskService.moveTask(taskId, destColumnId, destIndex);
      // Return data for reducer to finalize state
      return { taskId, destColumnId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move task');
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
    // ADD THIS REDUCER for optimistic UI updates during drag-and-drop
    reorderTasks: (state, action: PayloadAction<{ taskId: string; sourceColumnId: string; destColumnId: string; destIndex: number }>) => {
      const { taskId, destColumnId, destIndex } = action.payload;

      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;

      // 1. Remove the task from its current position in the flat array
      const [movedTask] = state.tasks.splice(taskIndex, 1);

      // 2. Update its columnId
      movedTask.columnId = destColumnId;

      // 3. Find the new position in the flat array.
      // This is a simplified logic that places it relative to other tasks in the destination column.
      const tasksInDestColumn = state.tasks.filter(t => t.columnId === destColumnId);
      if (destIndex >= tasksInDestColumn.length) {
        // If dropping at the end, find the index of the last task in the column
        const lastTask = tasksInDestColumn[tasksInDestColumn.length - 1];
        const newIndex = lastTask ? state.tasks.findIndex(t => t.id === lastTask.id) + 1 : 0;
        state.tasks.splice(newIndex, 0, movedTask);
      } else {
        // If dropping at a specific index, find the task at that index
        const taskAtDestIndex = tasksInDestColumn[destIndex];
        const newIndex = state.tasks.findIndex(t => t.id === taskAtDestIndex.id);
        state.tasks.splice(newIndex, 0, movedTask);
      }
    },
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
    
    // Handle Create Task
    builder.addCase(createTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.loading = false;
      state.tasks.push(action.payload); // Add the new task from the API to the state
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
    // FIX: This now correctly references the async thunk 'moveTask'
    builder.addCase(moveTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(moveTask.fulfilled, (state, action) => {
      state.loading = false;
      const { taskId, destColumnId } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.columnId = destColumnId;
      }
    });
    builder.addCase(moveTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

// Export the new action
export const { addTask, updateTask, deleteTask, setTasks, reorderTasks } = taskSlice.actions;
export default taskSlice.reducer;