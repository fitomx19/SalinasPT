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
