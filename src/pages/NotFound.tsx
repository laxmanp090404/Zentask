import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page not found</p>
      <Button
        variant="primary"
        onClick={() => navigate('/boards')}
      >
        Go to Boards
      </Button>
    </div>
  );
};

export default NotFound;