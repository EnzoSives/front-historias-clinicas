<template>
  <q-card class="q-ma-md" style="max-width: 800px">
    <q-card-section>
      <div class="text-h6 text-primary">
        <q-icon name="medical_services" class="q-mr-sm" />
        {{ isEdit ? 'Editar Consulta' : 'Nueva Consulta' }} - {{ patient.nombre }} {{ patient.apellido }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        DNI: {{ patient.dni }} • {{ calculateAge(patient.fechaNacimiento) }} años
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.fechaConsulta"
            label="Fecha de Consulta"
            filled
            type="datetime-local"
            class="col"
            :rules="[val => !!val || 'Fecha de consulta requerida']"
          />
          </div>

        <q-input
          v-model="form.motivoConsulta"
          label="Motivo de Consulta"
          filled
          type="textarea"
          rows="2"
          :rules="[val => !!val || 'Motivo de consulta requerido']"
          hint="Describa el motivo principal de la consulta"
        />

        <q-input
          v-model="form.anamnesis"
          label="Anamnesis"
          filled
          type="textarea"
          rows="4"
          hint="Historial clínico y detalles del padecimiento actual"
        />

        <q-input
          v-model="form.examenFisico"
          label="Examen Físico"
          filled
          type="textarea"
          rows="3"
          hint="Resultados del examen físico"
        />

        <q-input
          v-model="form.diagnostico"
          label="Diagnóstico"
          filled
          type="textarea"
          rows="3"
          :rules="[val => !!val || 'Diagnóstico requerido']"
          hint="Diagnóstico médico basado en los datos"
        />

        <q-input
          v-model="form.tratamiento"
          label="Tratamiento"
          filled
          type="textarea"
          rows="4"
          :rules="[val => !!val || 'Tratamiento requerido']"
          hint="Describa el tratamiento recomendado"
        />

        <q-input
          v-model="form.observaciones"
          label="Observaciones"
          filled
          type="textarea"
          rows="3"
          hint="Notas adicionales sobre la consulta"
        />

        <q-card-actions align="right" class="q-pt-md">
          <q-btn
            flat
            color="grey-7"
            label="Cancelar"
            @click="$emit('cancel')"
          />
          <q-btn
            type="submit"
            color="primary"
            label="Guardar Consulta"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
// Importa el store para obtener el ID del médico
import { useAuthStore } from 'src/stores/authStore';

interface Props {
  patient: PatientType;
  consultation?: ConsultationType | null;
}

const props = defineProps<Props>();

const loading = ref(false);
const authStore = useAuthStore();

// Usamos los nombres de propiedad correctos que espera tu modelo de datos
const form = reactive({
  fechaConsulta: '',
  motivoConsulta: '',
  anamnesis: '',
  enfermedadActual: '', 
  examenFisico: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: ''
});

const isEdit = computed(() => !!props.consultation?.id);

const populateForm = () => {
  const consultation = props.consultation;
  if (isEdit.value && consultation) {
    // Rellenar el formulario para editar
    form.fechaConsulta = consultation.fechaConsulta ? new Date(consultation.fechaConsulta).toISOString().slice(0, 16) : '';
    form.motivoConsulta = consultation.motivoConsulta || '';
    form.examenFisico = consultation.examenFisico || '';
    form.diagnostico = consultation.diagnostico || '';
    form.tratamiento = consultation.tratamiento || '';
    form.anamnesis = consultation.anamnesis || '';
    form.observaciones = consultation.observaciones || '';
  } else {
    // Configurar valores por defecto para una nueva consulta
    form.fechaConsulta = new Date().toISOString().slice(0, 16);
    form.motivoConsulta = '';
    form.examenFisico = '';
    form.anamnesis = '';
    form.diagnostico = '';
    form.tratamiento = '';
    form.observaciones = '';
  }
};

onMounted(populateForm);
watch(() => props.consultation, populateForm, { deep: true, immediate: true });

const calculateAge = (birthDate?: string): number | string => {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// ✅ **FUNCIÓN CORREGIDA**
const handleSubmit = async () => {
  loading.value = true;
  const medicoId = authStore.user?.medico?.id; // Obtener el ID del médico

  try {
    const consultationData: ConsultationType = {
      pacienteId: props.consultation?.pacienteId , 
      id_medico: medicoId, // <-- AÑADIR ESTA LÍNEA
      fechaConsulta: form.fechaConsulta,
      motivoConsulta: form.motivoConsulta || undefined,
      observaciones: form.observaciones || undefined,
      anamnesis: form.anamnesis || undefined,
      examenFisico: form.examenFisico || undefined,
      diagnostico: form.diagnostico || undefined,
      tratamiento: form.tratamiento || undefined,
      createdAt: isEdit.value && props.consultation ? props.consultation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    emit('save', consultationData);
  } finally {
    loading.value = false;
  }
};
const emit = defineEmits<{
  cancel: [];
  // El evento ahora emite un objeto genérico, ya que la estructura completa
  // la devolverá la API.
  save: [consultationPayload: Record<string, any>];
}>();
</script>