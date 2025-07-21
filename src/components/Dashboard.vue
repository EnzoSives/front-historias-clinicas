<template>
  <div class="dashboard">
    <!-- Stats Cards Row -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-primary text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">{{ totalPatients }}</div>
                <div class="text-subtitle2 text-white-7">Pacientes Registrados</div>
                <div class="text-caption text-white-6 q-mt-xs">
                  <q-icon name="trending_up" size="12px" class="q-mr-xs" />
                  +{{ newPatientsThisMonth }} este mes
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon-wrapper">
                  <q-icon name="people" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-secondary text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">{{ totalConsultations }}</div>
                <div class="text-subtitle2 text-white-7">Total Consultas</div>
                <div class="text-caption text-white-6 q-mt-xs">
                  <q-icon name="schedule" size="12px" class="q-mr-xs" />
                  Última: {{ lastConsultationDate }}
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon-wrapper">
                  <q-icon name="medical_services" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-positive text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">{{ consultationsThisMonth }}</div>
                <div class="text-subtitle2 text-white-7">Consultas este Mes</div>
                <div class="text-caption text-white-6 q-mt-xs">
                  <q-icon name="calendar_today" size="12px" class="q-mr-xs" />
                  {{ avgConsultationsPerDay }}/día promedio
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon-wrapper">
                  <q-icon name="calendar_month" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-warning text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">{{ upcomingAppointments }}</div>
                <div class="text-subtitle2 text-white-7">Citas Pendientes</div>
                <div class="text-caption text-white-6 q-mt-xs">
                  <q-icon name="event" size="12px" class="q-mr-xs" />
                  Próxima: {{ nextAppointmentDate }}
                </div>
              </div>
              <div class="col-auto">
                <div class="stat-icon-wrapper">
                  <q-icon name="event_available" size="40px" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12">
        <q-card class="quick-actions-card">
          <q-card-section class="q-pb-sm">
            <div class="text-h6 text-primary">
              <q-icon name="flash_on" class="q-mr-sm" />
              Acciones Rápidas
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="row q-gutter-md">
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  class="full-width action-btn"
                  color="primary"
                  icon="person_add"
                  label="Nuevo Paciente"
                  @click="$emit('new-patient')"
                  no-caps
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  class="full-width action-btn"
                  color="secondary"
                  icon="add_circle"
                  label="Nueva Consulta"
                  @click="$emit('new-consultation')"
                  no-caps
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  class="full-width action-btn"
                  color="positive"
                  icon="search"
                  label="Buscar Paciente"
                  @click="$emit('search-patient')"
                  no-caps
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  class="full-width action-btn"
                  color="info"
                  icon="assignment"
                  label="Reportes"
                  @click="$emit('view-reports')"
                  no-caps
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Content Cards Row -->
    <div class="row q-gutter-md">
      <div class="col-12 col-lg-6">
        <q-card class="content-card">
          <q-card-section class="card-header">
            <div class="row items-center justify-between">
              <div class="col-auto">
                <div class="text-h6 text-primary">
                  <q-icon name="people_alt" class="q-mr-sm" />
                  Pacientes Recientes
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  dense
                  icon="more_vert"
                  @click="$emit('view-all-patients')"
                >
                  <q-tooltip>Ver todos los pacientes</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section class="q-pa-none">
            <div v-if="recentPatients.length === 0" class="empty-state">
              <q-icon name="people_outline" size="48px" class="text-grey-5" />
              <div class="text-subtitle1 text-grey-6 q-mt-sm">No hay pacientes registrados</div>
              <q-btn
                color="primary"
                icon="person_add"
                label="Agregar Primer Paciente"
                @click="$emit('new-patient')"
                class="q-mt-md"
                no-caps
              />
            </div>
            
            <q-list v-else separator>
              <q-item
                v-for="patient in recentPatients"
                :key="patient.id"
                clickable
                @click="$emit('select-patient', patient)"
                class="patient-item"
              >
                <q-item-section avatar>
                  <q-avatar 
                    :color="getPatientAvatarColor(patient)" 
                    text-color="white"
                    size="40px"
                  >
                    {{ getPatientInitials(patient) }}
                  </q-avatar>
                </q-item-section>
                
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ patient.firstName }} {{ patient.lastName }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-7">
                    <q-icon name="badge" size="14px" class="q-mr-xs" />
                    {{ patient.dni }}
                  </q-item-label>
                </q-item-section>
                
                <q-item-section side top>
                  <div class="text-caption text-grey-6">
                    {{ formatRelativeDate(patient.createdAt) }}
                  </div>
                  <q-chip
                    v-if="hasRecentConsultation(patient.id)"
                    size="sm"
                    color="positive"
                    text-color="white"
                    icon="check_circle"
                    class="q-mt-xs"
                  >
                    Activo
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-6">
        <q-card class="content-card">
          <q-card-section class="card-header">
            <div class="row items-center justify-between">
              <div class="col-auto">
                <div class="text-h6 text-primary">
                  <q-icon name="medical_information" class="q-mr-sm" />
                  Consultas Recientes
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  dense
                  icon="more_vert"
                  @click="$emit('view-all-consultations')"
                >
                  <q-tooltip>Ver todas las consultas</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section class="q-pa-none">
            <div v-if="recentConsultations.length === 0" class="empty-state">
              <q-icon name="medical_services_outlined" size="48px" class="text-grey-5" />
              <div class="text-subtitle1 text-grey-6 q-mt-sm">No hay consultas registradas</div>
              <q-btn
                color="secondary"
                icon="add_circle"
                label="Crear Primera Consulta"
                @click="$emit('new-consultation')"
                class="q-mt-md"
                no-caps
              />
            </div>
            
            <q-list v-else separator>
              <q-item
                v-for="consultation in recentConsultations"
                :key="consultation.id"
                clickable
                @click="$emit('view-consultation', consultation)"
                class="consultation-item"
              >
                <q-item-section avatar>
                  <q-avatar 
                    color="secondary" 
                    text-color="white"
                    size="40px"
                  >
                    <q-icon name="medical_services" />
                  </q-avatar>
                </q-item-section>
                
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ getPatientName(consultation.patientId) }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-7">
                    <q-icon name="diagnosis" size="14px" class="q-mr-xs" />
                    {{ truncateText(consultation.diagnosis, 40) }}
                  </q-item-label>
                </q-item-section>
                
                <q-item-section side top>
                  <div class="text-caption text-grey-6">
                    {{ formatRelativeDate(consultation.fechaConsulta) }}
                  </div>
                  <q-chip
                    size="sm"
                    :color="getConsultationStatusColor(consultation)"
                    text-color="white"
                    class="q-mt-xs"
                  >
                    {{ getConsultationStatus(consultation) }}
                  </q-chip>
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
import { useMedicalStore } from 'src/stores/medicalStore'
import type { Patient as PatientType } from 'src/types/index'
import type { Consultation as ConsultationType } from 'src/types/index'

