import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
import { useAuthStore } from 'src/stores/authStore';

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
    BY_MEDICO: (medicoId: number) => `/consulta/medico/${medicoId}`,
    CREATE: '/consulta/crear',
    UPDATE: (id: number) => `/consulta/${id}`,
    BY_PATIENT: (patientId: string) => `/consulta/paciente/${patientId}`,
  },
} as const;

const STORAGE_KEYS = {
  CONSULTATIONS: 'medical_consultations',
  CONSULTATIONS_ALL: 'medical_consultations_all',
  PATIENTS_CACHE: 'medical_patients_cache',
  LAST_SYNC: 'medical_last_sync',
} as const;

interface MedicalStoreState {
  patients: PatientType[];
  consultations: ConsultationType[];
  consultationsAll: ConsultationType[];
  currentPatient: PatientType | null;
  loading: {
    patients: boolean;
    consultations: boolean;
    consultationsAll: boolean;
    general: boolean;
  };
  errors: {
    patients: string | null;
    consultations: string | null;
    consultationsAll: string | null;
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
    consultationsAll: [],
    currentPatient: null,
    loading: {
      patients: false,
      consultations: false,
      consultationsAll: false,
      general: false,
    },
    errors: {
      patients: null,
      consultations: null,
      consultationsAll: null,
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
    getAllPatients: (state): PatientType[] => state.patients || [],
    getAllConsultations: (state): ConsultationType[] => state.consultationsAll || [],
    getTotalPatients: (state): number => (state.patients || []).length,
    getTotalConsultations: (state): number => (state.consultationsAll || []).length,
    getConsultationsThisMonth(state): number {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return (state.consultationsAll || []).filter(c => {
        const consultationDate = new Date(c.fechaConsulta);
        return consultationDate.getMonth() === currentMonth &&
          consultationDate.getFullYear() === currentYear;
      }).length;
    },
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
      return (state.patients || []).find((p) => p.id_paciente === searchId);
    },
    getConsultationsByPatientId: (state) => (patientId: string | number): ConsultationType[] => {
      const patientIdNum = Number(patientId);
      return (state.consultations || [])
        .filter((c) => c.id_paciente === patientIdNum)
        .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());
    },
    isLoadingAny(state): boolean {
      return state.loading.patients || state.loading.consultations || state.loading.general || state.loading.consultationsAll;
    },
  },

  actions: {
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

    /**
     * Obtiene todas las consultas del médico desde la API.
     */
    async fetchAllConsultations(_forceRefresh = false) {
      const authStore = useAuthStore();
      const medicoId = authStore.user?.medico?.id_medico;

      if (!medicoId) {
        this.setError('consultationsAll', 'No se ha identificado un médico.');
        this.consultationsAll = [];
        return;
      }

      this.setLoading('consultationsAll', true);
      this.setError('consultationsAll', null);
      try {
        const response = await api.get<ConsultationType[]>(API_ENDPOINTS.CONSULTATIONS.BY_MEDICO(medicoId));

        this.consultationsAll = response.data.map(c => ({
          ...c,
          id: c.id || c.id,
          id_paciente: c.id_paciente,
          fechaConsulta: new Date(c.fechaConsulta)
        }));
        this.saveToStorage(STORAGE_KEYS.CONSULTATIONS_ALL, this.consultationsAll);
      } catch (error: any) {
        this.setError('consultationsAll', this.handleApiError(error, 'cargar todas las consultas'));
        throw error;
      } finally {
        this.setLoading('consultationsAll', false);
      }
    },

    async fetchAllPatients(forceRefresh = false) {
      const authStore = useAuthStore();
      const medicoId = authStore.user?.medico?.id_medico;

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

    async addPatient(patientData: Partial<PatientType>) {
      this.setLoading('patients', true);
      this.setError('patients', null);
      try {
        const authStore = useAuthStore();
        const medicoId = authStore.getMedicoId;
        const payload = { ...patientData, ...(medicoId ? { id_medico: medicoId } : {}) };
        const response = await api.post<PatientType>(API_ENDPOINTS.PATIENTS.CREATE, payload);
        this.patients.push(response.data);
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        this.setError('patients', this.handleApiError(error, 'agregar paciente'));
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async updatePatient(id: number, patientData: Partial<PatientType>) {
      this.setLoading('patients', true);
      this.setError('patients', null);
      try {
        const response = await api.patch<PatientType>(
          API_ENDPOINTS.PATIENTS.UPDATE(id),
          patientData
        );
        const index = this.patients.findIndex((p) => p.id_paciente === id);
        if (index !== -1) {
          this.patients[index] = { ...this.patients[index], ...response.data };
        }
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        this.setError('patients', this.handleApiError(error, 'actualizar paciente'));
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async deletePatient(id: number) {
      this.setLoading('patients', true);
      this.setError('patients', null);
      try {
        await api.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
        this.patients = this.patients.filter((p) => p.id_paciente !== id);
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
      } catch (error: any) {
        this.setError('patients', this.handleApiError(error, 'eliminar paciente'));
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
        const existingIndex = patients.findIndex((p) => p.id_paciente === id);
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
            id: apiConsultation.id_consulta || apiConsultation.id,
            id_paciente: apiConsultation.id_paciente,
            id_medico: apiConsultation.id_medico,
            fechaConsulta: new Date(apiConsultation.fechaConsulta),
            motivoConsulta: apiConsultation.motivoConsulta,
            anamnesis: apiConsultation.anamnesis,
            diagnostico: apiConsultation.diagnostico,
            tratamiento: apiConsultation.tratamiento,
            observaciones: apiConsultation.observaciones,
            examenFisico: apiConsultation.examenFisico,
            laboratorios: apiConsultation.laboratorios,
            imagenes: apiConsultation.imagenes,
            createdAt: apiConsultation.createdAt,
            updatedAt: apiConsultation.updatedAt,
          } as ConsultationType;
        });

        const otherConsultations = (this.consultations || []).filter(c => c.id_paciente !== patientId);
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

    async addConsultation(consultationData: FormData): Promise<ConsultationType> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);

      try {
        const response = await api.post<any>(
          API_ENDPOINTS.CONSULTATIONS.CREATE,
          consultationData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const newConsultation: ConsultationType = {
          id: response.data.id_consulta || response.data.id,
          id_paciente: response.data.id_paciente,
          id_medico: response.data.id_medico,
          fechaConsulta: new Date(response.data.fechaConsulta),
          motivoConsulta: response.data.motivoConsulta,
          anamnesis: response.data.anamnesis,
          diagnostico: response.data.diagnostico,
          tratamiento: response.data.tratamiento,
          observaciones: response.data.observaciones,
          examenFisico: response.data.examenFisico,
          laboratorios: response.data.laboratorios,
          imagenes: response.data.imagenes,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        this.consultations.push(newConsultation);
        this.consultationsAll.push(newConsultation);
        this.saveConsultationsToStorage();
        this.saveToStorage(STORAGE_KEYS.CONSULTATIONS_ALL, this.consultationsAll);

        return newConsultation;
      } catch (error: any) {
        this.setError('consultations', this.handleApiError(error, 'crear consulta'));
        throw error;
      } finally {
        this.setLoading('consultations', false);
      }
    },

    async updateConsultation(id: number, consultationData: FormData): Promise<ConsultationType> {
      this.setLoading('consultations', true);
      this.setError('consultations', null);
      try {
        const response = await api.patch<any>(
          API_ENDPOINTS.CONSULTATIONS.UPDATE(id),
          consultationData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updatedConsultation: ConsultationType = {
          id: response.data.id_consulta || response.data.id,
          id_paciente: response.data.id_paciente,
          id_medico: response.data.id_medico,
          fechaConsulta: new Date(response.data.fechaConsulta),
          motivoConsulta: response.data.motivoConsulta,
          anamnesis: response.data.anamnesis,
          diagnostico: response.data.diagnostico,
          tratamiento: response.data.tratamiento,
          observaciones: response.data.observaciones,
          examenFisico: response.data.examenFisico,
          laboratorios: response.data.laboratorios,
          imagenes: response.data.imagenes,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        const index = this.consultations.findIndex(c => c.id === id);
        if (index !== -1) {
          this.consultations[index] = updatedConsultation;
        }
        const allIndex = this.consultationsAll.findIndex(c => c.id === id);
        if (allIndex !== -1) {
          this.consultationsAll[allIndex] = updatedConsultation;
        }
        this.saveConsultationsToStorage();
        this.saveToStorage(STORAGE_KEYS.CONSULTATIONS_ALL, this.consultationsAll);

        return updatedConsultation;
      } catch (error: any) {
        this.setError('consultations', this.handleApiError(error, 'actualizar consulta'));
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
      this.loadAllConsultationsFromStorage();
      try {
        await Promise.all([
          this.fetchAllPatients(forceRefresh),
          this.fetchAllConsultations(forceRefresh)
        ]);
      } catch (error) {
        // Los errores ya se manejan en sus respectivas funciones
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
          if ((key === STORAGE_KEYS.CONSULTATIONS || key === STORAGE_KEYS.CONSULTATIONS_ALL) && Array.isArray(parsed)) {
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
    loadAllConsultationsFromStorage(): void {
      this.consultationsAll = this.loadFromStorage(STORAGE_KEYS.CONSULTATIONS_ALL, []);
    },
    loadPatientsFromStorage(): void {
      this.patients = this.loadFromStorage(STORAGE_KEYS.PATIENTS_CACHE, []);
    },
    clearData(): void {
      this.patients = [];
      this.consultations = [];
      this.consultationsAll = [];
      this.currentPatient = null;
      this.errors = {
        patients: null,
        consultations: null,
        consultationsAll: null,
        general: null,
      };
      this.lastSync = {
        patients: null,
      };

      localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS);
      localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS_ALL);
      localStorage.removeItem(STORAGE_KEYS.PATIENTS_CACHE);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    },

  },
});