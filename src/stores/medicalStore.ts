// src/stores/medicalStore.ts
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Patient as PatientType } from 'src/types/index';
import type { Consultation as ConsultationType } from 'src/types/index';

// Constantes para endpoints y configuración
const API_ENDPOINTS = {
  PATIENTS: {
    BASE: '/paciente',
    ALL: '/paciente/all',
    CREATE: '/paciente/crear',
    UPDATE: (id: number) => `/paciente/actualizar/${id}`,
    DELETE: (id: number) => `/paciente/eliminar/${id}`,
    BY_ID: (id: number) => `/paciente/${id}`,
  },
  CONSULTATIONS: {
    BASE: '/consulta',
    BY_PATIENT: (patientId: string) => `/consulta/paciente/${patientId}`,
  }
} as const;

const STORAGE_KEYS = {
  CONSULTATIONS: 'medical_consultations',
  PATIENTS_CACHE: 'medical_patients_cache',
  LAST_SYNC: 'medical_last_sync'
} as const;

// Tipos para mejor tipado
interface ApiError {
  message?: string;
  code?: string;
  details?: any;
}

interface MedicalStoreState {
  // Datos principales
  patients: PatientType[];
  consultations: ConsultationType[];
  currentPatient: PatientType | null;
  
  // Estados de carga
  loading: {
    patients: boolean;
    consultations: boolean;
    general: boolean;
  };
  
  // Gestión de errores mejorada
  errors: {
    patients: string | null;
    consultations: string | null;
    general: string | null;
  };
  
  // Cache y sincronización
  lastSync: {
    patients: Date | null;
    consultations: Date | null;
  };
  
  // Filtros y búsqueda
  filters: {
    patientSearch: string;
    consultationDateRange: {
      start: Date | null;
      end: Date | null;
    };
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
      consultations: null,
    },
    