// Emits expandidos
defineEmits<{
  'select-patient': [patient: PatientType]
  'view-consultation': [consultation: ConsultationType]
  'new-patient': []
  'new-consultation': []
  'search-patient': []
  'view-reports': []
  'view-all-patients': []
  'view-all-consultations': []
}>()

const medicalStore = useMedicalStore()

// Stats computadas mejoradas
const totalPatients = computed(() => medicalStore.getTotalPatients)
const totalConsultations = computed(() => medicalStore.getTotalConsultations)
const consultationsThisMonth = computed(() => medicalStore.getConsultationsThisMonth)

// Nuevas métricas
const newPatientsThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return medicalStore.getAllPatients.filter(patient => {
    if (!patient.createdAt) return false
    const patientDate = new Date(patient.createdAt)
    return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear
  }).length
})

const avgConsultationsPerDay = computed(() => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  return consultationsThisMonth.value > 0 ? Math.round(consultationsThisMonth.value / daysInMonth * 10) / 10 : 0
})

const upcomingAppointments = computed(() => {
  // Placeholder - implementar cuando tengas citas programadas
  return 3
})

const nextAppointmentDate = computed(() => {
  // Placeholder - implementar cuando tengas citas programadas
  return 'Hoy 14:30'
})

const lastConsultationDate = computed(() => {
  const consultations = medicalStore.consultations
  if (consultations.length === 0) return 'N/A'
  
  const lastConsultation = consultations
    .sort((a, b) => new Date(b.fechaConsulta || '').getTime() - new Date(a.fechaConsulta || '').getTime())[0]
  
  return formatRelativeDate(lastConsultation.fechaConsulta)
})

