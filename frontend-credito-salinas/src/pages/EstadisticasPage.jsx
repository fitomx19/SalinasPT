import Dashboard from '../components/estadisticas/Dashboard';

const EstadisticasPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Estadísticas y Reportes
        </h1>
        <p className="text-gray-600">
          Visualiza las métricas y estadísticas del sistema
        </p>
      </div>

      <Dashboard />
    </div>
  );
};

export default EstadisticasPage;
