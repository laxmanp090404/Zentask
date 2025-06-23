import React, { useState } from 'react';
import Button from '../UI/Button';

interface ColumnFormProps {
  onSubmit: (title: string) => void;
  onClose: () => void;
  initialTitle?: string;
}

const ColumnForm: React.FC<ColumnFormProps> = ({ onSubmit, onClose, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onSubmit(title.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded w-80">
      <div className="mb-3">
        <label
          htmlFor="columnTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Column Title
        </label>
        <input
          type="text"
          id="columnTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter column title"
          autoFocus
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialTitle ? 'Update Column' : 'Create Column'}
        </Button>
      </div>
    </form>
  );
};

export default ColumnForm;