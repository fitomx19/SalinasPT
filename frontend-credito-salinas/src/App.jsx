import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import SolicitudPage from './pages/SolicitudPage';
import EstadisticasPage from './pages/EstadisticasPage';
import SimularPage from './pages/SimularPage';
import HistorialClientePage from './pages/HistorialClientePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solicitud" element={<SolicitudPage />} />
            <Route path="/simular" element={<SimularPage />} />
            <Route path="/historial" element={<HistorialClientePage />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
            <p className="text-sm mt-2">Evaluación Técnica Adolfo Huerta</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
