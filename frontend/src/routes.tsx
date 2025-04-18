import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './adapters/primary/components/layout/Navbar';
import LoginPage from './adapters/primary/pages/LoginPage';
import RegisterPage from './adapters/primary/pages/RegisterPage';
import ForgotPasswordPage from './adapters/primary/pages/ForgotPasswordPage';
import ResetPasswordPage from './adapters/primary/pages/ResetPasswordPage';
import DashboardPage from './adapters/primary/pages/DashboardPage';
import ProtectedRoute from './adapters/primary/components/ProtectedRoute';
import TemporaryPage from './adapters/primary/components/TemporaryPage';

function AppRoutes() {
  return (
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRoutes; 