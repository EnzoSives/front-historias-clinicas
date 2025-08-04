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
  imagen?: null | undefined;
  imagen2?: null | undefined;
  fechaCreacion?: Date | undefined;
  activo?: boolean | undefined; // Optional field to indicate if the patient is active
  id_medico?: number | undefined; // Optional field to link to Doctor
}

// src/types/index.ts

export interface Consultation {
  id: number;
  pacienteId: number;
  id_medico?: number;
  motivoConsulta?: string;
  observaciones?: string;
  fechaConsulta: Date;
  // ASEGÚRATE DE QUE ESTA LÍNEA USE 'anamnesis'
  anamnesis?: string;
  examenFisico?: string;
  diagnostico?: string;
  tratamiento?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: number; // Kept as it is likely a system identifier
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  especialidad?: string;
  matricula?: string;
  colegioMedico?: string;
  direccionConsultorio?: string;
  telefonoConsultorio?: string;
  horarioAtencion?: string;
  obrasSocialesAcepta?: string;
  biografia?: string;
  foto?: string;
  activo?: boolean;
}

// Interface to match the 'user' object from the login response
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  medico: Doctor | null;
}
