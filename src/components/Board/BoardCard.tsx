import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../../types';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${board.id}`);
  };

  return (
    <tr 
      onClick={handleClick}
      className="hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {board.title}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {board.description.length > 100 
            ? `${board.description.substring(0, 100)}...` 
            : board.description}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {board.createdBy.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(board.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

export default BoardCard;