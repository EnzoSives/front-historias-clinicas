<template>
  <div class="dashboard">
    <div class="row q-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="stat-card bg-primary text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h4">{{ totalPatients }}</div>
                <div class="text-subtitle1">Pacientes Registrados</div>
              </div>
              <div class="col-auto">
                <q-icon name="people" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="stat-card bg-secondary text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h4">{{ totalConsultations }}</div>
                <div class="text-subtitle1">Total Consultas</div>
              </div>
              <div class="col-auto">
                <q-icon name="medical_services" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="stat-card bg-positive text-white">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h4">{{ consultationsThisMonth }}</div>
                <div class="text-subtitle1">Consultas este Mes</div>
              </div>
              <div class="col-auto">
                <q-icon name="calendar_month" size="48px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-primary">
              <q-icon name="trending_up" class="q-mr-sm" />
              Pacientes Recientes
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div v-if="recentPatients.length === 0" class="text-center text-grey-6">
              No hay pacientes registrados
            </div>
            <q-list v-else>
              <q-item
                v-for="patient in recentPatients"
                :key="patient.id"
                clickable
                @click="$emit('select-patient', patient)"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="person" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ patient.firstName }} {{ patient.lastName }}</q-item-label>
                  <q-item-label caption>{{ patient.dni }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ formatDate(patient.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-primary">
              <q-icon name="schedule" class="q-mr-sm" />
              Consultas Recientes
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div v-if="recentConsultations.length === 0" class="text-center text-grey-6">
              No hay consultas registradas
            </div>
            <q-list v-else>
              <q-item
                v-for="consultation in recentConsultations"
                :key="consultation.id"
                clickable
                @click="$emit('view-consultation', consultation)"
              >
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white">
                    <q-icon name="medical_services" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ getPatientName(consultation.patientId) }}</q-item-label>
                  <q-item-label caption>{{ consultation.diagnosis }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ formatDate(consultation.date) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { medicalStore } from 'src/stores/medicalStore.ts'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index'

defineEmits<{
  'select-patient': [patient: PatientType]
  'view-consultation': [consultation: ConsultationType]
}>()

const totalPatients = computed(() => medicalStore.getTotalPatients())
const totalConsultations = computed(() => medicalStore.getTotalConsultations())
const consultationsThisMonth = computed(() => medicalStore.getConsultationsThisMonth())

const recentPatients = computed(() => {
  return medicalStore.patients
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const recentConsultations = computed(() => {
  return medicalStore.consultations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

const getPatientName = (patientId: string): string => {
  const patient = medicalStore.getPatientById(patientId)
  return patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente no encontrado'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES')
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.dashboard {
  padding: 16px;
}
</style>
