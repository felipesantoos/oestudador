import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './app/ui/pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;