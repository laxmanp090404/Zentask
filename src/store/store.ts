import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import columnReducer from './slices/columnSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;