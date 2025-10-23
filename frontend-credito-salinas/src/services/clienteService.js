import api from './api';

export const clienteService = {
  /**
   * Buscar clientes por email, nombre o teléfono
   */
  buscar: async (query) => {
    try {
      const response = await api.get('/clientes/buscar', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error buscando clientes');
    }
  },

  /**
   * Obtener historial completo de un cliente
   */
  obtenerHistorial: async (clienteId) => {
    try {
      const response = await api.get(`/clientes/${clienteId}/historial`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo historial');
    }
  },

  /**
   * Obtener cliente por ID
   */
  obtenerPorId: async (clienteId) => {
    try {
      const response = await api.get(`/clientes/${clienteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo cliente');
    }
  }
};

