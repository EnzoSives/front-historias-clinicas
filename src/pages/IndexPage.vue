<template>
  <q-layout view="lHh Lpr fFf"> <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="drawerOpen = !drawerOpen"
        />

        <q-toolbar-title>
          <q-icon name="local_hospital" class="q-mr-sm" />
          Sistema de Historias Clínicas
        </q-toolbar-title>

        <q-btn
          v-if="currentView !== 'dashboard'"
          flat
          icon="arrow_back"
          label="Volver"
          @click="goBack"
        />
      </q-toolbar>
    </q-header>

    

    <q-page-container>
      <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="280"
      :breakpoint="700"
      elevated
      class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header class="text-primary">
            <q-icon name="menu" class="q-mr-sm" />
            Menú Principal
          </q-item-label>

          <q-item
            clickable
            v-ripple
            @click="currentView = 'dashboard'"
            :active="currentView === 'dashboard'"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="currentView = 'patients'"
            :active="currentView === 'patients'"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>Pacientes</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="showNewPatientForm"
          >
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>Nuevo Paciente</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-grey-7">
            <q-icon name="analytics" class="q-mr-sm" />
            Estadísticas
          </q-item-label>

          <q-item>
            <q-item-section avatar>
              <q-icon name="people" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ medicalStore.getTotalPatients }}</q-item-label>
              <q-item-label caption>Pacientes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="medical_services" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ medicalStore.getTotalConsultations }}</q-item-label>
              <q-item-label caption>Consultas</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    
      <q-page class="bg-grey-1 q-page-no-padding-top">
        <div v-if="currentView === 'dashboard'">
          <Dashboard
            @select-patient="selectPatient"
            @view-consultation="viewConsultation"
          />
        </div>

        <div v-else-if="currentView === 'patients'">
          <div class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="col">
                <div class="text-h4 text-primary">
                  <q-icon name="people" class="q-mr-sm" />
                  Pacientes
                </div>
                <div class="text-subtitle1 text-grey-7">
                  {{ medicalStore.getAllPatients.length }} paciente(s) registrado(s)
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  color="primary"
                  icon="person_add"
                  label="Nuevo Paciente"
                  @click="showNewPatientForm"
                />
              </div>
            </div>

            <q-input
              v-model="searchQuery"
              filled
              placeholder="Buscar por nombre, DNI o email..."
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="searchQuery"
                  name="close"
                  @click="searchQuery = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>

            <div v-if="filteredPatients.length === 0" class="text-center text-grey-6 q-pa-xl">
              <q-icon name="people" size="64px" />
              <div class="q-mt-md">No se encontraron pacientes</div>
              <div class="text-caption">
                {{ searchQuery ? 'Prueba con otros términos de búsqueda' : 'Comienza agregando un nuevo paciente' }}
              </div>
            </div>

            <div v-else class="row">
              <div
                v-for="patient in filteredPatients"
                :key="patient.id"
                class="col-12 col-md-6 col-lg-4"
              >
                <PatientCard
                  :patient="patient"
                  @select-patient="selectPatient"
                  @view-history="viewPatientHistory"
                  @new-consultation="showNewConsultationForm"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'patient-form'">
          <div class="flex flex-center q-pa-md">
            <PatientForm
              :patient="selectedPatient"
              :is-edit="!!selectedPatient"
              @save="savePatient"
              @cancel="goBack"
            />
          </div>
        </div>

        <div v-else-if="currentView === 'patient-history'">
          <PatientHistory
            :patient="selectedPatient"
            :consultations="patientConsultations"
            @new-consultation="showNewConsultationForm"
            @edit-consultation="editConsultation"
            @delete-consultation="deleteConsultation"
          />
        </div>

        <div v-else-if="currentView === 'consultation-form'">
          <div class="flex flex-center q-pa-md">
            <ConsultationForm
              :patient="selectedPatient"
              @save="saveConsultation"
              @cancel="goBack"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMedicalStore } from 'src/stores/medicalStore'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index'
