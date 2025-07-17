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
            v-model="form.nombre"
            label="Nombres"
            filled
            class="col"
            :rules="[val => !!val || 'Nombres requeridos']"
          />
          <q-input
            v-model="form.apellido"
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
            v-model="form.fechaNacimiento"
            label="Fecha de Nacimiento"
            filled
            type="date"
            class="col"
            :rules="[val => !!val || 'Fecha de nacimiento requerida']"
          />
        </div>

        <div class="row q-gutter-md">
          <q-select
            v-model="form.sexo"
            label="Sexo"
            filled
            class="col"
            :options="genderOptions"
            :rules="[val => !!val || 'Sexo requerido']"
          />
          <q-input
            v-model="form.lugarNacimiento"
            label="Lugar de Nacimiento"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <q-input
          v-model="form.direccion"
          label="Dirección"
          filled
          :rules="[val => !!val || 'Dirección requerida']"
        />

        <div class="row q-gutter-md">
          <q-input
            v-model="form.telefonoFijo"
            label="Teléfono Fijo"
            filled
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model="form.telefonoCelular"
            label="Teléfono Celular"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.ocupacion"
            label="Ocupación"
            filled
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model="form.estadoCivil"
            label="Estado Civil"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.obraSocial"
            label="Obra Social"
            filled
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model="form.afiliadoObraSocial"
            label="Afiliado Obra Social"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <q-input
          v-model="form.antecedentesPersonalesMedicos"
          label="Antecedentes Personales Médicos"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Describa antecedentes médicos personales"
        />

        <q-input
          v-model="form.antecedentesQuirurgicos"
          label="Antecedentes Quirúrgicos"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Describa antecedentes quirúrgicos"
        />

        <q-input
          v-model="form.alergias"
          label="Alergias"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Describa las alergias conocidas del paciente"
        />

        <q-input
          v-model="form.antecedentesHeredoFamiliares"
          label="Antecedentes Heredo Familiares"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Describa antecedentes heredo familiares"
        />

        <q-input
          v-model="form.habitosToxicos"
          label="Hábitos Tóxicos"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Describa hábitos tóxicos"
        />

        <q-input
          v-model="form.medicacionHabitual"
          label="Medicamentos Habituales"
          filled
          type="textarea"
          rows="3"
          hint="Opcional: Liste los medicamentos que toma habitualmente"
        />

        <div class="text-h6 text-secondary q-mb-md">Examen Físico</div>
        <q-input
          v-model="form.examenFisicoHabito"
          label="Hábito"
          filled
          hint="Opcional"
        />
        <div class="row q-gutter-md">
          <q-input
            v-model.number="form.examenFisicoPeso"
            label="Peso (kg)"
            filled
            type="number"
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model.number="form.examenFisicoTalla"
            label="Talla (cm)"
            filled
            type="number"
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model.number="form.examenFisicoIMC"
            label="IMC"
            filled
            type="number"
            class="col"
            hint="Opcional"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.examenFisicoTA"
            label="Tensión Arterial (TA)"
            filled
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model="form.examenFisicoFC"
            label="Frecuencia Cardíaca (FC)"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.examenFisicoFR"
            label="Frecuencia Respiratoria (FR)"
            filled
            class="col"
            hint="Opcional"
          />
          <q-input
            v-model="form.examenFisicoTemperatura"
            label="Temperatura (°C)"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

        <q-input
          v-model="form.examenFisicoSistemaNervioso"
          label="Sistema Nervioso"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoAPCardiovascular"
          label="Aparato Cardiovascular"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoAPRespiratorio"
          label="Aparato Respiratorio"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoAPDigestivo"
          label="Aparato Digestivo"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoAPGenitourinario"
          label="Aparato Genitourinario"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoSistemaEndocrino"
          label="Sistema Endocrino"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoSistemaHematopoyetico"
          label="Sistema Hematopoyético"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoSistemaMusculoEsqueletico"
          label="Sistema Músculo Esquelético"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />
        <q-input
          v-model="form.examenFisicoPielAnexos"
          label="Piel y Anexos"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />

        <q-input
          v-model="form.primerObservacion"
          label="Primera Observación"
          filled
          type="textarea"
          rows="3"
          hint="Opcional"
        />

        <div class="row q-gutter-md">
          <q-file
            v-model="form.imagen"
            label="URL Imagen 1"
            filled
            class="col"
            hint="Opcional"
          />
          <q-file
            v-model="form.imagen2"
            label="URL Imagen 2"
            filled
            class="col"
            hint="Opcional"
          />
        </div>

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
            :label="isEdit ? 'Actualizar Paciente' : 'Crear Paciente'"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore' // Import the auth store
import type { Patient as PatientType } from 'src/types/index' // Import the Patient interface

interface Props {
  patient?: PatientType
  isEdit?: boolean
}

const props = defineProps<Props>()

const $q = useQuasar()
const loading = ref(false)
const authStore = useAuthStore() // Use the auth store

const genderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Femenino', value: 'Femenino' },
  { label: 'Otro', value: 'Otro' }
]

