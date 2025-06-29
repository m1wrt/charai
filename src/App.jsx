import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
import { auth } from './firebase';

function App() {
  return (
    <Router basename="/charai">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;