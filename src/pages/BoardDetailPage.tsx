import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBoardById } from '../store/slices/boardSlice';
import { fetchColumns, createColumn } from '../store/slices/columnSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import ColumnList from '../components/Column/ColumnList';
import Button from '../components/UI/Button';

const BoardDetailPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const board = useAppSelector((state) =>
    state.boards.boards.find((b) => b.id === boardId)
  );
  
  const columns = useAppSelector((state) =>
    state.columns.columns.filter((c) => c.boardId === boardId)
  );
  
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const loading = useAppSelector((state) => state.boards.loading || state.columns.loading);
  const error = useAppSelector((state) => state.boards.error || state.columns.error);
  
  useEffect(() => {
    if (boardId) {
      // Fetch board details
      dispatch(fetchBoardById(boardId));
      
      // Fetch columns for this board
      dispatch(fetchColumns(boardId));
      
      // After columns are loaded, fetch tasks for each column
      if (columns.length > 0) {
        columns.forEach(column => {
          dispatch(fetchTasks(column.id));
        });
      }
    }
  }, [boardId, dispatch, columns.length]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/boards')}
        >
          Back to Boards
        </Button>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Board not found
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/boards')}
        >
          Back to Boards
        </Button>
      </div>
    );
  }

  const handleAddColumn = (title: string) => {
    if (boardId) {
      dispatch(createColumn({ boardId, title }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button
            variant="secondary"
            className="mb-2"
            onClick={() => navigate('/boards')}
          >
            ← Back to Boards
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{board.title}</h1>
          <p className="text-gray-600 mt-1">{board.description}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>Created by: {board.createdBy.name}</p>
          <p>Date: {new Date(board.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <ColumnList
        columns={columns}
        tasks={tasks}
        boardId={board.id}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
};

export default BoardDetailPage;