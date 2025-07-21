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

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index' // Asegúrate de usar la interfaz actualizada

interface Props {
  patient: PatientType;
  consultation?: ConsultationType | null;
}

const props = defineProps<Props>()

const loading = ref(false)

const form = reactive({
  fechaConsulta: '', // Renombrado de 'date'
  motivoConsulta: '', // Nuevo campo
  anamnesis: '', // Nuevo campo
  examenFisico: '', // Nuevo campo
  diagnostico: '', // Renombrado de 'diagnosis'
  tratamiento: '', // Renombrado de 'treatment'
  observaciones: '' // Renombrado de 'notes'
})

const isEdit = computed(() => !!props.consultation && !!props.consultation.id)

const populateForm = () => {
  if (isEdit.value && props.consultation) {
    // Populate form with existing consultation data for editing
    form.fechaConsulta = props.consultation.fechaConsulta ? new Date(props.consultation.fechaConsulta).toISOString().slice(0, 16) : '';
    form.motivoConsulta = props.consultation.motivoConsulta || '';
    form.anamnesis = props.consultation.anamnesis || '';
    form.examenFisico = props.consultation.examenFisico || '';
    form.diagnostico = props.consultation.diagnostico || '';
    form.tratamiento = props.consultation.tratamiento || '';
    form.observaciones = props.consultation.observaciones || '';
  } else {
    // Set current date and time as default for new consultation
    const now = new Date();
    form.fechaConsulta = now.toISOString().slice(0, 16);
    // Clear other fields for new consultation
    form.motivoConsulta = '';
    form.anamnesis = '';
    form.examenFisico = '';
    form.diagnostico = '';
    form.tratamiento = '';
    form.observaciones = '';
  }
};

onMounted(() => {
  populateForm();
})

watch(() => props.consultation, () => {
  populateForm();
}, { deep: true });


const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const handleSubmit = async () => {
  loading.value = true

  try {
    const consultationData: ConsultationType = {
      id: isEdit.value && props.consultation ? props.consultation.id : `consultation_${Date.now()}`,
      pacienteId: props.patient.id, // Mantenemos como string en el frontend
      fechaConsulta: form.fechaConsulta,
      motivoConsulta: form.motivoConsulta || undefined, // undefined para que no se envíen strings vacíos
      observaciones: form.observaciones || undefined,
      anamnesis: form.anamnesis || undefined,
      examenFisico: form.examenFisico || undefined,
      diagnostico: form.diagnostico || undefined,
      tratamiento: form.tratamiento || undefined,
      createdAt: isEdit.value && props.consultation ? props.consultation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    emit('save', consultationData)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  cancel: [];
  save: [consultation: ConsultationType];
}>();
</script>