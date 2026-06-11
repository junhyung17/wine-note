import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import WineDetailPage from './pages/WineDetailPage';
import WineFormPage from './pages/WineFormPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a0c] flex items-center justify-center">
        <p className="text-gray-500 text-sm">로딩 중...</p>
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
          <Route path="/add" element={<AuthGuard><WineFormPage /></AuthGuard>} />
          <Route path="/edit/:id" element={<AuthGuard><WineFormPage /></AuthGuard>} />
          <Route path="/wine/:id" element={<AuthGuard><WineDetailPage /></AuthGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
