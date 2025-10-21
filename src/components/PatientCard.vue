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
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border-left: 5px solid transparent;
  background-color: var(--app-white);
}

.patient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  border-left-color: var(--q-primary);
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
