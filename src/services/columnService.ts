import api from './api';
import { Column } from '../types';

// Transform server response to match our frontend types
const transformColumn = (columnData: any): Column => ({
  id: columnData._id,
  title: columnData.title,
  boardId: columnData.boardId,
  order: columnData.order,
  tasks: [] // Tasks will be loaded separately
});

const columnService = {
  getColumns: async (boardId: string): Promise<Column[]> => {
    const response = await api.get(`/boards/${boardId}/columns`);
    return response.data.map(transformColumn);
  },
  
  createColumn: async (boardId: string, title: string): Promise<Column> => {
    const response = await api.post(`/boards/${boardId}/columns`, { title });
    return transformColumn(response.data);
  },
  
  updateColumn: async (id: string, columnData: Partial<Column>): Promise<Column> => {
    const response = await api.put(`/columns/${id}`, {
      title: columnData.title,
      order: columnData.order
    });
    return transformColumn(response.data);
  },
  
  deleteColumn: async (id: string): Promise<string> => {
    await api.delete(`/columns/${id}`);
    return id;
  }
};

export default columnService;