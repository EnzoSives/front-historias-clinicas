export interface Patient {
  id: string; // Kept as it is likely a system identifier
  nombre?: string;
  apellido?: string;
  dni?: string;
  sexo?: string;
  edad?: number;
  fechaNacimiento?: Date;
  lugarNacimiento?: string;
  direccion?: string;
  telefonoFijo?: string;
  telefonoCelular?: string;
  ocupacion?: string;
  estadoCivil?: string;
  obraSocial?: string;
  afiliadoObraSocial?: string;
  antecedentesPersonalesMedicos?: string;
  antecedentesQuirurgicos?: string;
  alergias?: string;
  antecedentesHeredoFamiliares?: string;
  habitosToxicos?: string;
  medicacionHabitual?: string;
  examenFisicoHabito?: string;
  examenFisicoPeso?: number;
  examenFisicoTalla?: number;
  examenFisicoIMC?: number;
  examenFisicoTA?: string;
  examenFisicoFC?: string;
  examenFisicoFR?: string;
  examenFisicoTemperatura?: string;
  examenFisicoSistemaNervioso?: string;
  examenFisicoAPCardiovascular?: string;
  examenFisicoAPRespiratorio?: string;
  examenFisicoAPDigestivo?: string;
  examenFisicoAPGenitourinario?: string;
  examenFisicoSistemaEndocrino?: string;
  examenFisicoSistemaHematopoyetico?: string;
  examenFisicoSistemaMusculoEsqueletico?: string;
  examenFisicoPielAnexos?: string;
  primerObservacion?: string;
  imagen?: string;
  imagen2?: string;
  activo?: boolean;
}

export interface Consultation {
  id: string; // Kept as it is likely a system identifier
  pacienteId: string; // Kept as it is likely a system identifier to link to Patient
  motivoConsulta?: string;
  observaciones?: string;
  fechaConsulta: Date;
  anamnesis?: string;
  examenFisico?: string;
  diagnostico?: string;
  tratamiento?: string;
}

export interface Doctor {
  id: string; // Kept as it is likely a system identifier
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
