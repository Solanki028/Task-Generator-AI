import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GenerateSpecPage from './pages/GenerateSpecPage';
import SpecDetailPage from './pages/SpecDetailPage';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GenerateSpecPage />} />
          <Route path="/spec/:id" element={<SpecDetailPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
