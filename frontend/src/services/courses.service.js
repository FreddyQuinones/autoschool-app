import { api } from '@/lib/api';

// Servicio que encapsula todas las llamadas HTTP al endpoint /api/courses/
export const coursesService = {
  // Obtiene la lista completa de cursos
  getCourses: async () => {
    const response = await api.get('/courses/');
    // DRF devuelve { results: [...] } cuando hay paginación, o [...] directamente si no
    return response.data.results || response.data;
  },

  // Crea un nuevo curso con los datos del formulario
  createCourse: async (data) => {
    const response = await api.post('/courses/', data);
    return response.data;
  },

  // Reemplaza todos los campos de un curso (PUT = actualización completa)
  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}/`, data);
    return response.data;
  },

  // Elimina un curso por su id
  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}/`);
  },
};
