import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './adapters/state/authStore';

// Layout components
import Navbar from './adapters/primary/components/layout/Navbar';
import ProtectedRoute from './adapters/primary/components/ProtectedRoute';

// Auth pages
import LoginPage from './adapters/primary/pages/LoginPage';
import RegisterPage from './adapters/primary/pages/RegisterPage';
import ForgotPasswordPage from './adapters/primary/pages/ForgotPasswordPage';
import ResetPasswordPage from './adapters/primary/pages/ResetPasswordPage';

// Main pages
import DashboardPage from './adapters/primary/pages/DashboardPage';

// For demo purposes, some routes point to a temporary component
const TemporaryPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-2xl font-bold mb-6">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/plans" element={
              <ProtectedRoute>
                <TemporaryPage title="Study Plans" />
              </ProtectedRoute>
            } />
            
            <Route path="/plans/new" element={
              <ProtectedRoute>
                <TemporaryPage title="Create New Study Plan" />
              </ProtectedRoute>
            } />
            
            <Route path="/flashcards" element={
              <ProtectedRoute>
                <TemporaryPage title="Flashcards" />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <TemporaryPage title="Analytics" />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <TemporaryPage title="User Profile" />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <TemporaryPage title="Settings" />
              </ProtectedRoute>
            } />
            
            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - 404 */}
            <Route path="*" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <button 
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;