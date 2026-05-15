import { api } from '@/lib/api';

export const studentsService = {
  getStudents: async () => {
    const response = await api.get('/students/');
    return response.data.results || response.data;
  },

  createStudent: async (data) => {
    const response = await api.post('/students/', data);
    return response.data;
  },

  uploadPicture: async (studentId, file) => {
    if (!studentId || !file) {
      throw new Error('Faltan datos para subir la imagen.');
    }

    // FormData permite enviar archivos binarios en una petición multipart/form-data
    const formData = new FormData();

    // La clave 'profile_picture' debe coincidir con lo que espera el backend (request.FILES)
    formData.append('profile_picture', file);

    // Llama al action endpoint de DRF: /students/:id/upload-picture/
    // Axios detecta automáticamente el Content-Type multipart/form-data al recibir FormData
    const response = await api.post(
      `/students/${studentId}/upload-picture/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    // Retorna los datos del estudiante actualizado para refrescar la UI
    return response.data;
  },
};
