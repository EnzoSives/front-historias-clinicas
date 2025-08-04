<template>
  <q-card class="consultation-card q-ma-sm" flat bordered>
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="col">
          <div class="text-h6 text-primary">
            <q-icon name="calendar_today" class="q-mr-sm" />
            {{ formatDate(consultation.fechaConsulta) }}
          </div>
          <div class="text-subtitle2 text-grey-7">
            {{ formatTime(consultation.fechaConsulta) }}
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
      <div v-if="consultation.motivoConsulta" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Motivo de la Consulta:</div>
        <div class="text-body2">{{ consultation.motivoConsulta }}</div>
      </div>

      <div v-if="consultation.anamnesis" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Enfermedad Actual (Anamnesis):</div>
        <div class="text-body2">{{ consultation.anamnesis }}</div>
      </div>

      <div v-if="consultation.diagnostico" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Diagnóstico:</div>
        <div class="text-body2">{{ consultation.diagnostico }}</div>
      </div>

      <div v-if="consultation.tratamiento" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Tratamiento:</div>
        <div class="text-body2">{{ consultation.tratamiento }}</div>
      </div>
      
      <div v-if="consultation.observaciones" class="q-mb-sm">
        <div class="text-weight-medium text-grey-8">Observaciones:</div>
        <div class="text-body2">{{ consultation.observaciones }}</div>
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
// ✅ CORREGIDO: La interfaz ya está bien definida, solo la usamos
import type { Consultation as ConsultationType } from 'src/types/index'

interface Props {
  consultation: ConsultationType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', consultation: ConsultationType): void
  // ✅ CORREGIDO: El ID es de tipo number
  (e: 'delete', consultationId: number): void
}>()

const $q = useQuasar()
const showActions = ref(false)

// Se usan `any` temporalmente para `fechaConsulta` porque puede ser string o Date
const formatDate = (date: any): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date: any): string => {
  return new Date(date).toLocaleTimeString('es-ES', {
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
</script>

<style scoped>
.consultation-card {
  border-left: 4px solid #1976D2; /* Azul primario de Quasar */
}
</style>