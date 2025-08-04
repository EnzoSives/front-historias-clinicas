import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
import { useAuthStore } from 'src/stores/authStore';

// Las constantes y la interfaz de estado no necesitan cambios.
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

    // --- ✅ GETTERS NUEVOS ---
    getAllPatients: (state): PatientType[] => state.patients || [],
    getTotalPatients: (state): number => (state.patients || []).length,
    getTotalConsultations: (state): number => (state.consultations || []).length,
    getConsultationsThisMonth(state): number {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return (state.consultations || []).filter(c => {
        const consultationDate = new Date(c.fechaConsulta);
        return consultationDate.getMonth() === currentMonth &&
          consultationDate.getFullYear() === currentYear;
      }).length;
    },
    // --- FIN DE GETTERS NUEVOS ---

    // Tus getters están bien, no necesitan cambios.
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
      const patientIdNum = Number(patientId);
      return (state.consultations || [])
        .filter((c) => c.pacienteId === patientIdNum)
        .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());
    },
    isLoadingAny(state): boolean {
      return state.loading.patients || state.loading.consultations || state.loading.general;
    },
  },

  actions: {
    // La mayoría de las acciones de utilidad no necesitan cambios.
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
      if (!forceRefresh && isCacheValid && this.patients.length > 0) {
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

    // ... fetchPatientById no necesita cambios ...
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

    // ✅ **ACCIÓN CORREGIDA**
    async fetchConsultationsByPatient(patientId: number): Promise<ConsultationType[]> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);
      try {
        // La respuesta de la API puede tener nombres de propiedad diferentes (ej. id_consulta)
        const response = await api.get<any[]>(API_ENDPOINTS.CONSULTATIONS.BY_PATIENT(String(patientId)));

        // Mapeamos la respuesta de la API a nuestro modelo de datos del frontend (ConsultationType)
        const mappedConsultations = response.data.map(apiConsultation => {
          return {
            id: apiConsultation.id_consulta || apiConsultation.id, // Acepta ambos nombres
            pacienteId: apiConsultation.id_paciente,
            id_medico: apiConsultation.id_medico,
            fechaConsulta: new Date(apiConsultation.fechaConsulta),
            motivoConsulta: apiConsultation.motivoConsulta,
            // Aquí está la clave: leemos 'anamnesis' de la API
            anamnesis: apiConsultation.anamnesis,
            diagnostico: apiConsultation.diagnostico,
            tratamiento: apiConsultation.tratamiento,
            observaciones: apiConsultation.observaciones,
            examenFisico: apiConsultation.examenFisico,
            createdAt: apiConsultation.createdAt,
            updatedAt: apiConsultation.updatedAt,
          } as ConsultationType;
        });

        // Reemplazamos solo las consultas del paciente actual para no afectar a otros datos
        const otherConsultations = (this.consultations || []).filter(c => c.pacienteId !== patientId);
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

    // ✅ **ACCIÓN CORREGIDA**
    async addConsultation(consultationData: Omit<ConsultationType, 'id'>): Promise<ConsultationType> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);

      try {
        // El objeto que enviaremos a la API debe coincidir con el DTO del backend.
        // Usamos toRaw para asegurar que enviamos un objeto JS plano.
        const payload = toRaw(consultationData);

        const response = await api.post<any>(
          API_ENDPOINTS.CONSULTATIONS.CREATE,
          payload
        );

        // Mapeamos la respuesta de la API (que puede tener id_consulta, etc.)
        // a nuestro modelo de datos del frontend.
        const newConsultation: ConsultationType = {
          id: response.data.id_consulta || response.data.id,
          pacienteId: response.data.id_paciente,
          id_medico: response.data.id_medico,
          fechaConsulta: new Date(response.data.fechaConsulta),
          motivoConsulta: response.data.motivoConsulta,
          anamnesis: response.data.anamnesis, // Leemos anamnesis
          diagnostico: response.data.diagnostico,
          tratamiento: response.data.tratamiento,
          observaciones: response.data.observaciones,
          examenFisico: response.data.examenFisico,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

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

    // ... El resto de las acciones no necesitan cambios ...
    async selectPatientById(id: number): Promise<PatientType | null> {
      this.setLoading('general', true);
      this.setError('general', null);
      try {
        const patient = await this.fetchPatientById(id);
        this.setCurrentPatient(patient);
        if (patient) {
          await this.fetchConsultationsByPatient(patient.id_paciente);
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
        // No es necesario establecer un error general aquí si fetchAllPatients ya lo hace.
      } finally {
        this.setLoading('general', false);
      }
    },

    saveToStorage(key: string, data: any): void {
      try {
        localStorage.setItem(key, JSON.stringify(toRaw(data)));
      } catch (error) {
        console.error('Error guardando en localStorage:', error);
      }
    },

    loadFromStorage<T>(key: string, defaultValue: T): T {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convertir fechas de string a Date al cargar
          if (key === STORAGE_KEYS.CONSULTATIONS && Array.isArray(parsed)) {
            return parsed.map(c => ({ ...c, fechaConsulta: new Date(c.fechaConsulta) })) as T;
          }
          return parsed;
        }
        return defaultValue;
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
