<template>
  <q-card class="patient-card q-ma-sm" flat bordered @click="$emit('select-patient', patient)">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col-auto q-mr-md">
          <q-avatar size="60px" color="indigo-1" text-color="primary" icon="person" />
        </div>
        <div class="col">
          <div class="text-h6 text-primary ellipsis">{{ patient.nombre }} {{ patient.apellido }}</div>
          <div class="text-caption text-grey-7">
            Registrado: {{ formatDate(patient.fechaCreacion ? patient.fechaCreacion.toString() : "") }}
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-chip dense icon="badge" color="grey-2" text-color="grey-9">
        DNI: {{ patient.dni }}
      </q-chip>
      <q-chip dense icon="cake" color="grey-2" text-color="grey-9" class="q-ml-sm">
        {{ calculateAge(patient.fechaNacimiento ? patient.fechaNacimiento.toString() : "") }} años
      </q-chip>
      <q-chip dense icon="transgender" color="grey-2" text-color="grey-9" class="q-ml-sm">
        {{ patient.sexo }}
      </q-chip>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="q-pa-sm">
      <q-btn flat round color="primary" icon="visibility" @click.stop="$emit('view-history', patient)">
        <q-tooltip>Ver Historial</q-tooltip>
      </q-btn>
      <q-btn flat round color="orange" icon="edit" @click.stop="$emit('edit-patient', patient)">
        <q-tooltip>Editar Paciente</q-tooltip>
      </q-btn>
      <q-btn flat round color="purple" icon="picture_as_pdf" @click.stop="downloadPDF(patient.id_paciente)">
        <q-tooltip>Descargar PDF</q-tooltip>
      </q-btn>
      <q-btn flat round color="negative" icon="delete" @click.stop="$emit('delete-patient', patient.id_paciente)">
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
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-left: 5px solid transparent;
  background-color: var(--app-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.patient-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  border-left-color: var(--q-primary);
}

.patient-card:hover .q-avatar {
  transform: scale(1.1);
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Card sections improvements */
.q-card-section {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Separator improvements */
::v-deep .q-separator {
  opacity: 0.5;
}

/* Action buttons improvements */
.q-card-actions {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 4px;
}

.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: scale(1.05);
}

/* Chip styling */
.q-chip {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
}

.q-chip:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>
