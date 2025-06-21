import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../types';

interface BoardState {
    boards: Board[];
    loading: boolean;
    error: string | null;
}

// defining the initial state of the board slice
// slice that handles the boards in the application
const initialState: BoardState = {
  boards: [],
  loading: false,
  error: null
};

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    }
  }
});

export const { addBoard, updateBoard, deleteBoard, setBoards } = boardSlice.actions;
export default boardSlice.reducer;