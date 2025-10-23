# setup-frontend.ps1
# Script para crear la estructura completa del frontend React

Write-Host "🎨 Creando estructura del frontend React..." -ForegroundColor Cyan

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js primero." -ForegroundColor Red
    Write-Host "Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# Crear proyecto con Vite
$projectName = "frontend-credito-salinas"

if (Test-Path $projectName) {
    Write-Host "⚠️  El directorio $projectName ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas eliminarlo y crear uno nuevo? (s/n)"
    if ($response -eq "s") {
        Remove-Item -Recurse -Force $projectName
        Write-Host "✅ Directorio anterior eliminado" -ForegroundColor Green
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
        exit
    }
}

Write-Host "📦 Creando proyecto con Vite..." -ForegroundColor Yellow
npm create vite@latest $projectName -- --template react

Set-Location $projectName

Write-Host "📦 Instalando dependencias base..." -ForegroundColor Yellow
npm install

Write-Host "📦 Instalando dependencias adicionales..." -ForegroundColor Yellow
npm install axios react-router-dom

Write-Host "📦 Instalando TailwindCSS..." -ForegroundColor Yellow
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Write-Host "📦 Instalando librerías para gráficas y UI..." -ForegroundColor Yellow
npm install recharts lucide-react

Write-Host "📁 Creando estructura de carpetas..." -ForegroundColor Yellow

# Crear estructura de carpetas
$folders = @(
    "src/components",
    "src/components/common",
    "src/components/solicitud",
    "src/components/estadisticas",
    "src/pages",
    "src/services",
    "src/utils",
    "src/hooks",
    "src/context"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Host "✅ Carpetas creadas" -ForegroundColor Green

# ============================================
# ARCHIVO: tailwind.config.js
# ============================================
Write-Host "📄 Configurando Tailwind..." -ForegroundColor Yellow

@"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    },
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/index.css
# ============================================
Write-Host "📄 Configurando estilos globales..." -ForegroundColor Yellow

@"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg p-6;
  }
}
"@ | Out-File -FilePath "src/index.css" -Encoding UTF8

# ============================================
# ARCHIVO: .env
# ============================================
Write-Host "📄 Creando archivo .env..." -ForegroundColor Yellow

@"
VITE_API_URL=http://localhost:3000/api
"@ | Out-File -FilePath ".env" -Encoding UTF8

# ============================================
# ARCHIVO: .env.example
# ============================================
@"
VITE_API_URL=http://localhost:3000/api
"@ | Out-File -FilePath ".env.example" -Encoding UTF8

# ============================================
# ARCHIVO: src/services/api.js
# ============================================
Write-Host "📄 Creando servicio API..." -ForegroundColor Yellow

@"
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
"@ | Out-File -FilePath "src/services/api.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/services/solicitudService.js
# ============================================
Write-Host "📄 Creando servicio de solicitudes..." -ForegroundColor Yellow

@"
import api from './api';

