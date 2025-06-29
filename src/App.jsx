import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
import { auth } from './firebase';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path='/' element={<MainPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;