import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppSelector } from './store/hooks';
import BoardView from './pages/BoardView';
import BoardDetailPage from './pages/BoardDetailPage';
import NotFound from './pages/NotFound';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && (
            <header className="bg-blue-600 text-white shadow">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Task Board App</h1>
                <div>
                  {/* User menu could go here */}
                </div>
              </div>
            </header>
          )}
          
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/boards" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/boards" element={
                <ProtectedRoute>
                  <BoardView />
                </ProtectedRoute>
              } />
              
              <Route path="/board/:boardId" element={
                <ProtectedRoute>
                  <BoardDetailPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </DndProvider>
    </Router>
  );
};

export default App;