export const solicitudService = {
  // Crear solicitud
  crear: async (data) => {
    try {
      const response = await api.post('/solicitudes', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Simular solicitudes
  simular: async (cantidad) => {
    try {
      const response = await api.post('/solicitudes/simular', { cantidad });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener todas las solicitudes
  obtenerTodas: async (limit = 100) => {
    try {
      const response = await api.get('/solicitudes', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener solicitud por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get('/solicitudes/' + id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
"@ | Out-File -FilePath "src/services/solicitudService.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/services/sucursalService.js
# ============================================
Write-Host "📄 Creando servicio de sucursales..." -ForegroundColor Yellow

@"
import api from './api';

export const sucursalService = {
  // Obtener todas las sucursales
  obtenerTodas: async () => {
    try {
      const response = await api.get('/sucursales');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener sucursal por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get('/sucursales/' + id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
"@ | Out-File -FilePath "src/services/sucursalService.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/services/estadisticaService.js
# ============================================
Write-Host "📄 Creando servicio de estadísticas..." -ForegroundColor Yellow

@"
import api from './api';

export const estadisticaService = {
  // Obtener estadísticas generales
  obtenerGenerales: async () => {
    try {
      const response = await api.get('/estadisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas por sucursal
  obtenerPorSucursal: async () => {
    try {
      const response = await api.get('/estadisticas/sucursales');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
"@ | Out-File -FilePath "src/services/estadisticaService.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/utils/formatters.js
# ============================================
Write-Host "📄 Creando utilidades de formato..." -ForegroundColor Yellow

@"
// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Formatear porcentaje
export const formatPercentage = (value) => {
  return value.toFixed(2) + '%';
};

// Calcular edad desde fecha de nacimiento
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
"@ | Out-File -FilePath "src/utils/formatters.js" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/common/Navbar.jsx
# ============================================
Write-Host "📄 Creando componente Navbar..." -ForegroundColor Yellow

@"
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/solicitud', icon: FileText, label: 'Nueva Solicitud' },
    { path: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  ];

  return (
    <nav className=`"bg-white shadow-lg`">
      <div className=`"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`">
        <div className=`"flex justify-between h-16`">
          <div className=`"flex items-center`">
            <div className=`"flex-shrink-0 flex items-center`">
              <h1 className=`"text-2xl font-bold text-primary-600`">
                Grupo Salinas
              </h1>
            </div>
          </div>

          <div className=`"flex space-x-4 items-center`">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={``
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                    {isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  ``}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
"@ | Out-File -FilePath "src/components/common/Navbar.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/common/Loading.jsx
# ============================================
Write-Host "📄 Creando componente Loading..." -ForegroundColor Yellow

@"
const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className=`"flex flex-col items-center justify-center p-8`">
      <div className=`"animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600`"></div>
      <p className=`"mt-4 text-gray-600`">{message}</p>
    </div>
  );
};

export default Loading;
"@ | Out-File -FilePath "src/components/common/Loading.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/common/Alert.jsx
# ============================================
Write-Host "📄 Creando componente Alert..." -ForegroundColor Yellow

@"
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-400',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={``{config.bg} {config.border} border rounded-lg p-4``}>
      <div className=`"flex items-start`">
        <Icon className={``{config.iconColor} mt-0.5``} size={20} />
        <div className=`"ml-3 flex-1`">
          {title && (
            <h3 className={``{config.text} font-semibold text-sm``}>
              {title}
            </h3>
          )}
          {message && (
            <p className={``{config.text} text-sm mt-1``}>
              {message}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={``{config.text} hover:opacity-75``}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
"@ | Out-File -FilePath "src/components/common/Alert.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/solicitud/FormularioSolicitud.jsx
# ============================================
Write-Host "📄 Creando componente FormularioSolicitud..." -ForegroundColor Yellow

@"
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
    <form onSubmit={handleSubmit} className=`"space-y-8`">
      {/* DATOS DEL CLIENTE */}
      <div className=`"card`">
        <h2 className=`"text-2xl font-bold text-gray-800 mb-6 flex items-center`">
          <User className=`"mr-2 text-primary-600`" />
          Datos del Cliente
        </h2>

        <div className=`"grid grid-cols-1 md:grid-cols-2 gap-6`">
          {/* Nombre */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Nombre *
            </label>
            <div className=`"relative`">
              <User className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"text`"
                name=`"nombre`"
                required
                value={formData.cliente.nombre}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
                placeholder=`"Juan`"
              />
            </div>
          </div>

          {/* Apellidos */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Apellidos *
            </label>
            <div className=`"relative`">
              <User className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"text`"
                name=`"apellidos`"
                required
                value={formData.cliente.apellidos}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
                placeholder=`"Pérez García`"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Email *
            </label>
            <div className=`"relative`">
              <Mail className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"email`"
                name=`"email`"
                required
                value={formData.cliente.email}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
                placeholder=`"ejemplo@email.com`"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Teléfono (10 dígitos) *
            </label>
            <div className=`"relative`">
              <Phone className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"tel`"
                name=`"telefono`"
                required
                pattern=`"[0-9]{10}`"
                maxLength=`"10`"
                value={formData.cliente.telefono}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
                placeholder=`"5512345678`"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Fecha de Nacimiento *
            </label>
            <div className=`"relative`">
              <Calendar className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"date`"
                name=`"fecha_nacimiento`"
                required
                value={formData.cliente.fecha_nacimiento}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
              />
            </div>
          </div>

          {/* Ingreso Mensual */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Ingreso Mensual *
            </label>
            <div className=`"relative`">
              <DollarSign className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"number`"
                name=`"ingreso_mensual`"
                required
                min=`"0`"
                step=`"0.01`"
                value={formData.cliente.ingreso_mensual}
                onChange={handleClienteChange}
                className=`"input-field pl-10`"
                placeholder=`"15000`"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DATOS DE LA SOLICITUD */}
      <div className=`"card`">
        <h2 className=`"text-2xl font-bold text-gray-800 mb-6 flex items-center`">
          <CreditCard className=`"mr-2 text-primary-600`" />
          Datos de la Solicitud
        </h2>

        <div className=`"grid grid-cols-1 md:grid-cols-2 gap-6`">
          {/* Sucursal */}
          <div>
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Sucursal *
            </label>
            <div className=`"relative`">
              <Building className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <select
                name=`"sucursal_id`"
                required
                value={formData.solicitud.sucursal_id}
                onChange={handleSolicitudChange}
                className=`"input-field pl-10`"
              >
                <option value=`"`">Selecciona una sucursal</option>
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
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Monto Solicitado (\$5,000 - \$500,000) *
            </label>
            <div className=`"relative`">
              <DollarSign className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"number`"
                name=`"monto_solicitado`"
                required
                min=`"5000`"
                max=`"500000`"
                step=`"1000`"
                value={formData.solicitud.monto_solicitado}
                onChange={handleSolicitudChange}
                className=`"input-field pl-10`"
                placeholder=`"50000`"
              />
            </div>
          </div>

          {/* Plazo */}
          <div className=`"md:col-span-2`">
            <label className=`"block text-sm font-medium text-gray-700 mb-2`">
              Plazo en Meses (6 - 60) *
            </label>
            <div className=`"relative`">
              <Clock className=`"absolute left-3 top-3 text-gray-400`" size={18} />
              <input
                type=`"number`"
                name=`"plazo_meses`"
                required
                min=`"6`"
                max=`"60`"
                value={formData.solicitud.plazo_meses}
                onChange={handleSolicitudChange}
                className=`"input-field pl-10`"
                placeholder=`"24`"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN SUBMIT */}
      <div className=`"flex justify-center`">
        <button
          type=`"submit`"
          disabled={loading}
          className=`"btn-primary px-8 py-3 text-lg`"
        >
          {loading ? 'Procesando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </form>
  );
};

export default FormularioSolicitud;
"@ | Out-File -FilePath "src/components/solicitud/FormularioSolicitud.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/solicitud/ResultadoSolicitud.jsx
# ============================================
Write-Host "📄 Creando componente ResultadoSolicitud..." -ForegroundColor Yellow

@"
import { CheckCircle, XCircle, User, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ResultadoSolicitud = ({ resultado }) => {
  const { solicitud, evaluacion } = resultado;
  const aprobado = evaluacion.aprobado;

  return (
    <div className=`"space-y-6`">
      {/* ESTADO DE LA SOLICITUD */}
      <div
        className={``
          card text-center
          {aprobado ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}
        ``}
      >
        <div className=`"flex flex-col items-center`">
          {aprobado ? (
            <CheckCircle className=`"text-green-500 mb-4`" size={64} />
          ) : (
            <XCircle className=`"text-red-500 mb-4`" size={64} />
          )}
          
          <h2 className={``text-3xl font-bold mb-2 {aprobado ? 'text-green-700' : 'text-red-700'}``}>
            {aprobado ? '¡Solicitud Aprobada!' : 'Solicitud Rechazada'}
          </h2>
          
          <p className=`"text-gray-600 text-lg`">
            Folio: #{solicitud.id}
          </p>
        </div>
      </div>

      {/* DETALLES DEL CLIENTE */}
      <div className=`"card`">
        <h3 className=`"text-xl font-bold text-gray-800 mb-4 flex items-center`">
          <User className=`"mr-2 text-primary-600`" />
          Información del Cliente
        </h3>
        
        <div className=`"grid grid-cols-1 md:grid-cols-2 gap-4`">
          <div>
            <p className=`"text-sm text-gray-600`">Nombre Completo</p>
            <p className=`"font-semibold`">{solicitud.nombre} {solicitud.apellidos}</p>
          </div>
          
          <div>
            <p className=`"text-sm text-gray-600`">Email</p>
            <p className=`"font-semibold`">{solicitud.email}</p>
          </div>
        </div>
      </div>

      {/* DETALLES DE LA SOLICITUD */}
      <div className=`"card`">
        <h3 className=`"text-xl font-bold text-gray-800 mb-4 flex items-center`">
          <DollarSign className=`"mr-2 text-primary-600`" />
          Detalles de la Solicitud
        </h3>
        
        <div className=`"grid grid-cols-1 md:grid-cols-2 gap-4`">
          <div>
            <p className=`"text-sm text-gray-600`">Monto Solicitado</p>
            <p className=`"font-semibold text-lg`">{formatCurrency(solicitud.monto_solicitado)}</p>
          </div>
          
          <div>
            <p className=`"text-sm text-gray-600`">Plazo</p>
            <p className=`"font-semibold`">{solicitud.plazo_meses} meses</p>
          </div>
          
          <div>
            <p className=`"text-sm text-gray-600`">Pago Mensual Aproximado</p>
            <p className=`"font-semibold text-lg`">
              {formatCurrency(solicitud.monto_solicitado / solicitud.plazo_meses)}
            </p>
          </div>
          
          <div>
            <p className=`"text-sm text-gray-600`">Sucursal</p>
            <p className=`"font-semibold`">{solicitud.sucursal_nombre}</p>
          </div>
          
          <div>
            <p className=`"text-sm text-gray-600`">Fecha de Solicitud</p>
            <p className=`"font-semibold`">{formatDate(solicitud.fecha_solicitud)}</p>
          </div>
        </div>
      </div>

      {/* EVALUACIÓN */}
      <div className=`"card`">
        <h3 className=`"text-xl font-bold text-gray-800 mb-4 flex items-center`">
          <TrendingUp className=`"mr-2 text-primary-600`" />
          Evaluación Crediticia
        </h3>
        
        <div className=`"space-y-4`">
          {/* Score */}
          <div>
            <div className=`"flex justify-between items-center mb-2`">
              <span className=`"text-gray-700 font-medium`">Score Crediticio</span>
              <span className=`"text-2xl font-bold text-primary-600`">{evaluacion.score}/100</span>
            </div>
            <div className=`"w-full bg-gray-200 rounded-full h-4`">
              <div
                className={``
                  h-4 rounded-full transition-all
                  {evaluacion.score >= 80 ? 'bg-green-500' : 
                   evaluacion.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                ``}
                style={{ width: evaluacion.score + '%' }}
              ></div>
            </div>
          </div>

          {/* Motivo de Rechazo */}
          {!aprobado && solicitud.motivo_rechazo && (
            <div className=`"bg-red-50 border border-red-200 rounded-lg p-4`">
              <p className=`"text-sm font-medium text-red-800`">Motivo del Rechazo:</p>
              <p className=`"text-red-700 mt-1`">{solicitud.motivo_rechazo}</p>
            </div>
          )}

          {/* Criterios de Evaluación */}
          <div className=`"mt-4`">
            <p className=`"text-sm font-medium text-gray-700 mb-2`">Criterios Evaluados:</p>
            <div className=`"space-y-2`">
              {Object.entries(evaluacion.criterios).map(([key, value]) => (
                <div key={key} className=`"flex items-center`">
                  {value ? (
                    <CheckCircle className=`"text-green-500 mr-2`" size={18} />
                  ) : (
                    <XCircle className=`"text-red-500 mr-2`" size={18} />
                  )}
                  <span className=`"text-sm text-gray-700`">
                    {getCriterioLabel(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper para obtener etiquetas legibles
const getCriterioLabel = (key) => {
  const labels = {
    edadMinima: 'Edad mínima cumplida (18 años)',
    edadMaxima: 'Edad máxima permitida (65 años)',
    capacidadPago: 'Capacidad de pago suficiente',
    montoValido: 'Monto dentro del rango permitido',
    plazoValido: 'Plazo dentro del rango permitido',
  };
  return labels[key] || key;
};

export default ResultadoSolicitud;
"@ | Out-File -FilePath "src/components/solicitud/ResultadoSolicitud.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/components/estadisticas/Dashboard.jsx
# ============================================
Write-Host "📄 Creando componente Dashboard..." -ForegroundColor Yellow

@"
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
    return <Loading message=`"Cargando estadísticas...`" />;
  }

  if (!stats) {
    return <div>No hay datos disponibles</div>;
  }

  // Datos para gráfica de pie
  const pieData = [
    { name: 'Aprobados', value: stats.aprobados, color: '#10b981' },
    { name: 'Rechazados', value: stats.rechazados, color: '#ef4444' },
  ];

  return (
    <div className=`"space-y-6`">
      {/* TARJETAS DE RESUMEN */}
      <div className=`"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`">
        <StatCard
          title=`"Total Solicitudes`"
          value={stats.total}
          icon={FileText}
          color=`"blue`"
        />
        
        <StatCard
          title=`"Aprobadas`"
          value={stats.aprobados}
          percentage={stats.porcentaje_aprobacion}
          icon={TrendingUp}
          color=`"green`"
        />
        
        <StatCard
          title=`"Rechazadas`"
          value={stats.rechazados}
          percentage={stats.porcentaje_rechazo}
          icon={TrendingDown}
          color=`"red`"
        />
        
        <StatCard
          title=`"Monto Total Aprobado`"
          value={formatCurrency(stats.monto_aprobado_total)}
          icon={DollarSign}
          color=`"primary`"
        />
      </div>

      {/* GRÁFICAS */}
      <div className=`"grid grid-cols-1 lg:grid-cols-2 gap-6`">
        {/* GRÁFICA DE PIE */}
        <div className=`"card`">
          <h3 className=`"text-xl font-bold text-gray-800 mb-4`">
            Distribución de Solicitudes
          </h3>
          <ResponsiveContainer width=`"100%`" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx=`"50%`"
                cy=`"50%`"
                labelLine={false}
                label={({ name, percent }) => ``{name}: {(percent * 100).toFixed(0)}%``}
                outerRadius={80}
                fill=`"#8884d8`"
                dataKey=`"value`"
              >
                {pieData.map((entry, index) => (
                  <Cell key={``cell-{index}``} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICA DE BARRAS */}
        <div className=`"card`">
          <h3 className=`"text-xl font-bold text-gray-800 mb-4`">
            Solicitudes por Sucursal
          </h3>
          <ResponsiveContainer width=`"100%`" height={300}>
            <BarChart data={statsPorSucursal.slice(0, 5)}>
              <CartesianGrid strokeDasharray=`"3 3`" />
              <XAxis dataKey=`"sucursal`" angle={-45} textAnchor=`"end`" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey=`"aprobados`" fill=`"#10b981`" name=`"Aprobados`" />
              <Bar dataKey=`"rechazados`" fill=`"#ef4444`" name=`"Rechazados`" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA DE SUCURSALES */}
      <div className=`"card`">
        <h3 className=`"text-xl font-bold text-gray-800 mb-4`">
          Detalle por Sucursal
        </h3>
        <div className=`"overflow-x-auto`">
          <table className=`"min-w-full divide-y divide-gray-200`">
            <thead className=`"bg-gray-50`">
              <tr>
                <th className=`"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`">
                  Sucursal
                </th>
                <th className=`"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`">
                  Total
                </th>
                <th className=`"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`">
                  Aprobadas
                </th>
                <th className=`"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`">
                  Rechazadas
                </th>
                <th className=`"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`">
                  % Aprobación
                </th>
              </tr>
            </thead>
            <tbody className=`"bg-white divide-y divide-gray-200`">
              {statsPorSucursal.map((stat, index) => (
                <tr key={index} className=`"hover:bg-gray-50`">
                  <td className=`"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900`">
                    {stat.sucursal}
                  </td>
                  <td className=`"px-6 py-4 whitespace-nowrap text-sm text-gray-500`">
                    {stat.total}
                  </td>
                  <td className=`"px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold`">
                    {stat.aprobados}
                  </td>
                  <td className=`"px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold`">
                    {stat.rechazados}
                  </td>
                  <td className=`"px-6 py-4 whitespace-nowrap text-sm text-gray-500`">
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

// Componente de Tarjeta de Estadística
const StatCard = ({ title, value, percentage, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    primary: 'bg-primary-100 text-primary-600',
  };

  return (
    <div className=`"card`">
      <div className=`"flex items-center justify-between`">
        <div>
          <p className=`"text-sm text-gray-600 mb-1`">{title}</p>
          <p className=`"text-2xl font-bold text-gray-900`">{value}</p>
          {percentage !== undefined && (
            <p className=`"text-sm text-gray-500 mt-1`">
              {formatPercentage(percentage)}
            </p>
          )}
        </div>
        <div className={``p-3 rounded-full {colors[color]}``}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
"@ | Out-File -FilePath "src/components/estadisticas/Dashboard.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/pages/Home.jsx
# ============================================
Write-Host "📄 Creando página Home..." -ForegroundColor Yellow

@"
import { Link } from 'react-router-dom';
import { FileText, BarChart3, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className=`"max-w-6xl mx-auto`">
      {/* HERO SECTION */}
      <div className=`"card text-center mb-8`">
        <h1 className=`"text-4xl md:text-5xl font-bold text-gray-900 mb-4`">
          Sistema de Solicitud de Crédito
        </h1>
        <p className=`"text-xl text-gray-600 mb-8`">
          Grupo Salinas - Evaluación Técnica
        </p>
        <p className=`"text-lg text-gray-500 max-w-3xl mx-auto`">
          Bienvenido al sistema de solicitud de crédito. Aquí puedes realizar una nueva 
          solicitud de crédito y visualizar las estadísticas de todas las solicitudes procesadas.
        </p>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className=`"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`">
        <FeatureCard
          icon={FileText}
          title=`"Nueva Solicitud`"
          description=`"Realiza una solicitud de crédito y obtén una respuesta inmediata sobre su aprobación.`"
          link=`"/solicitud`"
          linkText=`"Solicitar Crédito`"
          color=`"primary`"
        />

        <FeatureCard
          icon={BarChart3}
          title=`"Estadísticas`"
          description=`"Visualiza las estadísticas generales y por sucursal de todas las solicitudes procesadas.`"
          link=`"/estadisticas`"
          linkText=`"Ver Estadísticas`"
          color=`"blue`"
        />
      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className=`"card bg-gradient-to-r from-primary-50 to-orange-50`">
        <h2 className=`"text-2xl font-bold text-gray-900 mb-4 flex items-center`">
          <TrendingUp className=`"mr-2 text-primary-600`" />
          Características del Sistema
        </h2>
        <ul className=`"space-y-3 text-gray-700`">
          <li className=`"flex items-start`">
            <span className=`"text-primary-600 mr-2`">✓</span>
            <span><strong>Evaluación Automática:</strong> El sistema evalúa automáticamente 
            la capacidad de pago del solicitante.</span>
          </li>
          <li className=`"flex items-start`">
            <span className=`"text-primary-600 mr-2`">✓</span>
            <span><strong>Score Crediticio:</strong> Se calcula un score de 0 a 100 basado 
            en múltiples factores.</span>
          </li>
          <li className=`"flex items-start`">
            <span className=`"text-primary-600 mr-2`">✓</span>
            <span><strong>Respuesta Inmediata:</strong> Obtén una respuesta al instante sobre 
            la aprobación o rechazo.</span>
          </li>
          <li className=`"flex items-start`">
            <span className=`"text-primary-600 mr-2`">✓</span>
            <span><strong>Dashboard Completo:</strong> Visualiza estadísticas en tiempo real 
            con gráficas interactivas.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Característica
const FeatureCard = ({ icon: Icon, title, description, link, linkText, color }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className=`"card hover:shadow-xl transition-shadow duration-300`">
      <div className={``p-3 rounded-full {colors[color]} w-fit mb-4``}>
        <Icon size={32} />
      </div>
      <h3 className=`"text-2xl font-bold text-gray-900 mb-3`">{title}</h3>
      <p className=`"text-gray-600 mb-6`">{description}</p>
      <Link
        to={link}
        className=`"inline-block btn-primary`"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default Home;
"@ | Out-File -FilePath "src/pages/Home.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/pages/SolicitudPage.jsx
# ============================================
Write-Host "📄 Creando página Solicitud..." -ForegroundColor Yellow

@"
import { useState } from 'react';
import FormularioSolicitud from '../components/solicitud/FormularioSolicitud';
import ResultadoSolicitud from '../components/solicitud/ResultadoSolicitud';
import Alert from '../components/common/Alert';
import { solicitudService } from '../services/solicitudService';

const SolicitudPage = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setResultado(null);

      const response = await solicitudService.crear(formData);
      setResultado(response.data);
    } catch (err) {
      console.error('Error al crear solicitud:', err);
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaSolicitud = () => {
    setResultado(null);
    setError(null);
  };

  return (
    <div className=`"max-w-5xl mx-auto`">
      <div className=`"mb-8`">
        <h1 className=`"text-3xl md:text-4xl font-bold text-gray-900 mb-2`">
          Nueva Solicitud de Crédito
        </h1>
        <p className=`"text-gray-600`">
          Completa el formulario para solicitar tu crédito
        </p>
      </div>

      {error && (
        <div className=`"mb-6`">
          <Alert
            type=`"error`"
            title=`"Error`"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {!resultado ? (
        <FormularioSolicitud onSubmit={handleSubmit} loading={loading} />
      ) : (
        <div>
          <ResultadoSolicitud resultado={resultado} />
          <div className=`"flex justify-center mt-8`">
            <button
              onClick={handleNuevaSolicitud}
              className=`"btn-secondary px-8 py-3 text-lg`"
            >
              Nueva Solicitud
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudPage;
"@ | Out-File -FilePath "src/pages/SolicitudPage.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/pages/EstadisticasPage.jsx
# ============================================
Write-Host "📄 Creando página Estadísticas..." -ForegroundColor Yellow

@"
import Dashboard from '../components/estadisticas/Dashboard';

const EstadisticasPage = () => {
  return (
    <div className=`"max-w-7xl mx-auto`">
      <div className=`"mb-8`">
        <h1 className=`"text-3xl md:text-4xl font-bold text-gray-900 mb-2`">
          Estadísticas y Reportes
        </h1>
        <p className=`"text-gray-600`">
          Visualiza las métricas y estadísticas del sistema
        </p>
      </div>

      <Dashboard />
    </div>
  );
};

export default EstadisticasPage;
"@ | Out-File -FilePath "src/pages/EstadisticasPage.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: src/App.jsx
# ============================================
Write-Host "📄 Creando App.jsx..." -ForegroundColor Yellow

@"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import SolicitudPage from './pages/SolicitudPage';
import EstadisticasPage from './pages/EstadisticasPage';

function App() {
  return (
    <Router>
      <div className=`"min-h-screen bg-gray-50`">
        <Navbar />
        <main className=`"container mx-auto px-4 py-8`">
          <Routes>
            <Route path=`"/`" element={<Home />} />
            <Route path=`"/solicitud`" element={<SolicitudPage />} />
            <Route path=`"/estadisticas`" element={<EstadisticasPage />} />
          </Routes>
        </main>
        
        <footer className=`"bg-white border-t border-gray-200 mt-12`">
          <div className=`"max-w-7xl mx-auto px-4 py-6 text-center text-gray-600`">
            <p>© 2024 Grupo Salinas - Sistema de Solicitud de Crédito</p>
            <p className=`"text-sm mt-2`">Evaluación Técnica - Desarrollado por [Tu Nombre]</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
"@ | Out-File -FilePath "src/App.jsx" -Encoding UTF8

# ============================================
# ARCHIVO: README.md
# ============================================
Write-Host "📄 Creando README.md..." -ForegroundColor Yellow

@"
# Frontend - Sistema de Solicitud de Crédito
## Grupo Salinas - Evaluación Técnica

### 🚀 Tecnologías

- React 18
- Vite
- React Router DOM
- Axios
- TailwindCSS
- Recharts
- Lucide React (iconos)

### 📦 Instalación

1. Instalar dependencias:
``````bash
npm install
``````

2. Configurar variables de entorno:
   - Copiar ``.env.example`` a ``.env``
   - Ajustar la URL de la API si es necesario

3. Iniciar el servidor de desarrollo:
``````bash
npm run dev
``````

### 🌐 Características

- ✅ Formulario de solicitud de crédito con validaciones
- ✅ Resultado inmediato de aprobación/rechazo
- ✅ Dashboard de estadísticas con gráficas
- ✅ Diseño responsivo
- ✅ Navegación con React Router

### 📱 Páginas

1. **Home** - Página de inicio con información
2. **Nueva Solicitud** - Formulario de solicitud
3. **Estadísticas** - Dashboard con métricas

### 🎨 Componentes

- Navbar
- FormularioSolicitud
- ResultadoSolicitud
- Dashboard
- Alert
- Loading

### 🔧 Scripts Disponibles

- ``npm run dev`` - Iniciar desarrollo
- ``npm run build`` - Construir para producción
- ``npm run preview`` - Vista previa de producción
"@ | Out-File -FilePath "README.md" -Encoding UTF8

Write-Host ""
Write-Host "✅ ¡Frontend creado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. cd $projectName" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White
Write-Host "3. Abrir http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Asegúrate de que el backend esté corriendo en http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 ¡Listo para usar!" -ForegroundColor Green