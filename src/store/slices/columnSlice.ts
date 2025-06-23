import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Column, Task } from '../../types';
import columnService from '../../services/columnService';

// Async thunks for API calls
export const fetchColumns = createAsyncThunk(
  'columns/fetchColumns',
  async (boardId: string, { rejectWithValue }) => {
    try {
      return await columnService.getColumns(boardId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createColumn = createAsyncThunk(
  'columns/createColumn',
  async ({ boardId, title }: { boardId: string; title: string }, { rejectWithValue }) => {
    try {
      return await columnService.createColumn(boardId, title);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateColumnAsync = createAsyncThunk(
  'columns/updateColumn',
  async ({ id, columnData }: { id: string; columnData: Partial<Column> }, { rejectWithValue }) => {
    try {
      return await columnService.updateColumn(id, columnData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteColumnAsync = createAsyncThunk(
  'columns/deleteColumn',
  async (id: string, { rejectWithValue }) => {
    try {
      await columnService.deleteColumn(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface ColumnState {
  columns: Column[];
  loading: boolean;
  error: string | null;
}

const initialState: ColumnState = {
  columns: [],
  loading: false,
  error: null
};

export const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    // Keep sync reducers for local state updates
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    updateColumn: (state, action: PayloadAction<Column>) => {
      const index = state.columns.findIndex(column => column.id === action.payload.id);
      if (index !== -1) {
        state.columns[index] = action.payload;
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(column => column.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    reorderTasks: (state, action: PayloadAction<{ columnId: string, taskIds: string[] }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        const taskMap = new Map(column.tasks.map(task => [task.id, task]));
        const reorderedTasks = action.payload.taskIds
          .map(taskId => taskMap.get(taskId))
          .filter((task): task is Task => task !== undefined);
        
        if (reorderedTasks.length !== column.tasks.length) {
          console.warn(`Reordering tasks in column ${action.payload.columnId}: Some task IDs are invalid or missing.`);
        }
        
        column.tasks = reorderedTasks;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch columns
    builder.addCase(fetchColumns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      state.loading = false;
      state.columns = action.payload;
    });
    builder.addCase(fetchColumns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create column
    builder.addCase(createColumn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createColumn.fulfilled, (state, action) => {
      state.loading = false;
      state.columns.push(action.payload);
    });
    builder.addCase(createColumn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update column
    builder.addCase(updateColumnAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateColumnAsync.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.columns.findIndex(column => column.id === action.payload.id);
      if (index !== -1) {
        // Preserve tasks when updating column
        const tasks = state.columns[index].tasks;
        state.columns[index] = { ...action.payload, tasks };
      }
    });
    builder.addCase(updateColumnAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete column
    builder.addCase(deleteColumnAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteColumnAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.columns = state.columns.filter(column => column.id !== action.payload);
    });
    builder.addCase(deleteColumnAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { addColumn, updateColumn, deleteColumn, setColumns, reorderTasks } = columnSlice.actions;
export default columnSlice.reducer;