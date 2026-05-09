import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WineFormPage from './pages/WineFormPage';
import WineDetailPage from './pages/WineDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<WineFormPage />} />
        <Route path="/edit/:id" element={<WineFormPage />} />
        <Route path="/wine/:id" element={<WineDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
