import api from './api';
import { User } from '../types';

const transformUser = (userData: any): User => ({
  id: userData._id,
  name: userData.name
});

const userService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      return response.data.map(transformUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};

export default userService;