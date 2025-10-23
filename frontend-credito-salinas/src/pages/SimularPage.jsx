import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitudService } from '../services/solicitudService';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import { Sparkles, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react';

const SimularPage = () => {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(10);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  const handleSimular = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setResultados(null);

      const response = await solicitudService.simular(cantidad);
      // El backend devuelve { cantidad, solicitudes }
      setResultados(response.data.solicitudes || response.data);
    } catch (err) {
      console.error('Error al simular solicitudes:', err);
      setError(err.message || 'Error al simular solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = () => {
    if (!resultados) return null;

    const aprobadas = resultados.filter(r => r.evaluacion.estado === 'aprobado').length;
    const rechazadas = resultados.filter(r => r.evaluacion.estado === 'rechazado').length;
    const tasaAprobacion = ((aprobadas / resultados.length) * 100).toFixed(1);
    const scorePromedio = (resultados.reduce((sum, r) => sum + r.evaluacion.score, 0) / resultados.length).toFixed(1);

    return {
      aprobadas,
      rechazadas,
      tasaAprobacion,
      scorePromedio
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <Sparkles className="mr-3 text-purple-600" />
          Simulación de Solicitudes
        </h1>
        <p className="text-gray-600">
          Genera solicitudes aleatorias automáticamente para probar el sistema
        </p>
      </div>

      {/* FORMULARIO DE SIMULACIÓN */}
      {!resultados && (
        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSimular} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Solicitudes a Generar
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                className="input-field"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Puedes generar entre 1 y 100 solicitudes aleatorias
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

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loading />
                    <span>Simulando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Simular {cantidad} Solicitudes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Qué hace esta función?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Genera datos aleatorios de clientes (nombre, email, teléfono, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Crea solicitudes con montos y plazos aleatorios</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Evalúa automáticamente cada solicitud según los criterios del sistema</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Muestra un resumen detallado de los resultados</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {resultados && stats && (
        <div className="space-y-6">
          {/* RESUMEN DE ESTADÍSTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Procesadas</p>
              <p className="text-3xl font-bold text-blue-900">{resultados.length}</p>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-sm text-green-600 font-medium mb-1">Aprobadas</p>
              <p className="text-3xl font-bold text-green-900">{stats.aprobadas}</p>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100">
              <p className="text-sm text-red-600 font-medium mb-1">Rechazadas</p>
              <p className="text-3xl font-bold text-red-900">{stats.rechazadas}</p>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-sm text-purple-600 font-medium mb-1">Score Promedio</p>
              <p className="text-3xl font-bold text-purple-900">{stats.scorePromedio}</p>
            </div>
          </div>

          {/* RESUMEN DE TASA DE APROBACIÓN */}
          <div className="card bg-gradient-to-r from-primary-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="mr-2 text-primary-600" />
                  Tasa de Aprobación
                </h3>
                <p className="text-4xl font-bold text-primary-700">{stats.tasaAprobacion}%</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => navigate('/estadisticas')}
                  className="btn-primary flex items-center gap-2"
                >
                  Ver Dashboard Completo
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* LISTA DE SOLICITUDES */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Detalle de Solicitudes Procesadas
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
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
                      Motivo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resultados.map((resultado, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {resultado.solicitud.nombre} {resultado.solicitud.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resultado.solicitud.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${resultado.solicitud.monto_solicitado.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {resultado.solicitud.plazo_meses} meses
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          resultado.evaluacion.score >= 70
                            ? 'bg-green-100 text-green-800'
                            : resultado.evaluacion.score >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resultado.evaluacion.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {resultado.evaluacion.estado === 'aprobado' ? (
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
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {resultado.evaluacion.motivo_rechazo || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setResultados(null);
                setError(null);
              }}
              className="btn-secondary px-8 py-3"
            >
              Nueva Simulación
            </button>
            <button
              onClick={() => navigate('/estadisticas')}
              className="btn-primary px-8 py-3 flex items-center gap-2"
            >
              Ver Estadísticas Completas
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimularPage;

