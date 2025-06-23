import api from './api';
import { Board } from '../types';

// Transform server response to match our frontend types
const transformBoard = (boardData: any): Board => ({
  id: boardData._id,
  title: boardData.title,
  description: boardData.description,
  createdAt: boardData.createdAt,
  createdBy: {
    id: boardData.createdBy._id || boardData.createdBy,
    name: boardData.createdBy.name || 'Unknown'
  }
});

const boardService = {
  getBoards: async (): Promise<Board[]> => {
    const response = await api.get('/boards');
    return response.data.map(transformBoard);
  },
  
  getBoard: async (id: string): Promise<Board> => {
    const response = await api.get(`/boards/${id}`);
    return transformBoard(response.data);
  },
  
  createBoard: async (boardData: Partial<Board>): Promise<Board> => {
    const response = await api.post('/boards', {
      title: boardData.title,
      description: boardData.description
    });
    return transformBoard(response.data);
  },
  
  updateBoard: async (id: string, boardData: Partial<Board>): Promise<Board> => {
    const response = await api.put(`/boards/${id}`, {
      title: boardData.title,
      description: boardData.description
    });
    return transformBoard(response.data);
  },
  
  deleteBoard: async (id: string): Promise<string> => {
    await api.delete(`/boards/${id}`);
    return id;
  }
};

export default boardService;