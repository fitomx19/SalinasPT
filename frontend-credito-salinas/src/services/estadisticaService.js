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