    filters: {
      patientSearch: '',
      consultationDateRange: {
        start: null,
        end: null,
      },
    },
  }),

  getters: {
    // Getters de pacientes mejorados
    getAllPatients(state): PatientType[] {
      return state.patients;
    },

    getFilteredPatients(state): PatientType[] {
      if (!state.filters.patientSearch.trim()) return state.patients;
      
      const searchTerm = state.filters.patientSearch.toLowerCase();
      return state.patients.filter(patient => 
        patient.nombre?.toLowerCase().includes(searchTerm) ||
        patient.apellido?.toLowerCase().includes(searchTerm) ||
        patient.dni?.toString().includes(searchTerm) ||
        patient.telefonoCelular?.toLowerCase().includes(searchTerm)
      );
    },

    getPatientById: (state) => (id: string | number): PatientType | undefined => {
      const searchId = typeof id === 'string' ? parseInt(id) : id;
      return state.patients.find(p => p.id === searchId);
    },

    // Getters de consultas mejorados
    getAllConsultations(state): ConsultationType[] {
      return state.consultations;
    },

    getConsultationsByPatientId: (state) => (patientId: string): ConsultationType[] => {
      return state.consultations
        .filter(c => c.pacienteId === patientId)
        .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime());
    },

    getFilteredConsultations(state): ConsultationType[] {
      let filtered = state.consultations;
      
      const { start, end } = state.filters.consultationDateRange;
      if (start || end) {
        filtered = filtered.filter(consultation => {
          const consultationDate = new Date(consultation.fechaConsulta);
          const isAfterStart = !start || consultationDate >= start;
          const isBeforeEnd = !end || consultationDate <= end;
          return isAfterStart && isBeforeEnd;
        });
      }
      
      return filtered.sort(
        (a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime()
      );
    },

    // Estados de carga
    isLoadingPatients(state): boolean {
      return state.loading.patients;
    },

    isLoadingConsultations(state): boolean {
      return state.loading.consultations;
    },

    isLoadingAny(state): boolean {
      return state.loading.patients || state.loading.consultations || state.loading.general;
    },

    // Estados de error
    hasErrors(state): boolean {
      return !!(state.errors.patients || state.errors.consultations || state.errors.general);
    },

    getErrorMessages(state): string[] {
      return Object.values(state.errors).filter(Boolean) as string[];
    },

    // Estadísticas mejoradas
    getTotalPatients(state): number {
      return state.patients.length;
    },

    getTotalConsultations(state): number {
      return state.consultations.length;
    },

    getConsultationsThisMonth(state): number {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return state.consultations.filter(
        c => new Date(c.fechaConsulta) >= firstDayOfMonth
      ).length;
    },

    getConsultationsThisWeek(state): number {
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return state.consultations.filter(
        c => new Date(c.fechaConsulta) >= firstDayOfWeek
      ).length;
    },

    getRecentPatients(state): PatientType[] {
      return state.patients
        .sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime())
        .slice(0, 5);
    },

    // Cache status
    isCacheValid: (state) => (type: 'patients' | 'consultations', maxAge = 5 * 60 * 1000): boolean => {
      const lastSync = state.lastSync[type];
      if (!lastSync) return false;
      return Date.now() - lastSync.getTime() < maxAge;
    },
  },

  actions: {
    // Utilidades de error y carga
    setLoading(type: keyof MedicalStoreState['loading'], value: boolean) {
      this.loading[type] = value;
    },

    setError(type: keyof MedicalStoreState['errors'], error: string | null) {
      this.errors[type] = error;
    },

    clearErrors() {
      this.errors = {
        patients: null,
        consultations: null,
        general: null,
      };
    },

    handleApiError(error: any, context: string): string {
      const message = error?.response?.data?.message || 
                    error?.message || 
                    `Error en ${context}`;
      console.error(`${context}:`, error);
      return message;
    },

    // Acciones de pacientes mejoradas
    async fetchAllPatients(forceRefresh = false) {
      if (!forceRefresh && this.isCacheValid('patients')) {
        return this.patients;
      }

      this.setLoading('patients', true);
      this.setError('patients', null);
      
      try {
        const response = await api.get<PatientType[]>(API_ENDPOINTS.PATIENTS.ALL);
        this.patients = response.data;
        this.lastSync.patients = new Date();
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        const errorMessage = this.handleApiError(error, 'cargar pacientes');
        this.setError('patients', errorMessage);
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async addPatient(patientData: Partial<PatientType>): Promise<PatientType> {
      this.setLoading('patients', true);
      this.setError('patients', null);
      
      try {
        const response = await api.post<PatientType>(API_ENDPOINTS.PATIENTS.CREATE, patientData);
        this.patients.push(response.data);
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        const errorMessage = this.handleApiError(error, 'añadir paciente');
        this.setError('patients', errorMessage);
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async updatePatient(id: number, patientData: Partial<PatientType>): Promise<PatientType> {
      this.setLoading('patients', true);
      this.setError('patients', null);
      
      try {
        const response = await api.patch<PatientType>(API_ENDPOINTS.PATIENTS.UPDATE(id), patientData);
        const index = this.patients.findIndex(p => p.id === id);
        
        if (index !== -1) {
          this.patients[index] = { ...this.patients[index], ...response.data };
        }
        
        // Actualizar paciente actual si es el mismo
        if (this.currentPatient?.id === id) {
          this.currentPatient = { ...this.currentPatient, ...response.data };
        }
        
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        const errorMessage = this.handleApiError(error, 'actualizar paciente');
        this.setError('patients', errorMessage);
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async deletePatient(id: number): Promise<void> {
      this.setLoading('patients', true);
      this.setError('patients', null);
      
      try {
        await api.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
        this.patients = this.patients.filter(p => p.id !== id);
        
        // Limpiar paciente actual si es el eliminado
        if (this.currentPatient?.id === id) {
          this.currentPatient = null;
        }
        
        // Eliminar consultas relacionadas
        this.consultations = this.consultations.filter(c => c.pacienteId !== id.toString());
        
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        this.saveConsultationsToStorage();
      } catch (error: any) {
        const errorMessage = this.handleApiError(error, 'eliminar paciente');
        this.setError('patients', errorMessage);
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    async fetchPatientById(id: number, useCache = true): Promise<PatientType> {
      // Buscar en cache primero si está habilitado
      if (useCache) {
        const cachedPatient = this.getPatientById(id);
        if (cachedPatient) return cachedPatient;
      }

      this.setLoading('patients', true);
      this.setError('patients', null);
      
      try {
        const response = await api.get<PatientType>(API_ENDPOINTS.PATIENTS.BY_ID(id));
        
        // Actualizar o agregar al cache
        const existingIndex = this.patients.findIndex(p => p.id === id);
        if (existingIndex !== -1) {
          this.patients[existingIndex] = response.data;
        } else {
          this.patients.push(response.data);
        }
        
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        return response.data;
      } catch (error: any) {
        const errorMessage = this.handleApiError(error, `cargar paciente con ID ${id}`);
        this.setError('patients', errorMessage);
        throw error;
      } finally {
        this.setLoading('patients', false);
      }
    },

    // Acciones de consultas mejoradas
    addConsultation(consultation: ConsultationType): void {
      this.consultations.push(consultation);
      this.saveConsultationsToStorage();
    },

    updateConsultation(updatedConsultation: ConsultationType): boolean {
      const index = this.consultations.findIndex(c => c.id === updatedConsultation.id);
      
      if (index !== -1) {
        this.consultations[index] = updatedConsultation;
        this.saveConsultationsToStorage();
        return true;
      }
      
      return false;
    },

    deleteConsultation(consultationId: number): boolean {
      const initialLength = this.consultations.length;
      this.consultations = this.consultations.filter(c => c.id !== consultationId);
      
      if (this.consultations.length < initialLength) {
        this.saveConsultationsToStorage();
        return true;
      }
      
      return false;
    },

    // Acciones de filtros
    setPatientSearch(search: string): void {
      this.filters.patientSearch = search;
    },

    setConsultationDateRange(start: Date | null, end: Date | null): void {
      this.filters.consultationDateRange = { start, end };
    },

    clearFilters(): void {
      this.filters = {
        patientSearch: '',
        consultationDateRange: {
          start: null,
          end: null,
        },
      };
    },

    // Gestión de paciente actual
    setCurrentPatient(patient: PatientType | null): void {
      this.currentPatient = patient;
    },

    async selectPatientById(id: number): Promise<PatientType | null> {
      try {
        const patient = await this.fetchPatientById(id);
        this.setCurrentPatient(patient);
        return patient;
      } catch (error) {
        console.error('Error selecting patient:', error);
        return null;
      }
    },

    // Métodos de almacenamiento mejorados
    saveToStorage(key: string, data: any): void {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    },

    loadFromStorage<T>(key: string, defaultValue: T): T {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.error('Error loading from storage:', error);
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

    // Inicialización mejorada del store
    async initializeStore(options: { forceRefresh?: boolean } = {}): Promise<void> {
      this.setLoading('general', true);
      this.clearErrors();
      
      try {
        // Cargar datos del storage primero para una carga rápida
        this.loadConsultationsFromStorage();
        this.loadPatientsFromStorage();
        
        // Luego sincronizar con la API
        const promises: Promise<any>[] = [];
        
        if (options.forceRefresh || !this.isCacheValid('patients')) {
          promises.push(this.fetchAllPatients(true));
        }
        
        await Promise.allSettled(promises);
      } catch (error) {
        const errorMessage = this.handleApiError(error, 'inicializar store');
        this.setError('general', errorMessage);
      } finally {
        this.setLoading('general', false);
      }
    },

    // Métodos de utilidad
    async refreshData(): Promise<void> {
      await this.initializeStore({ forceRefresh: true });
    },

    clearAllData(): void {
      this.patients = [];
      this.consultations = [];
      this.currentPatient = null;
      this.clearErrors();
      
      // Limpiar storage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    },

    // Búsqueda avanzada
    searchPatients(query: string): PatientType[] {
      if (!query.trim()) return this.patients;
      
      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      
      return this.patients.filter(patient => {
        const searchableText = [
          patient.nombre,
          patient.apellido,
          patient.dni?.toString(),
          patient.telefonoCelular,
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
    },

    // Exportar datos
    exportData() {
      return {
        patients: this.patients,
        consultations: this.consultations,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    },

    // Importar datos
    importData(data: any) {
      try {
        if (data.patients) this.patients = data.patients;
        if (data.consultations) this.consultations = data.consultations;
        
        this.saveToStorage(STORAGE_KEYS.PATIENTS_CACHE, this.patients);
        this.saveConsultationsToStorage();
        
        return true;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    }
  },
});