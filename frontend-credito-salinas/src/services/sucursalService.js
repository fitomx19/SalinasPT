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
