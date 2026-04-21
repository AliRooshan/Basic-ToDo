import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CalendarView from './pages/CalendarView';
import UniversityView from './pages/UniversityView';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import type { AppMode } from './types';
import { getMode, saveMode } from './utils/storage';

const MainApp = () => {
  const { logout } = useAuth();
  const [mode, setMode] = useState<AppMode>(getMode());

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    saveMode(newMode);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        logout={logout}
      />
      {mode === 'personal' ? (
        <CalendarView />
      ) : (
        <UniversityView />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
