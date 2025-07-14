import { reactive } from "vue";
import type { Patient as PatientType } from "src/types/index";
import type { Consultation as ConsultationType } from "src/types/index";

export const medicalStore = reactive({
  patients: [] as PatientType[],
  consultations: [] as ConsultationType[],
  currentPatient: null as PatientType | null,

  // Patients methods
  addPatient(patient: PatientType) {
    this.patients.push(patient);
    this.saveToStorage();
  },

  updatePatient(updatedPatient: PatientType) {
    const index = this.patients.findIndex((p) => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patients[index] = updatedPatient;
      this.saveToStorage();
    }
  },

  deletePatient(patientId: string) {
    this.patients = this.patients.filter((p) => p.id !== patientId);
    this.consultations = this.consultations.filter(
      (c) => c.pacienteId !== patientId
    );
    this.saveToStorage();
  },

  getPatientById(id: string): PatientType | undefined {
    return this.patients.find((p) => p.id === id);
  },

  // Consultations methods
  addConsultation(consultation: ConsultationType) {
    this.consultations.push(consultation);
    this.saveToStorage();
  },

  getConsultationsByPatientId(patientId: string): ConsultationType[] {
    return this.consultations
      .filter((c) => c.pacienteId === patientId)
      .sort(
        (a, b) =>
          new Date(b.fechaConsulta).getTime() -
          new Date(a.fechaConsulta).getTime()
      );
  },

  updateConsultation(updatedConsultation: ConsultationType) {
    const index = this.consultations.findIndex(
      (c) => c.id === updatedConsultation.id
    );
    if (index !== -1) {
      this.consultations[index] = updatedConsultation;
      this.saveToStorage();
    }
  },

  deleteConsultation(consultationId: string) {
    this.consultations = this.consultations.filter(
      (c) => c.id !== consultationId
    );
    this.saveToStorage();
  },

  // Storage methods
  saveToStorage() {
    localStorage.setItem("medical_patients", JSON.stringify(this.patients));
    localStorage.setItem(
      "medical_consultations",
      JSON.stringify(this.consultations)
    );
  },

  loadFromStorage() {
    const patients = localStorage.getItem("medical_patients");
    const consultations = localStorage.getItem("medical_consultations");

    if (patients) {
      this.patients = JSON.parse(patients);
    }

    if (consultations) {
      this.consultations = JSON.parse(consultations);
    }
  },

  // Statistics
  getTotalPatients(): number {
    return this.patients.length;
  },

  getTotalConsultations(): number {
    return this.consultations.length;
  },

  getConsultationsThisMonth(): number {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.consultations.filter(
      (c) => new Date(c.fechaConsulta) >= firstDayOfMonth
    ).length;
  },
});
