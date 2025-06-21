import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Column } from '../../types';
import { Task } from '../../types';

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
        
        // Validate that no tasks are missing
        if (reorderedTasks.length !== column.tasks.length) {
          console.warn(`Reordering tasks in column ${action.payload.columnId}: Some task IDs are invalid or missing.`);
        }
        
        column.tasks = reorderedTasks;
      } else {
        console.warn(`Column ${action.payload.columnId} not found for reordering tasks.`);
      }
    }
  }
});

export const { addColumn, updateColumn, deleteColumn, setColumns, reorderTasks } = columnSlice.actions;
export default columnSlice.reducer;