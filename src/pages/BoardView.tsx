import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBoards, createBoard } from '../store/slices/boardSlice';
import BoardList from '../components/Board/BoardList';
import BoardForm from '../components/Board/BoardForm';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const BoardView: React.FC = () => {
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const dispatch = useAppDispatch();
  const { boards, loading, error } = useAppSelector((state) => state.boards);

  // Fetch boards when component mounts
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreateBoard = (boardData: { title: string; description: string }) => {
    dispatch(createBoard(boardData));
    setIsAddingBoard(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Boards</h1>
        <Button
          variant="primary"
          onClick={() => setIsAddingBoard(true)}
        >
          Create New Board
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading boards...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      ) : (
        <BoardList boards={boards} />
      )}

      <Modal
        isOpen={isAddingBoard}
        onClose={() => setIsAddingBoard(false)}
        title="Create New Board"
      >
        <BoardForm onSubmit={handleCreateBoard} onClose={() => setIsAddingBoard(false)} />
      </Modal>
    </div>
  );
};

export default BoardView;