import Dashboard from 'src/components/Dashboard.vue'
import PatientCard from 'src/components/PatientCard.vue'
import PatientForm from 'src/components/PatientForm.vue'
import PatientHistory from 'src/components/PatientHistory.vue'
import ConsultationForm from 'src/components/ConsultationForm.vue'

const $q = useQuasar()

const medicalStore = useMedicalStore()

const drawerOpen = ref(false)
const currentView = ref<'dashboard' | 'patients' | 'patient-form' | 'patient-history' | 'consultation-form'>('dashboard')
const selectedPatient = ref<PatientType | null>(null)
const searchQuery = ref('')
const previousView = ref<string>('')

const filteredPatients = computed(() => {
  if (!searchQuery.value) return medicalStore.getAllPatients

  const query = searchQuery.value.toLowerCase()
  return medicalStore.getAllPatients.filter(patient =>
    patient.firstName.toLowerCase().includes(query) || // Asegúrate de que 'firstName' exista en PatientType
    patient.lastName.toLowerCase().includes(query) || // Asegúrate de que 'lastName' exista en PatientType
    patient.dni.toLowerCase().includes(query) ||
    patient.email.toLowerCase().includes(query)
  )
})

const patientConsultations = computed(() => {
  if (!selectedPatient.value) return []
  return medicalStore.getConsultationsByPatientId(selectedPatient.value.id)
})

const selectPatient = (patient: PatientType) => {
  selectedPatient.value = patient
}

const viewPatientHistory = (patient: PatientType) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'patient-history'
}

const showNewPatientForm = () => {
  previousView.value = currentView.value
  selectedPatient.value = null
  currentView.value = 'patient-form'
}

const showEditPatientForm = (patient: PatientType) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'patient-form'
}

const showNewConsultationForm = (patient: PatientType) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'consultation-form'
}

const editConsultation = (consultation: ConsultationType) => {
  $q.notify({
    type: 'info',
    message: 'Función de edición de consultas en desarrollo'
  })
}

const savePatient = async (patient: PatientType) => {
  try {
    if (selectedPatient.value && patient.id) {
      await medicalStore.updatePatient(patient.id, patient)
      $q.notify({
        type: 'positive',
        message: 'Paciente actualizado exitosamente'
      })
    } else {
      await medicalStore.addPatient(patient)
      $q.notify({
        type: 'positive',
        message: 'Paciente creado exitosamente'
      })
    }
    goBack()
  } catch (error) {
    console.error('Error saving patient:', error)
    $q.notify({
      type: 'negative',
      message: medicalStore.getStoreError || 'Error al guardar el paciente.'
    })
  }
}

const saveConsultation = (consultation: ConsultationType) => {
  medicalStore.addConsultation(consultation)
  $q.notify({
    type: 'positive',
    message: 'Consulta guardada exitosamente'
  })

  currentView.value = 'patient-history'
}

const deleteConsultation = (consultationId: string) => {
  medicalStore.deleteConsultation(consultationId)
  $q.notify({
    type: 'positive',
    message: 'Consulta eliminada exitosamente'
  })
}

const viewConsultation = async (consultation: ConsultationType) => {
  try {
    const patient = await medicalStore.fetchPatientById(consultation.pacienteId)
    if (patient) {
      viewPatientHistory(patient)
    } else {
      $q.notify({
        type: 'negative',
        message: 'No se encontró el paciente para esta consulta.'
      })
    }
  } catch (error) {
    console.error('Error fetching patient for consultation:', error)
    $q.notify({
      type: 'negative',
      message: medicalStore.getStoreError || 'Error al cargar el paciente de la consulta.'
    })
  }
}

const goBack = () => {
  currentView.value = previousView.value || 'dashboard'
  previousView.value = ''
}

onMounted(async () => {
  await medicalStore.initializeStore()
})
</script>

<style scoped>
.q-layout {
  min-height: 100vh;
}
.q-page-no-padding-top {
  padding-top: 0 !important;
}
</style>