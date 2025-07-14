<template>
  <q-card 
    class="patient-card q-ma-sm" 
    flat 
    bordered 
    @click="$emit('select-patient', patient)"
  >
    <q-card-section class="row items-center">
      <q-avatar 
        color="primary" 
        text-color="white" 
        size="50px"
        class="q-mr-md"
      >
        <q-icon name="person" size="24px" />
      </q-avatar>
      
      <div class="col">
        <div class="text-h6 text-primary">
          {{ patient.firstName }} {{ patient.lastName }}
        </div>
        <div class="text-subtitle2 text-grey-7">
          DNI: {{ patient.dni }}
        </div>
        <div class="text-caption text-grey-6">
          {{ calculateAge(patient.birthDate) }} años • {{ patient.gender }}
        </div>
      </div>
      
      <div class="column items-end">
        <q-chip 
          :color="getBloodTypeColor(patient.bloodType)" 
          text-color="white" 
          size="sm"
        >
          {{ patient.bloodType }}
        </q-chip>
        <div class="text-caption text-grey-6 q-mt-xs">
          {{ formatDate(patient.createdAt) }}
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn 
        flat 
        color="primary" 
        icon="visibility" 
        label="Ver Historial" 
        @click.stop="$emit('view-history', patient)"
      />
      <q-btn 
        flat 
        color="secondary" 
        icon="add" 
        label="Nueva Consulta" 
        @click.stop="$emit('new-consultation', patient)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { Patient } from '../types'

interface Props {
  patient: Patient
}

defineProps<Props>()

defineEmits<{
  'select-patient': [patient: Patient]
  'view-history': [patient: Patient]
  'new-consultation': [patient: Patient]
}>()

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
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getBloodTypeColor = (bloodType: string): string => {
  const colors: { [key: string]: string } = {
    'O+': 'red-5',
    'O-': 'red-7',
    'A+': 'blue-5',
    'A-': 'blue-7',
    'B+': 'green-5',
    'B-': 'green-7',
    'AB+': 'purple-5',
    'AB-': 'purple-7'
  }
  return colors[bloodType] || 'grey-5'
}
</script>

<style scoped>
.patient-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.patient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>