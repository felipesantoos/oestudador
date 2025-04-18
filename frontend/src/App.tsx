import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlanProvider } from './contexts/PlanContext';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlanProvider>
          <AppRoutes />
        </PlanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;