// ✅ **PASO 1: Importar 'toRaw' de Vue**
import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
import { useAuthStore } from 'src/stores/authStore';

// (El resto de tus constantes no cambia)
const API_ENDPOINTS = {
  PATIENTS: {
    BASE: '/paciente',
    BY_MEDICO: (medicoId: number) => `/paciente/medico/${medicoId}`,
    CREATE: '/paciente/crear',
    UPDATE: (id: number) => `/paciente/actualizar/${id}`,
    DELETE: (id: number) => `/paciente/eliminar/${id}`,
    BY_ID: (id: number) => `/paciente/${id}`,
  },
  CONSULTATIONS: {
    BASE: '/consulta',
    CREATE: '/consulta/crear',
    BY_PATIENT: (patientId: string) => `/consulta/paciente/${patientId}`,
  },
} as const;

const STORAGE_KEYS = {
  CONSULTATIONS: 'medical_consultations',
  PATIENTS_CACHE: 'medical_patients_cache',
  LAST_SYNC: 'medical_last_sync',
} as const;

interface MedicalStoreState {
  patients: PatientType[];
  consultations: ConsultationType[];
  currentPatient: PatientType | null;
  loading: {
    patients: boolean;
    consultations: boolean;
    general: boolean;
  };
  errors: {
    patients: string | null;
    consultations: string | null;
    general: string | null;
  };
  lastSync: {
    patients: Date | null;
  };
  filters: {
    patientSearch: string;
  };
}

