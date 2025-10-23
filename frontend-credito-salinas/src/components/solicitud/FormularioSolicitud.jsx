import { useState, useEffect } from 'react';
import { sucursalService } from '../../services/sucursalService';
import { User, Mail, Phone, Calendar, DollarSign, Building, CreditCard, Clock } from 'lucide-react';

const FormularioSolicitud = ({ onSubmit, loading }) => {
  const [sucursales, setSucursales] = useState([]);
  const [formData, setFormData] = useState({
    cliente: {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      ingreso_mensual: '',
    },
    solicitud: {
      sucursal_id: '',
      monto_solicitado: '',
      plazo_meses: '',
    },
  });

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      const response = await sucursalService.obtenerTodas();
      setSucursales(response.data || []);
    } catch (error) {
      console.error('Error cargando sucursales:', error);
    }
  };

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      cliente: {
        ...formData.cliente,
        [name]: value,
      },
    });
  };

  const handleSolicitudChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      solicitud: {
        ...formData.solicitud,
        [name]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* DATOS DEL CLIENTE */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-2 text-primary-600" />
          Datos del Cliente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="nombre"
                required
                value={formData.cliente.nombre}
                onChange={handleClienteChange}
                className="input-field pl-10"
                placeholder="Juan"
              />
            </div>
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="apellidos"
                required
                value={formData.cliente.apellidos}
                onChange={handleClienteChange}
                className="input-field pl-10"
                placeholder="Pérez García"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.cliente.email}
                onChange={handleClienteChange}
                className="input-field pl-10"
                placeholder="ejemplo@email.com"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (10 dígitos) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="tel"
                name="telefono"
                required
                pattern="[0-9]{10}"
                maxLength="10"
                value={formData.cliente.telefono}
                onChange={handleClienteChange}
                className="input-field pl-10"
                placeholder="5512345678"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Nacimiento *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                name="fecha_nacimiento"
                required
                value={formData.cliente.fecha_nacimiento}
                onChange={handleClienteChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Ingreso Mensual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingreso Mensual *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                name="ingreso_mensual"
                required
                min="0"
                step="0.01"
                value={formData.cliente.ingreso_mensual}
                onChange={handleClienteChange}
                className="input-field pl-10"
                placeholder="15000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DATOS DE LA SOLICITUD */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <CreditCard className="mr-2 text-primary-600" />
          Datos de la Solicitud
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sucursal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursal *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="sucursal_id"
                required
                value={formData.solicitud.sucursal_id}
                onChange={handleSolicitudChange}
                className="input-field pl-10"
              >
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre} - {sucursal.ciudad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monto Solicitado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto Solicitado (\,000 - \,000) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                name="monto_solicitado"
                required
                min="5000"
                max="500000"
                step="1000"
                value={formData.solicitud.monto_solicitado}
                onChange={handleSolicitudChange}
                className="input-field pl-10"
                placeholder="50000"
              />
            </div>
          </div>

          {/* Plazo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plazo en Meses (6 - 60) *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                name="plazo_meses"
                required
                min="6"
                max="60"
                value={formData.solicitud.plazo_meses}
                onChange={handleSolicitudChange}
                className="input-field pl-10"
                placeholder="24"
              />
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3 text-lg"
        >
          {loading ? 'Procesando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </form>
  );
};

export default FormularioSolicitud;
