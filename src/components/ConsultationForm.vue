<template>
  <q-card class="q-ma-md" style="max-width: 800px">
    <q-card-section>
      <div class="text-h6 text-primary">
        <q-icon name="medical_services" class="q-mr-sm" />
        {{ isEdit ? 'Editar Consulta' : 'Nueva Consulta' }} - {{ patient?.nombre }} {{ patient?.apellido }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        DNI: {{ patient?.dni ?? 'N/A' }} • {{ calculateAge(patient?.fechaNacimiento?.toString()) }} años
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input v-model="form.fechaConsulta" label="Fecha de Consulta" filled type="datetime-local" class="col"
            :rules="[val => !!val || 'Fecha de consulta requerida']" />
        </div>

        <q-input v-model="form.motivoConsulta" label="Motivo de Consulta" filled type="textarea" rows="2"
          :rules="[val => !!val || 'Motivo de consulta requerido']"
          hint="Describa el motivo principal de la consulta" />

        <q-input v-model="form.anamnesis" label="Anamnesis" filled type="textarea" rows="4"
          hint="Historial clínico y detalles del padecimiento actual" />

        <q-input v-model="form.examenFisico" label="Examen Físico" filled type="textarea" rows="3"
          hint="Resultados del examen físico" />

        <q-input v-model="form.diagnostico" label="Diagnóstico" filled type="textarea" rows="3"
          :rules="[val => !!val || 'Diagnóstico requerido']" hint="Diagnóstico médico basado en los datos" />

        <q-input v-model="form.tratamiento" label="Tratamiento" filled type="textarea" rows="4"
          :rules="[val => !!val || 'Tratamiento requerido']" hint="Describa el tratamiento recomendado" />

        <q-input v-model="form.observaciones" label="Observaciones" filled type="textarea" rows="3"
          hint="Notas adicionales sobre la consulta" />

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn type="submit" color="primary" label="Guardar Consulta" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
import { useAuthStore } from 'src/stores/authStore';

interface Props {
  patient: PatientType | null;
  consultation?: ConsultationType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [];
  save: [consultationPayload: Record<string, any>];
}>();

const loading = ref(false);
const authStore = useAuthStore();

const form = reactive({
  fechaConsulta: '',
  motivoConsulta: '',
  anamnesis: '',
  examenFisico: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: ''
});

const isEdit = computed(() => !!props.consultation?.id);

const populateForm = () => {
  const consultation = props.consultation;
  if (isEdit.value && consultation) {
    form.fechaConsulta = consultation.fechaConsulta ? new Date(consultation.fechaConsulta).toISOString().slice(0, 16) : '';
    form.motivoConsulta = consultation.motivoConsulta || '';
    form.examenFisico = consultation.examenFisico || '';
    form.diagnostico = consultation.diagnostico || '';
    form.tratamiento = consultation.tratamiento || '';
    form.anamnesis = consultation.anamnesis || '';
    form.observaciones = consultation.observaciones || '';
  } else {
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

const handleSubmit = async () => {
  loading.value = true;

  // ✅ CORRECCIÓN: Verifica la ruta correcta para el ID del médico y obtén el valor.
  // Es más probable que sea `authStore.user?.id` o `authStore.user?.id_medico`
  const medicoId = authStore.user?.medico?.id_medico;

  if (!medicoId) {
    console.error("Error: No se pudo obtener el ID del médico. Revisa el authStore.");
    loading.value = false;
    // Opcional: notificar al usuario con un diálogo de error.
    return;
  }

  try {
    // Usamos Partial<ConsultationType> porque no enviaremos todas las propiedades siempre.
    const payload: Partial<ConsultationType> = {
      id_medico: medicoId,
      fechaConsulta: new Date(form.fechaConsulta),
      motivoConsulta: form.motivoConsulta || undefined,
      observaciones: form.observaciones || undefined,
      anamnesis: form.anamnesis || undefined,
      examenFisico: form.examenFisico || undefined,
      diagnostico: form.diagnostico || undefined,
      tratamiento: form.tratamiento || undefined,
    };

    // Solo agrega id_paciente si está definido
    if (props.patient?.id_paciente !== undefined) {
      (payload as any).id_paciente = props.patient.id_paciente;
    }

    // ✅ CORRECCIÓN 2: Si estamos editando, añade el ID de la consulta al payload.
    if (isEdit.value && props.consultation) {
      payload.id = props.consultation.id;
    }

    emit('save', payload);

  } finally {
    loading.value = false;
  }
};
</script>