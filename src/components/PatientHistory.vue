<template>
  <div class="patient-history">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="col">
            <div class="text-h5 text-primary">
              <q-icon name="history" class="q-mr-sm" />
              Historial Médico
            </div>
            <div class="text-h6">{{ patient.firstName }} {{ patient.lastName }}</div>
            <div class="text-subtitle2 text-grey-7">
              DNI: {{ patient.dni }} • {{ calculateAge(patient.birthDate) }} años • {{ patient.gender }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="Nueva Consulta"
              @click="$emit('new-consultation', patient)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Patient Details -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary q-mb-md">
          <q-icon name="person" class="q-mr-sm" />
          Información del Paciente
        </div>

        <div class="row q-gutter-md">
          <div class="col-12 col-md-6">
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="phone" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Teléfono</q-item-label>
                  <q-item-label caption>{{ patient.phone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="email" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Email</q-item-label>
                  <q-item-label caption>{{ patient.email || 'No especificado' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="location_on" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Dirección</q-item-label>
                  <q-item-label caption>{{ patient.address }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-6">
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="bloodtype" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tipo de Sangre</q-item-label>
                  <q-item-label caption>{{ patient.bloodType }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="emergency" color="orange" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Contacto de Emergencia</q-item-label>
                  <q-item-label caption>{{ patient.emergencyContact }} - {{ patient.emergencyPhone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="calendar_today" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Registrado</q-item-label>
                  <q-item-label caption>{{ formatDate(patient.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Medical Information -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary q-mb-md">
          <q-icon name="medical_information" class="q-mr-sm" />
          Información Médica
        </div>

        <div class="row q-gutter-md">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-weight-medium text-negative">
                  <q-icon name="warning" class="q-mr-sm" />
                  Alergias
                </div>
                <div class="q-mt-sm">
                  {{ patient.allergies || 'No se reportan alergias' }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-weight-medium text-info">
                  <q-icon name="medication" class="q-mr-sm" />
                  Medicamentos Actuales
                </div>
                <div class="q-mt-sm">
                  {{ patient.medications || 'No toma medicamentos actualmente' }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Consultations History -->
    <q-card>
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="col">
            <div class="text-h6 text-primary">
              <q-icon name="history_edu" class="q-mr-sm" />
              Historial de Consultas ({{ consultations.length }})
            </div>
          </div>
          <div class="col-auto">
            <q-btn-toggle
              v-model="sortOrder"
              :options="sortOptions"
              color="primary"
              flat
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="consultations.length === 0" class="text-center text-grey-6 q-pa-lg">
          <q-icon name="medical_services" size="64px" />
          <div class="q-mt-md">No hay consultas registradas</div>
          <div class="text-caption">Las consultas aparecerán aquí una vez que sean creadas</div>
        </div>

        <div v-else>
          <ConsultationCard
            v-for="consultation in sortedConsultations"
            :key="consultation.id"
            :consultation="consultation"
            @edit="$emit('edit-consultation', $event)"
            @delete="$emit('delete-consultation', $event)"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index'
import ConsultationCard from 'src/components/ConsultationCard.vue'

interface Props {
  patient: PatientType
  consultations: ConsultationType[]
}

const props = defineProps<Props>()

defineEmits<{
  'new-consultation': [patient: PatientType]
  'edit-consultation': [consultation: ConsultationType]
  'delete-consultation': [consultationId: string]
}>()

const sortOrder = ref('newest')

const sortOptions = [
  { label: 'Más reciente', value: 'newest' },
  { label: 'Más antiguo', value: 'oldest' }
]

const sortedConsultations = computed(() => {
  const sorted = [...props.consultations]

  if (sortOrder.value === 'newest') {
    return sorted.sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime())
  } else {
    return sorted.sort((a, b) => new Date(a.fechaConsulta).getTime() - new Date(b.fechaConsulta).getTime())
  }
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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.patient-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>
