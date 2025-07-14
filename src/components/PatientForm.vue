<template>
  <q-card class="q-ma-md" style="max-width: 800px">
    <q-card-section>
      <div class="text-h6 text-primary">
        <q-icon name="person_add" class="q-mr-sm" />
        {{ isEdit ? 'Editar Paciente' : 'Nuevo Paciente' }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.firstName"
            label="Nombres"
            filled
            class="col"
            :rules="[val => !!val || 'Nombres requeridos']"
          />
          <q-input
            v-model="form.lastName"
            label="Apellidos"
            filled
            class="col"
            :rules="[val => !!val || 'Apellidos requeridos']"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.dni"
            label="DNI/Cédula"
            filled
            class="col"
            :rules="[val => !!val || 'DNI requerido']"
          />
          <q-input
            v-model="form.birthDate"
            label="Fecha de Nacimiento"
            filled
            type="date"
            class="col"
            :rules="[val => !!val || 'Fecha de nacimiento requerida']"
          />
        </div>

        <div class="row q-gutter-md">
          <q-select
            v-model="form.gender"
            label="Género"
            filled
            class="col"
            :options="genderOptions"
            :rules="[val => !!val || 'Género requerido']"
          />
          <q-select
            v-model="form.bloodType"
            label="Tipo de Sangre"
            filled
            class="col"
            :options="bloodTypeOptions"
            :rules="[val => !!val || 'Tipo de sangre requerido']"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.phone"
            label="Teléfono"
            filled
            class="col"
            :rules="[val => !!val || 'Teléfono requerido']"
          />
          <q-input
            v-model="form.email"
            label="Email"
            filled
            type="email"
            class="col"
          />
        </div>

        <q-input
          v-model="form.address"
          label="Dirección"
          filled
          :rules="[val => !!val || 'Dirección requerida']"
        />

        <div class="row q-gutter-md">
          <q-input
            v-model="form.emergencyContact"
            label="Contacto de Emergencia"
            filled
            class="col"
            :rules="[val => !!val || 'Contacto de emergencia requerido']"
          />
          <q-input
            v-model="form.emergencyPhone"
            label="Teléfono de Emergencia"
            filled
            class="col"
            :rules="[val => !!val || 'Teléfono de emergencia requerido']"
          />
        </div>

        <q-input
          v-model="form.allergies"
          label="Alergias"
          filled
          type="textarea"
          rows="3"
          hint="Describa las alergias conocidas del paciente"
        />

        <q-input
          v-model="form.medications"
          label="Medicamentos Actuales"
          filled
          type="textarea"
          rows="3"
          hint="Liste los medicamentos que toma actualmente"
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
            :label="isEdit ? 'Actualizar' : 'Crear Paciente'"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Patient } from '../types'

interface Props {
  patient?: Patient
  isEdit?: boolean
}

const props = defineProps<Props>()

const loading = ref(false)

const genderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Femenino', value: 'Femenino' },
  { label: 'Otro', value: 'Otro' }
]

const bloodTypeOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
]

const form = reactive({
  firstName: '',
  lastName: '',
  dni: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  bloodType: '',
  allergies: '',
  medications: ''
})

// Watch for prop changes to populate form
watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      Object.assign(form, newPatient)
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const patientData: Patient = {
      id: props.patient?.id || `patient_${Date.now()}`,
      ...form,
      createdAt: props.patient?.createdAt || new Date().toISOString()
    }
    
    emit('save', patientData)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  cancel: []
  save: [patient: Patient]
}>()
</script>