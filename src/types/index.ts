export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  medications: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescriptions: string;
  notes: string;
  nextAppointment: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license: string;
}