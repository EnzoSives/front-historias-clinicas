// src/stores/patientStore.ts
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios'; // Asumiendo que 'api' es su instancia de Axios
import { Patient as PatientType } from 'src/types/index'; // Asegúrese de que PatientType esté definido

interface PatientStoreState {
  patients: PatientType[];
  loading: boolean;
  error: string | null;
}

export const usePatientStore = defineStore('patient', {
  state: (): PatientStoreState => ({
    patients: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Getter para obtener todos los pacientes
    getAllPatients(state): PatientType[] {
      return state.patients;
    },
    // Getter para verificar si los datos están cargando
    isLoading(state): boolean {
      return state.loading;
    },
    // Getter para obtener cualquier error
    getPatientError(state): string | null {
      return state.error;
    }
  },

  actions: {
    // Acción para cargar todos los pacientes desde la API
    async fetchAllPatients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get<PatientType[]>('http://localhost:3000/paciente/all'); //
        this.patients = response.data;
      } catch (err: any) {
        console.error('Error fetching patients:', err);
        this.error = err.response?.data?.message || 'Error al cargar los pacientes.';
      } finally {
        this.loading = false;
      }
    },

    // Acción para añadir un nuevo paciente
    async addPatient(patientData: Partial<PatientType>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post<PatientType>('http://localhost:3000/paciente/crear', patientData); //
        this.patients.push(response.data); // Añade el nuevo paciente a la lista local
        return response.data;
      } catch (err: any) {
        console.error('Error adding patient:', err);
        this.error = err.response?.data?.message || 'Error al añadir el paciente.';
        throw err; // Relanza el error para que el componente que llama lo pueda manejar
      } finally {
        this.loading = false;
      }
    },

    // Acción para actualizar un paciente existente
    async updatePatient(id: number, patientData: Partial<PatientType>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.patch<PatientType>(`http://localhost:3000/paciente/actualizar/${id}`, patientData); //
        // Actualiza el paciente en la lista local
        const index = this.patients.findIndex(p => p.id === id);
        if (index !== -1) {
          this.patients[index] = response.data;
        }
        return response.data;
      } catch (err: any) {
        console.error('Error updating patient:', err);
        this.error = err.response?.data?.message || 'Error al actualizar el paciente.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Acción para eliminar un paciente
    async deletePatient(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`http://localhost:3000/paciente/eliminar/${id}`); //
        // Elimina el paciente de la lista local
        this.patients = this.patients.filter(p => p.id !== id);
      } catch (err: any) {
        console.error('Error deleting patient:', err);
        this.error = err.response?.data?.message || 'Error al eliminar el paciente.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Puedes añadir más acciones para obtener un paciente por ID, etc.
    async fetchPatientById(id: number) {
        this.loading = true;
        this.error = null;
        try {
            const response = await api.get<PatientType>(`http://localhost:3000/paciente/${id}`); //
            // Opcional: podrías añadir este paciente a una lista de pacientes individuales si tu UI lo requiere
            return response.data;
        } catch (err: any) {
            console.error(`Error fetching patient with ID ${id}:`, err);
            this.error = err.response?.data?.message || `Error al cargar el paciente con ID ${id}.`;
            throw err;
        } finally {
            this.loading = false;
        }
    }
  },
});