const form = reactive<PatientType>({
  id: 0, // Ensure ID is initialized, or handle its generation/assignment appropriately
  id_medico: undefined, // Initialize id_medico
  nombre: undefined,
  apellido: undefined,
  dni: undefined,
  sexo: undefined,
  edad: undefined,
  fechaNacimiento: undefined,
  lugarNacimiento: undefined,
  direccion: undefined,
  telefonoFijo: undefined,
  telefonoCelular: undefined,
  ocupacion: undefined,
  estadoCivil: undefined,
  obraSocial: undefined,
  afiliadoObraSocial: undefined,
  antecedentesPersonalesMedicos: undefined,
  antecedentesQuirurgicos: undefined,
  alergias: undefined,
  antecedentesHeredoFamiliares: undefined,
  habitosToxicos: undefined,
  medicacionHabitual: undefined,
  examenFisicoHabito: undefined,
  examenFisicoPeso: undefined,
  examenFisicoTalla: undefined,
  examenFisicoIMC: undefined,
  examenFisicoTA: undefined,
  examenFisicoFC: undefined,
  examenFisicoFR: undefined,
  examenFisicoTemperatura: undefined,
  examenFisicoSistemaNervioso: undefined,
  examenFisicoAPCardiovascular: undefined,
  examenFisicoAPRespiratorio: undefined,
  examenFisicoAPDigestivo: undefined,
  examenFisicoAPGenitourinario: undefined,
  examenFisicoSistemaEndocrino: undefined,
  examenFisicoSistemaHematopoyetico: undefined,
  examenFisicoSistemaMusculoEsqueletico: undefined,
  examenFisicoPielAnexos: undefined,
  primerObservacion: undefined,
  imagen: undefined,
  imagen2: undefined,
  activo: undefined
})

watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      Object.keys(form).forEach(key => {
        const value = (newPatient as any)[key]
        if (key === 'fechaNacimiento' && value instanceof Date) {
          (form as any)[key] = value.toISOString().slice(0, 10)
        } else {
          (form as any)[key] = value
        }
      })
      // Ensure id_medico is populated if it exists in the patient data (for editing)
      form.id_medico = newPatient.id_medico;
    } else {
      // Clear form for new patient
      Object.keys(form).forEach(key => {
        (form as any)[key] = undefined
      })
      // Set id_medico for new patient from authStore
      form.id_medico = authStore.user?.id;
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  loading.value = true

  // Get medicoId from authStore for the current user
  const medicoId = authStore.user?.id;

  try {
    const patientDataToSend: Partial<PatientType> = {
      nombre: form.nombre || undefined,
      apellido: form.apellido || undefined,
      dni: form.dni || undefined,
      sexo: form.sexo || undefined,
      fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento) : undefined,
      lugarNacimiento: form.lugarNacimiento || undefined,
      direccion: form.direccion || undefined,
      telefonoFijo: form.telefonoFijo || undefined,
      telefonoCelular: form.telefonoCelular || undefined,
      ocupacion: form.ocupacion || undefined,
      estadoCivil: form.estadoCivil || undefined,
      obraSocial: form.obraSocial || undefined,
      afiliadoObraSocial: form.afiliadoObraSocial || undefined,
      antecedentesPersonalesMedicos: form.antecedentesPersonalesMedicos || undefined,
      antecedentesQuirurgicos: form.antecedentesQuirurgicos || undefined,
      alergias: form.alergias || undefined,
      antecedentesHeredoFamiliares: form.antecedentesHeredoFamiliares || undefined,
      habitosToxicos: form.habitosToxicos || undefined,
      medicacionHabitual: form.medicacionHabitual || undefined,
      examenFisicoHabito: form.examenFisicoHabito || undefined,
      examenFisicoPeso: form.examenFisicoPeso || undefined,
      examenFisicoTalla: form.examenFisicoTalla || undefined,
      examenFisicoIMC: form.examenFisicoIMC || undefined,
      examenFisicoTA: form.examenFisicoTA || undefined,
      examenFisicoFC: form.examenFisicoFC || undefined,
      examenFisicoFR: form.examenFisicoFR || undefined,
      examenFisicoTemperatura: form.examenFisicoTemperatura || undefined,
      examenFisicoSistemaNervioso: form.examenFisicoSistemaNervioso || undefined,
      examenFisicoAPCardiovascular: form.examenFisicoAPCardiovascular || undefined,
      examenFisicoAPRespiratorio: form.examenFisicoAPRespiratorio || undefined,
      examenFisicoAPDigestivo: form.examenFisicoAPDigestivo || undefined,
      examenFisicoAPGenitourinario: form.examenFisicoAPGenitourinario || undefined,
      examenFisicoSistemaEndocrino: form.examenFisicoSistemaEndocrino || undefined,
      examenFisicoSistemaHematopoyetico: form.examenFisicoSistemaHematopoyetico || undefined,
      examenFisicoSistemaMusculoEsqueletico: form.examenFisicoSistemaMusculoEsqueletico || undefined,
      examenFisicoPielAnexos: form.examenFisicoPielAnexos || undefined,
      primerObservacion: form.primerObservacion || undefined,
      imagen: form.imagen || undefined,
      imagen2: form.imagen2 || undefined,
      activo: form.activo || undefined,
      // Add medicoId to the payload
      id_medico: medicoId //
    }

    if (props.isEdit && form.id) {
      await api.put(`http://localhost:3000/paciente/${form.id}`, patientDataToSend)
      $q.notify({
        type: 'positive',
        message: 'Paciente actualizado exitosamente!'
      })
    } else {
      await api.post('http://localhost:3000/paciente/crear', patientDataToSend)
      $q.notify({
        type: 'positive',
        message: 'Paciente creado exitosamente!'
      })
    }

    emit('saved')
  } catch (error: any) {
    console.error('Error saving patient:', error.response || error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar el paciente. Intente nuevamente.'
    })
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  cancel: []
  saved: []
}>()
</script>

<style scoped>
/* Add any specific styles for PatientForm here if needed */
</style>