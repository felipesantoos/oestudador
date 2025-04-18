import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlanProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              error: {
                style: {
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                },
                duration: 4000,
              },
            }}
          />
        </PlanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;