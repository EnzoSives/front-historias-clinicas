<template>
  <q-card class="q-ma-md" style="max-width: 800px">
    <q-card-section>
      <div class="text-h6 text-primary">
        <q-icon name="medical_services" class="q-mr-sm" />
        Nueva Consulta - {{ patient.firstName }} {{ patient.lastName }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        DNI: {{ patient.dni }} • {{ calculateAge(patient.birthDate) }} años
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.date"
            label="Fecha de Consulta"
            filled
            type="datetime-local"
            class="col"
            :rules="[val => !!val || 'Fecha de consulta requerida']"
          />
          <q-input
            v-model="form.nextAppointment"
            label="Próxima Cita"
            filled
            type="datetime-local"
            class="col"
            hint="Opcional"
          />
        </div>

        <q-input
          v-model="form.symptoms"
          label="Síntomas"
          filled
          type="textarea"
          rows="4"
          :rules="[val => !!val || 'Síntomas requeridos']"
          hint="Describa los síntomas que presenta el paciente"
        />

        <q-input
          v-model="form.diagnosis"
          label="Diagnóstico"
          filled
          type="textarea"
          rows="3"
          :rules="[val => !!val || 'Diagnóstico requerido']"
          hint="Diagnóstico médico basado en los síntomas"
        />

        <q-input
          v-model="form.treatment"
          label="Tratamiento"
          filled
          type="textarea"
          rows="4"
          :rules="[val => !!val || 'Tratamiento requerido']"
          hint="Describa el tratamiento recomendado"
        />

        <q-input
          v-model="form.prescriptions"
          label="Prescripciones"
          filled
          type="textarea"
          rows="3"
          hint="Medicamentos prescritos con dosis y frecuencia"
        />

        <q-input
          v-model="form.notes"
          label="Notas Adicionales"
          filled
          type="textarea"
          rows="3"
          hint="Observaciones adicionales sobre la consulta"
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
import { ref, reactive, onMounted } from 'vue'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index'

interface Props {
  patient: PatientType
}

const props = defineProps<Props>()

const loading = ref(false)

const form = reactive({
  date: '',
  symptoms: '',
  diagnosis: '',
  treatment: '',
  prescriptions: '',
  notes: '',
  nextAppointment: ''
})

onMounted(() => {
  // Set current date and time as default
  const now = new Date()
  form.date = now.toISOString().slice(0, 16)
})

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
    const consultationData: Consultation = {
      id: `consultation_${Date.now()}`,
      patientId: props.patient.id,
      ...form,
      createdAt: new Date().toISOString()
    }

    emit('save', consultationData)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  cancel: []
  save: [consultation: Consultation]
}>()
</script>