// Listas mejoradas
const recentPatients = computed(() => {
  return medicalStore.getAllPatients
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime()
      const dateB = new Date(b.createdAt || '').getTime()
      return dateB - dateA
    })
    .slice(0, 5)
})

const recentConsultations = computed(() => {
  return medicalStore.consultations
    .sort((a, b) => {
      const dateA = new Date(a.fechaConsulta || '').getTime()
      const dateB = new Date(b.fechaConsulta || '').getTime()
      return dateB - dateA
    })
    .slice(0, 5)
})

// Funciones helper mejoradas
const getPatientName = (patientId: string): string => {
  const patient = medicalStore.getPatientById(patientId)
  return patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente no encontrado'
}

const getPatientInitials = (patient: PatientType): string => {
  return `${patient.nombre?.[0] || ''}${patient.apellido?.[0] || ''}`.toUpperCase()
}

const getPatientAvatarColor = (patient: PatientType): string => {
  const colors = ['primary', 'secondary', 'positive', 'info', 'warning']
  const index = (patient.nombre?.charCodeAt(0) || 0) % colors.length
  return colors[index]
}

const formatRelativeDate = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  
  return date.toLocaleDateString('es-ES')
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const hasRecentConsultation = (patientId: string): boolean => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  return medicalStore.consultations.some(consultation => 
    consultation.patientId === patientId && 
    new Date(consultation.fechaConsulta || '') > thirtyDaysAgo
  )
}

const getConsultationStatus = (consultation: ConsultationType): string => {
  // Implementar lógica de estado basada en tus necesidades
  const consultationDate = new Date(consultation.fechaConsulta || '')
  const daysDiff = Math.floor((new Date().getTime() - consultationDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff === 0) return 'Hoy'
  if (daysDiff < 7) return 'Reciente'
  return 'Anterior'
}

const getConsultationStatusColor = (consultation: ConsultationType): string => {
  const status = getConsultationStatus(consultation)
  switch (status) {
    case 'Hoy': return 'positive'
    case 'Reciente': return 'primary'
    default: return 'grey-6'
  }
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.stat-icon-wrapper {
  opacity: 0.8;
}

.quick-actions-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.06);
}

.action-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 500;
}

.content-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.06);
  height: fit-content;
}

.card-header {
  padding: 20px 20px 16px 20px;
  background: rgba(0,0,0,0.01);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.patient-item,
.consultation-item {
  padding: 16px 20px;
  transition: background-color 0.2s ease;
}

.patient-item:hover,
.consultation-item:hover {
  background-color: rgba(0,0,0,0.02);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }
  
  .stat-card .text-h4 {
    font-size: 1.8rem;
  }
  
  .empty-state {
    padding: 40px 20px;
  }
}

/* Dark mode support */
.body--dark .quick-actions-card,
.body--dark .content-card {
  border-color: rgba(255,255,255,0.12);
}

.body--dark .card-header {
  background: rgba(255,255,255,0.02);
}

.body--dark .patient-item:hover,
.body--dark .consultation-item:hover {
  background-color: rgba(255,255,255,0.05);
}
</style>