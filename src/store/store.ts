import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import columnReducer from './slices/columnSlice';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;