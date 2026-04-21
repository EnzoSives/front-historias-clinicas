<template>
  <q-card class="patient-card q-ma-sm" flat @click="$emit('select-patient', patient)">
    <!-- Header con banda de color -->
    <div class="patient-card__header">
      <q-avatar size="52px" color="white" text-color="primary" icon="person" class="patient-card__avatar" />
      <div class="patient-card__title">
        <div class="text-subtitle1 text-weight-bold text-white ellipsis">{{ patient.apellido }} {{ patient.nombre }}
        </div>
        <div class="text-caption" style="opacity: 0.85; color: #e8eaf6;">
          <q-icon name="calendar_today" size="10px" class="q-mr-xs" />
          Registrado: {{ formatDate(patient.fechaCreacion ? patient.fechaCreacion.toString() : "") }}
        </div>
      </div>
    </div>

    <!-- Chips de datos -->
    <q-card-section class="q-pt-sm q-pb-sm">
      <div class="row q-gutter-xs">
        <q-chip dense icon="badge" color="primary" text-color="white" class="chip-data">
          {{ patient.dni || 'Sin DNI' }}
        </q-chip>
        <q-chip dense icon="cake" color="indigo-1" text-color="indigo-9" class="chip-data">
          {{ calculateAge(patient.fechaNacimiento ? patient.fechaNacimiento.toString() : "") }} años
        </q-chip>
        <q-chip dense icon="transgender" color="indigo-1" text-color="indigo-9" class="chip-data">
          {{ patient.sexo || 'N/E' }}
        </q-chip>
      </div>
    </q-card-section>

    <!-- Acciones -->
    <q-card-actions align="right" class="q-pa-xs card-footer">
      <q-btn flat round dense color="primary" icon="visibility" @click.stop="$emit('view-history', patient)"
        aria-label="Ver Historial">
        <q-tooltip>Ver Historial</q-tooltip>
      </q-btn>
      <q-btn flat round dense color="orange-8" icon="edit" @click.stop="$emit('edit-patient', patient)"
        aria-label="Editar Paciente">
        <q-tooltip>Editar Paciente</q-tooltip>
      </q-btn>
      <q-btn flat round dense color="deep-purple" icon="picture_as_pdf" @click.stop="downloadPDF(patient.id_paciente)"
        aria-label="Descargar PDF">
        <q-tooltip>Descargar PDF</q-tooltip>
      </q-btn>
      <q-btn flat round dense color="negative" icon="delete" @click.stop="$emit('delete-patient', patient.id_paciente)"
        aria-label="Eliminar Paciente">
        <q-tooltip>Eliminar Paciente</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import type { Patient, Patient as PatientType } from "src/types/index";

interface Props {
  patient: PatientType;
}

const props = defineProps<Props>();

defineEmits<{
  "select-patient": [patient: Patient];
  "view-history": [patient: Patient];
  "edit-patient": [patient: Patient];
  "delete-patient": [patientId: number];
  "new-consultation": [patient: Patient];
}>();

const $q = useQuasar();

const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES");
};

const downloadPDF = async (patientId: number) => {
  try {
    const response = await api.get(`/consulta/pdf/${patientId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historia-clinica-${props.patient.dni}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al descargar el PDF',
      icon: 'report_problem',
    });
  }
};
</script>

<style scoped>
.patient-card {
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(63, 81, 181, 0.25);
}

.patient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
}

.patient-card__header {
  background: #1976D2;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-card__avatar {
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.patient-card__title {
  flex: 1;
  min-width: 0;
}

.card-footer {
  background-color: white;
}

.chip-data {
  font-size: 11px;
  height: 22px;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