export const useMedicalStore = defineStore('medical', {
  state: (): MedicalStoreState => ({
    patients: [],
    consultations: [],
    currentPatient: null,
    loading: {
      patients: false,
      consultations: false,
      general: false,
    },
    errors: {
      patients: null,
      consultations: null,
      general: null,
    },
    lastSync: {
      patients: null,
    },
    filters: {
      patientSearch: '',
    },
  }),

  getters: {
    // (Tus getters no cambian)
    getFilteredPatients(state): PatientType[] {
      const patients = state.patients || [];
      if (!state.filters.patientSearch.trim()) {
        return patients;
      }
      const searchTerm = state.filters.patientSearch.toLowerCase();
      return patients.filter(
        (patient) =>
          patient.nombre?.toLowerCase().includes(searchTerm) ||
          patient.apellido?.toLowerCase().includes(searchTerm) ||
          patient.dni?.toString().includes(searchTerm)
      );
    },
    getPatientById: (state) => (id: string | number): PatientType | undefined => {
      const searchId = typeof id === 'string' ? parseInt(id, 10) : id;
      return (state.patients || []).find((p) => p.id === searchId);
    },
    getConsultationsByPatientId: (state) => (patientId: string | number): ConsultationType[] => {
      const patientIdStr = String(patientId);
      return (state.consultations || [])
        .filter((c) => String(c.pacienteId) === patientIdStr)
        .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());
    },
    isLoadingAny(state): boolean {
      return state.loading.patients || state.loading.consultations || state.loading.general;
    },
  },

  actions: {
    // (La mayoría de tus acciones no cambian)
    setLoading(type: keyof MedicalStoreState['loading'], value: boolean) {
      this.loading[type] = value;
    },
    setError(type: keyof MedicalStoreState['errors'], error: string | null) {
      this.errors[type] = error;
    },
    handleApiError(error: any, context: string): string {
      const message = error?.response?.data?.message || error?.message || `Error en ${context}`;
      console.error(`API Error en ${context}:`, error);
      return message;
    },

    async fetchAllPatients(forceRefresh = false) {
      const authStore = useAuthStore();
      const medicoId = authStore.user?.id;

      if (!medicoId) {
        this.setError('patients', 'No se ha identificado un médico.');
        this.patients = [];
        return;
      }

      const isCacheValid = this.lastSync.patients && (Date.now() - this.lastSync.patients.getTime() < 5 * 60 * 1000);
      if (!forceRefresh && isCacheValid) {
        return;
      }

      this.setLoading('patients', true);
      this.setError('patients', null);
      try {
        const response = await api.get<PatientType[]>(API_ENDPOINTS.PATIENTS.BY_MEDICO(medicoId));
        this.patients = response.data;
        this.lastSync.patients = new Date();
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
      } catch (error: any) {
        this.setError('patients', this.handleApiError(error, 'cargar pacientes'));
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async fetchPatientById(id: number, useCache = true): Promise<PatientType> {
      if (useCache) {
        const cachedPatient = this.getPatientById(id);
        if (cachedPatient) return cachedPatient;
      }

      this.setLoading('patients', true);
      try {
        const response = await api.get<PatientType>(API_ENDPOINTS.PATIENTS.BY_ID(id));
        const patients = this.patients || [];
        const existingIndex = patients.findIndex((p) => p.id === id);
        if (existingIndex !== -1) {
          this.patients[existingIndex] = response.data;
        } else {
          this.patients.push(response.data);
        }
        return response.data;
      } catch (error) {
        this.setError('patients', this.handleApiError(error, `cargar paciente ${id}`));
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async fetchConsultationsByPatient(patientId: number): Promise<ConsultationType[]> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);
      try {
        const response = await api.get<any[]>(API_ENDPOINTS.CONSULTATIONS.BY_PATIENT(String(patientId)));

        const mappedConsultations = response.data.map(apiConsultation => {
          return {
            id: apiConsultation.id_consulta,
            pacienteId: apiConsultation.id_paciente,
            medicoId: apiConsultation.id_medico,
            fechaConsulta: apiConsultation.fechaConsulta,
            motivoConsulta: apiConsultation.motivoConsulta,
            enfermedadActual: apiConsultation.anamnesis,
            diagnostico: apiConsultation.diagnostico,
            tratamiento: apiConsultation.tratamiento,
            observaciones: apiConsultation.observaciones,
            fechaCreacion: apiConsultation.fechaCreacion,
          } as ConsultationType;
        });

        const otherConsultations = (this.consultations || []).filter(c => String(c.pacienteId) !== String(patientId));
        this.consultations = [...otherConsultations, ...mappedConsultations];
        this.saveConsultationsToStorage();
        return mappedConsultations;
      } catch (error: any) {
        this.setError('consultations', this.handleApiError(error, `cargar consultas del paciente ${patientId}`));
        throw error;
      } finally {
        this.setLoading('consultations', false);
      }
    },

    async addConsultation(consultationData: ConsultationType): Promise<ConsultationType> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);

      try {
        // La API debería recibir el objeto y crear la consulta
        const response = await api.post<any>(
          API_ENDPOINTS.CONSULTATIONS.CREATE, // Asegúrate de que este endpoint exista
          toRaw(consultationData)
        );

        // Mapeamos la respuesta de la API para que coincida con nuestro modelo de datos
        const newConsultation = {
          id: response.data.id_consulta,
          pacienteId: response.data.id_paciente,
          medicoId: response.data.id_medico,
          fechaConsulta: response.data.fechaConsulta,
          motivoConsulta: response.data.motivoConsulta,
          enfermedadActual: response.data.anamnesis,
          diagnostico: response.data.diagnostico,
          tratamiento: response.data.tratamiento,
          observaciones: response.data.observaciones,
          fechaCreacion: response.data.fechaCreacion,
        } as ConsultationType;

        // Añadimos la nueva consulta (ya con su ID real) al estado local
        this.consultations.push(newConsultation);
        this.saveConsultationsToStorage();

        return newConsultation;
      } catch (error: any) {
        this.setError('consultations', this.handleApiError(error, 'crear consulta'));
        throw error;
      } finally {
        this.setLoading('consultations', false);
      }
    },

    async selectPatientById(id: number): Promise<PatientType | null> {
      this.setLoading('general', true);
      this.setError('general', null);
      try {
        const patient = await this.fetchPatientById(id);
        this.setCurrentPatient(patient);
        if (patient) {
          await this.fetchConsultationsByPatient(patient.id);
        }
        return patient;
      } catch (error) {
        this.setError('general', this.handleApiError(error, `seleccionar paciente ${id}`));
        this.setCurrentPatient(null);
        return null;
      } finally {
        this.setLoading('general', false);
      }
    },

    setCurrentPatient(patient: PatientType | null): void {
      this.currentPatient = patient;
    },

    setPatientSearch(search: string): void {
      this.filters.patientSearch = search;
    },

    async initializeStore(forceRefresh = false): Promise<void> {
      this.setLoading('general', true);
      this.loadPatientsFromStorage();
      this.loadConsultationsFromStorage();
      try {
        await this.fetchAllPatients(forceRefresh);
      } catch (error) {
        this.setError('general', this.handleApiError(error, 'inicializar store'));
      } finally {
        this.setLoading('general', false);
      }
    },

    // ✅ **PASO 2: Modificar esta acción**
    saveToStorage(key: string, data: any): void {
      try {
        // Usamos toRaw para obtener el objeto JavaScript puro antes de guardarlo
        localStorage.setItem(key, JSON.stringify(toRaw(data)));
      } catch (error) {
        console.error('Error guardando en localStorage:', error);
      }
    },

    loadFromStorage<T>(key: string, defaultValue: T): T {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.error('Error cargando desde localStorage:', error);
        return defaultValue;
      }
    },
    saveConsultationsToStorage(): void {
      this.saveToStorage(STORAGE_KEYS.CONSULTATIONS, this.consultations);
    },
    loadConsultationsFromStorage(): void {
      this.consultations = this.loadFromStorage(STORAGE_KEYS.CONSULTATIONS, []);
    },
    loadPatientsFromStorage(): void {
      this.patients = this.loadFromStorage(STORAGE_KEYS.PATIENTS_CACHE, []);
    },
  },
});