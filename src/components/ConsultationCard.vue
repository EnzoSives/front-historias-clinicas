<template>
  <q-card class="consultation-card q-ma-sm" flat bordered>
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="col">
          <div class="text-h6 text-primary">
            <q-icon name="calendar_today" class="q-mr-sm" />
            {{ formatDate(consultation.date) }}
          </div>
          <div class="text-subtitle2 text-grey-7">
            {{ formatTime(consultation.date) }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn 
            flat 
            round 
            color="primary" 
            icon="more_vert"
            @click="showActions = !showActions"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Síntomas:</div>
        <div class="text-body2">{{ consultation.symptoms }}</div>
      </div>

      <div class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Diagnóstico:</div>
        <div class="text-body2">{{ consultation.diagnosis }}</div>
      </div>

      <div class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Tratamiento:</div>
        <div class="text-body2">{{ consultation.treatment }}</div>
      </div>

      <div v-if="consultation.prescriptions" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Prescripciones:</div>
        <div class="text-body2">{{ consultation.prescriptions }}</div>
      </div>

      <div v-if="consultation.notes" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Notas:</div>
        <div class="text-body2">{{ consultation.notes }}</div>
      </div>

      <div v-if="consultation.nextAppointment" class="q-mt-md">
        <q-chip 
          color="secondary" 
          text-color="white" 
          icon="schedule"
          size="sm"
        >
          Próxima cita: {{ formatDate(consultation.nextAppointment) }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-actions v-if="showActions" align="right">
      <q-btn 
        flat 
        color="primary" 
        icon="edit" 
        label="Editar"
        @click="$emit('edit', consultation)"
      />
      <q-btn 
        flat 
        color="negative" 
        icon="delete" 
        label="Eliminar"
        @click="confirmDelete"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { Consultation } from '../types'

interface Props {
  consultation: Consultation
}

const $q = useQuasar()
const showActions = ref(false)

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const confirmDelete = () => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Está seguro de que desea eliminar esta consulta?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    emit('delete', props.consultation.id)
  })
}

const emit = defineEmits<{
  edit: [consultation: Consultation]
  delete: [consultationId: string]
}>()

const props = defineProps<Props>()
</script>

<style scoped>
.consultation-card {
  border-left: 4px solid #1976D2;
}
</style>