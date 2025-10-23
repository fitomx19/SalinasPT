import { useEffect, useState } from 'react';
import { estadisticaService } from '../../services/estadisticaService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Loading from '../common/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [statsPorSucursal, setStatsPorSucursal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [generales, sucursales] = await Promise.all([
        estadisticaService.obtenerGenerales(),
        estadisticaService.obtenerPorSucursal(),
      ]);
      
      setStats(generales.data);
      setStatsPorSucursal(sucursales.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  if (!stats) {
    return <div>No hay datos disponibles</div>;
  }

  // Datos para gráfica de pie
  const pieData = [
    { name: 'Aprobados', value: parseInt(stats.aprobados), color: '#10b981' },
    { name: 'Rechazados', value: parseInt(stats.rechazados), color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Solicitudes"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        
        <StatCard
          title="Aprobadas"
          value={stats.aprobados}
          percentage={stats.porcentaje_aprobacion}
          icon={TrendingUp}
          color="green"
        />
        
        <StatCard
          title="Rechazadas"
          value={stats.rechazados}
          percentage={stats.porcentaje_rechazo}
          icon={TrendingDown}
          color="red"
        />
        
        <StatCard
          title="Monto Total Aprobado"
          value={formatCurrency(stats.monto_aprobado_total)}
          icon={DollarSign}
          color="primary"
        />
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Distribución de Solicitudes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-{index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

       
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Solicitudes por Sucursal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsPorSucursal.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sucursal" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="aprobados" fill="#10b981" name="Aprobados" />
              <Bar dataKey="rechazados" fill="#ef4444" name="Rechazados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Detalle por Sucursal
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aprobadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rechazadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Aprobación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statsPorSucursal.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.sucursal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {stat.aprobados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {stat.rechazados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPercentage(stat.porcentaje_aprobacion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const StatCard = ({ title, value, percentage, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    primary: 'bg-primary-100 text-primary-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {percentage !== undefined && (
            <p className="text-sm text-gray-500 mt-1">
              {formatPercentage(percentage)}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
