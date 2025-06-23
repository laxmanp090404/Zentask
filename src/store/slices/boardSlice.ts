import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../types';
import boardService from '../../services/boardService';

// Async thunks for API calls
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      return await boardService.getBoards();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await boardService.getBoard(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: Partial<Board>, { rejectWithValue }) => {
    try {
      return await boardService.createBoard(boardData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateBoardAsync = createAsyncThunk(
  'boards/updateBoard',
  async ({ id, boardData }: { id: string; boardData: Partial<Board> }, { rejectWithValue }) => {
    try {
      return await boardService.updateBoard(id, boardData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteBoardAsync = createAsyncThunk(
  'boards/deleteBoard',
  async (id: string, { rejectWithValue }) => {
    try {
      await boardService.deleteBoard(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface BoardState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  loading: false,
  error: null
};

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    // Keep sync reducers for local state updates
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
  },
  extraReducers: (builder) => {
    // Fetch all boards
    builder.addCase(fetchBoards.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBoards.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = action.payload;
    });
    builder.addCase(fetchBoards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch single board
    builder.addCase(fetchBoardById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      } else {
        state.boards.push(action.payload);
      }
    });
    builder.addCase(fetchBoardById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create board
    builder.addCase(createBoard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.loading = false;
      state.boards.push(action.payload);
    });
    builder.addCase(createBoard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update board
    builder.addCase(updateBoardAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBoardAsync.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    });
    builder.addCase(updateBoardAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete board
    builder.addCase(deleteBoardAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBoardAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = state.boards.filter(board => board.id !== action.payload);
    });
    builder.addCase(deleteBoardAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { addBoard, updateBoard, deleteBoard, setBoards } = boardSlice.actions;
export default boardSlice.reducer;