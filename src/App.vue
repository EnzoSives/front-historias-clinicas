<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
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
              <q-item-label>{{ medicalStore.getTotalPatients() }}</q-item-label>
              <q-item-label caption>Pacientes</q-item-label>
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section avatar>
              <q-icon name="medical_services" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ medicalStore.getTotalConsultations() }}</q-item-label>
              <q-item-label caption>Consultas</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="bg-grey-1">
        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'">
          <Dashboard
            @select-patient="selectPatient"
            @view-consultation="viewConsultation"
          />
        </div>
        
        <!-- Patients List View -->
        <div v-else-if="currentView === 'patients'">
          <div class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="col">
                <div class="text-h4 text-primary">
                  <q-icon name="people" class="q-mr-sm" />
                  Pacientes
                </div>
                <div class="text-subtitle1 text-grey-7">
                  {{ medicalStore.patients.length }} paciente(s) registrado(s)
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
            
            <!-- Search -->
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
            
            <!-- Patients Grid -->
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
        
        <!-- Patient Form View -->
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
        
        <!-- Patient History View -->
        <div v-else-if="currentView === 'patient-history'">
          <PatientHistory
            :patient="selectedPatient"
            :consultations="patientConsultations"
            @new-consultation="showNewConsultationForm"
            @edit-consultation="editConsultation"
            @delete-consultation="deleteConsultation"
          />
        </div>
        
        <!-- Consultation Form View -->
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
import { medicalStore } from './stores/medicalStore'
import { Patient, Consultation } from './types'
import Dashboard from './components/Dashboard.vue'
import PatientCard from './components/PatientCard.vue'
import PatientForm from './components/PatientForm.vue'
import PatientHistory from './components/PatientHistory.vue'
import ConsultationForm from './components/ConsultationForm.vue'

const $q = useQuasar()

// Reactive state
const drawerOpen = ref(false)
const currentView = ref<'dashboard' | 'patients' | 'patient-form' | 'patient-history' | 'consultation-form'>('dashboard')
const selectedPatient = ref<Patient | null>(null)
const searchQuery = ref('')
const previousView = ref<string>('')

// Computed properties
const filteredPatients = computed(() => {
  if (!searchQuery.value) return medicalStore.patients
  
  const query = searchQuery.value.toLowerCase()
  return medicalStore.patients.filter(patient => 
    patient.firstName.toLowerCase().includes(query) ||
    patient.lastName.toLowerCase().includes(query) ||
    patient.dni.toLowerCase().includes(query) ||
    patient.email.toLowerCase().includes(query)
  )
})

const patientConsultations = computed(() => {
  if (!selectedPatient.value) return []
  return medicalStore.getConsultationsByPatientId(selectedPatient.value.id)
})

// Methods
const selectPatient = (patient: Patient) => {
  selectedPatient.value = patient
  medicalStore.currentPatient = patient
}

const viewPatientHistory = (patient: Patient) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'patient-history'
}

const showNewPatientForm = () => {
  previousView.value = currentView.value
  selectedPatient.value = null
  currentView.value = 'patient-form'
}

const showEditPatientForm = (patient: Patient) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'patient-form'
}

const showNewConsultationForm = (patient: Patient) => {
  previousView.value = currentView.value
  selectedPatient.value = patient
  currentView.value = 'consultation-form'
}

const editConsultation = (consultation: Consultation) => {
  // For now, just show a notification
  $q.notify({
    type: 'info',
    message: 'Función de edición de consultas en desarrollo'
  })
}

const savePatient = (patient: Patient) => {
  if (selectedPatient.value) {
    medicalStore.updatePatient(patient)
    $q.notify({
      type: 'positive',
      message: 'Paciente actualizado exitosamente'
    })
  } else {
    medicalStore.addPatient(patient)
    $q.notify({
      type: 'positive',
      message: 'Paciente creado exitosamente'
    })
  }
  
  goBack()
}

const saveConsultation = (consultation: Consultation) => {
  medicalStore.addConsultation(consultation)
  $q.notify({
    type: 'positive',
    message: 'Consulta guardada exitosamente'
  })
  
  // Go back to patient history
  currentView.value = 'patient-history'
}

const deleteConsultation = (consultationId: string) => {
  medicalStore.deleteConsultation(consultationId)
  $q.notify({
    type: 'positive',
    message: 'Consulta eliminada exitosamente'
  })
}

const viewConsultation = (consultation: Consultation) => {
  const patient = medicalStore.getPatientById(consultation.patientId)
  if (patient) {
    viewPatientHistory(patient)
  }
}

const goBack = () => {
  currentView.value = previousView.value || 'dashboard'
  previousView.value = ''
}

// Lifecycle
onMounted(() => {
  medicalStore.loadFromStorage()
})
</script>

<style scoped>
.q-layout {
  min-height: 100vh;
}
</style>