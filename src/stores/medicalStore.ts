import { reactive } from 'vue'
import { Patient, Consultation } from '../types'

export const medicalStore = reactive({
  patients: [] as Patient[],
  consultations: [] as Consultation[],
  currentPatient: null as Patient | null,

  // Patients methods
  addPatient(patient: Patient) {
    this.patients.push(patient)
    this.saveToStorage()
  },

  updatePatient(updatedPatient: Patient) {
    const index = this.patients.findIndex(p => p.id === updatedPatient.id)
    if (index !== -1) {
      this.patients[index] = updatedPatient
      this.saveToStorage()
    }
  },

  deletePatient(patientId: string) {
    this.patients = this.patients.filter(p => p.id !== patientId)
    this.consultations = this.consultations.filter(c => c.patientId !== patientId)
    this.saveToStorage()
  },

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id)
  },

  // Consultations methods
  addConsultation(consultation: Consultation) {
    this.consultations.push(consultation)
    this.saveToStorage()
  },

  getConsultationsByPatientId(patientId: string): Consultation[] {
    return this.consultations.filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  updateConsultation(updatedConsultation: Consultation) {
    const index = this.consultations.findIndex(c => c.id === updatedConsultation.id)
    if (index !== -1) {
      this.consultations[index] = updatedConsultation
      this.saveToStorage()
    }
  },

  deleteConsultation(consultationId: string) {
    this.consultations = this.consultations.filter(c => c.id !== consultationId)
    this.saveToStorage()
  },

  // Storage methods
  saveToStorage() {
    localStorage.setItem('medical_patients', JSON.stringify(this.patients))
    localStorage.setItem('medical_consultations', JSON.stringify(this.consultations))
  },

  loadFromStorage() {
    const patients = localStorage.getItem('medical_patients')
    const consultations = localStorage.getItem('medical_consultations')
    
    if (patients) {
      this.patients = JSON.parse(patients)
    }
    
    if (consultations) {
      this.consultations = JSON.parse(consultations)
    }
  },

  // Statistics
  getTotalPatients(): number {
    return this.patients.length
  },

  getTotalConsultations(): number {
    return this.consultations.length
  },

  getConsultationsThisMonth(): number {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return this.consultations.filter(c => new Date(c.date) >= firstDayOfMonth).length
  }
})