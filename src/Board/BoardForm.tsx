import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../UI/Button';
import { useAppDispatch } from '../store/hooks';
import { addBoard } from '../store/slices/boardSlice';

interface BoardFormProps {
  onClose: () => void;
}

const BoardForm: React.FC<BoardFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    // In a real app, user would come from auth
    const mockUser = { id: '1', name: 'Test User' };
    
    const newBoard = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      createdBy: mockUser
    };
    
    dispatch(addBoard(newBoard));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Board Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Board
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BoardForm;