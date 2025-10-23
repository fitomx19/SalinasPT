import { useState } from 'react';
import { clienteService } from '../services/clienteService';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  FileText,
  History
} from 'lucide-react';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';

const HistorialClientePage = () => {
  const [query, setQuery] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (query.trim().length < 3) {
      setError('Debes escribir al menos 3 caracteres para buscar');
      return;
    }

    try {
      setBuscando(true);
      setError(null);
      setResultadosBusqueda([]);
      setClienteSeleccionado(null);
      setHistorial(null);

      const response = await clienteService.buscar(query);
      setResultadosBusqueda(response.data);

      if (response.data.length === 0) {
        setError('No se encontraron clientes con ese criterio');
      }
    } catch (err) {
      console.error('Error buscando clientes:', err);
      setError(err.message || 'Error al buscar clientes');
    } finally {
      setBuscando(false);
    }
  };

  const handleSeleccionarCliente = async (cliente) => {
    try {
      setCargandoHistorial(true);
      setError(null);
      setClienteSeleccionado(cliente);

      const response = await clienteService.obtenerHistorial(cliente.id);
      setHistorial(response.data);
    } catch (err) {
      console.error('Error cargando historial:', err);
      setError(err.message || 'Error al cargar el historial');
      setHistorial(null);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleNuevaBusqueda = () => {
    setQuery('');
    setResultadosBusqueda([]);
    setClienteSeleccionado(null);
    setHistorial(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <History className="mr-3 text-primary-600" />
          Historial de Cliente
        </h1>
        <p className="text-gray-600">
          Busca un cliente por email, nombre o teléfono para ver su historial completo
        </p>
      </div>

      {/* BUSCADOR */}
      {!clienteSeleccionado && (
        <div className="card max-w-3xl mx-auto">
          <form onSubmit={handleBuscar} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Cliente
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Email, nombre o teléfono..."
                  className="input-field pl-10"
                  disabled={buscando}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Escribe al menos 3 caracteres para buscar
              </p>
            </div>

            {error && (
              <Alert
                type="error"
                title="Error"
                message={error}
                onClose={() => setError(null)}
              />
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={buscando || query.trim().length < 3}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                {buscando ? (
                  <>
                    <Loading />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Buscar</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* RESULTADOS DE BÚSQUEDA */}
          {resultadosBusqueda.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resultados de Búsqueda ({resultadosBusqueda.length})
              </h3>
              <div className="space-y-3">
                {resultadosBusqueda.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => handleSeleccionarCliente(cliente)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900">
                          {cliente.nombre} {cliente.apellidos}
                        </h4>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {cliente.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {cliente.telefono}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText size={14} />
                            {cliente.total_solicitudes} solicitud(es)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-primary-600 font-medium">
                          Ver historial →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HISTORIAL DEL CLIENTE */}
      {clienteSeleccionado && cargandoHistorial && (
        <Loading message="Cargando historial del cliente..." />
      )}

      {historial && !cargandoHistorial && (
        <div className="space-y-6">
          {/* BOTÓN NUEVA BÚSQUEDA */}
          <div className="flex justify-start">
            <button
              onClick={handleNuevaBusqueda}
              className="btn-secondary flex items-center gap-2"
            >
              <Search size={18} />
              Nueva Búsqueda
            </button>
          </div>

          {/* INFORMACIÓN DEL CLIENTE */}
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary-600 rounded-full">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {historial.cliente.nombre} {historial.cliente.apellidos}
                    </h2>
                    <p className="text-gray-600">Cliente ID: {historial.cliente.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={18} className="text-primary-600" />
                    <span className="text-sm">{historial.cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={18} className="text-primary-600" />
                    <span className="text-sm">{historial.cliente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={18} className="text-primary-600" />
                    <span className="text-sm">
                      Nació: {formatDate(historial.cliente.fecha_nacimiento)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign size={18} className="text-primary-600" />
                    <span className="text-sm">
                      Ingreso: {formatCurrency(historial.cliente.ingreso_mensual)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ESTADÍSTICAS DEL CLIENTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Solicitudes</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {historial.estadisticas.total_solicitudes}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium mb-1">Aprobadas</p>
                  <p className="text-3xl font-bold text-green-900">
                    {historial.estadisticas.aprobadas}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium mb-1">Rechazadas</p>
                  <p className="text-3xl font-bold text-red-900">
                    {historial.estadisticas.rechazadas}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <XCircle size={24} />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium mb-1">Tasa Aprobación</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {historial.estadisticas.tasa_aprobacion}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* TOTALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-200 text-orange-700">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-orange-700 font-medium">Monto Total Aprobado</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(historial.estadisticas.monto_total_aprobado)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-indigo-200 text-indigo-700">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-indigo-700 font-medium">Score Promedio</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {historial.estadisticas.score_promedio} / 100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLA DE SOLICITUDES */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="mr-2 text-primary-600" />
              Historial de Solicitudes
            </h3>

            {historial.solicitudes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Este cliente no tiene solicitudes registradas
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sucursal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plazo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo Rechazo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historial.solicitudes.map((solicitud) => (
                      <tr key={solicitud.solicitud_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(solicitud.fecha_solicitud)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {solicitud.sucursal_nombre}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(solicitud.monto_solicitado)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {solicitud.plazo_meses} meses
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            solicitud.score >= 70
                              ? 'bg-green-100 text-green-800'
                              : solicitud.score >= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {solicitud.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {solicitud.estado === 'aprobado' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="mr-1" size={14} />
                              Aprobado
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="mr-1" size={14} />
                              Rechazado
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                          {solicitud.motivo_rechazo || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialClientePage;

