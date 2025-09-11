// src/types/index.ts
export interface Patient {
  id_paciente: number; // Kept as it is likely a system identifier
  nombre?: string | undefined;
  apellido?: string | undefined;
  dni?: string | undefined;
  sexo?: string | undefined;
  edad?: number | undefined;
  fechaNacimiento?: Date | undefined;
  lugarNacimiento?: string | undefined;
  direccion?: string | undefined;
  telefonoFijo?: string | undefined;
  telefonoCelular?: string | undefined;
  ocupacion?: string | undefined;
  estadoCivil?: string | undefined;
  obraSocial?: string | undefined;
  afiliadoObraSocial?: string | undefined;
  antecedentesPersonalesMedicos?: string | undefined;
  antecedentesQuirurgicos?: string | undefined;
  alergias?: string | undefined;
  antecedentesHeredoFamiliares?: string | undefined;
  habitosToxicos?: string | undefined;
  medicacionHabitual?: string | undefined;
  examenFisicoHabito?: string | undefined;
  examenFisicoPeso?: number | undefined;
  examenFisicoTalla?: number | undefined;
  examenFisicoIMC?: number | undefined;
  examenFisicoTA?: string | undefined;
  examenFisicoFC?: string | undefined;
  examenFisicoFR?: string | undefined;
  examenFisicoTemperatura?: string | undefined;
  examenFisicoSistemaNervioso?: string | undefined;
  examenFisicoAPCardiovascular?: string | undefined;
  examenFisicoAPRespiratorio?: string | undefined;
  examenFisicoAPDigestivo?: string | undefined;
  examenFisicoAPGenitourinario?: string | undefined;
  examenFisicoSistemaEndocrino?: string | undefined;
  examenFisicoSistemaHematopoyetico?: string | undefined;
  examenFisicoSistemaMusculoEsqueletico?: string | undefined;
  examenFisicoPielAnexos?: string | undefined;
  primerObservacion?: string | undefined;
  imagen?: File | null | undefined;
  imagen2?: File | null | undefined;
  imagenes?: PatientImage[] | null | undefined; // Updated to match backend response
  fechaCreacion?: Date | undefined;
  activo?: boolean | undefined; // Optional field to indicate if the patient is active
  id_medico?: number | undefined; // Optional field to link to Doctor
}

// Interfaz para un objeto de imagen individual
export interface PatientImage {
  id: number;
  filename: string;
  path: string;
}
export interface ConsultationImage {
  id: number;
  filename: string;
  path: string;
}

// src/types/index.ts

export interface Consultation {
  id: number;
  id_paciente: number;
  id_medico?: number;
  motivoConsulta?: string | undefined | null;
  observaciones?: string | undefined | null;
  fechaConsulta: Date;
  // ASEGÚRATE DE QUE ESTA LÍNEA USE 'anamnesis'
  anamnesis?: string | undefined | null;
  examenFisico?: string | undefined | null;
  diagnostico?: string | undefined | null;
  tratamiento?: string | undefined | null;
  imagenes?: ConsultationImage[] | null | undefined; // Changed to ConsultationImage[] to match backend response
  createdAt?: string | undefined | null;
  updatedAt?: string | undefined | null;

}

export interface Doctor {
  id_medico: number; // Kept as it is likely a system identifier
  nombre?: string | undefined | null;
  apellido?: string | undefined | null;
  dni?: string | undefined | null;
  telefono?: string | undefined | null;
  especialidad?: string | undefined | null;
  matricula?: string | undefined | null;
  colegioMedico?: string | undefined | null;
  direccionConsultorio?: string | undefined | null;
  telefonoConsultorio?: string | undefined | null;
  horarioAtencion?: string | undefined | null;
  obrasSocialesAcepta?: string | undefined | null;
  biografia?: string | undefined | null;
  foto?: string | undefined | null;
  activo?: boolean | undefined | null;
}

// Interface to match the 'user' object from the login response
export interface AuthUser {
  id: number;
  username: string | undefined | null;
  email: string | undefined | null;
  role: string | undefined | null;
  medico: Doctor | null;
}
