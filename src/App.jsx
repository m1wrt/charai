import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Captura la ruta del hash (#) si existe
    const hashRoute = window.location.hash.substring(1);
    if (hashRoute) {
      navigate(hashRoute);
      // Limpia el hash de la URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router basename="/charai">
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;