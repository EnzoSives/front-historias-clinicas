<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="detail-card">

      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <div class="patient-name">{{ patient.apellido }}, {{ patient.nombre }}</div>
          <div class="patient-meta">
            <span v-if="patient.dni">
              <q-icon name="badge" size="11px" class="q-mr-xs" />DNI {{ patient.dni }}
            </span>
            <span class="dot" v-if="patient.dni">·</span>
            <q-icon name="calendar_today" size="11px" class="q-mr-xs" />
            {{ formatDate(consultation.fechaConsulta) }}
            <span class="dot">·</span>
            <q-icon name="schedule" size="11px" class="q-mr-xs" />
            {{ formatTime(consultation.fechaConsulta) }}
          </div>
        </div>
        <q-btn icon="close" flat round dense color="white" size="sm" @click="onDialogHide" />
      </div>

      <!-- Content -->
      <div class="detail-scroll">

        <!-- Motivo -->
        <div class="detail-section">
          <div class="section-label">
            <q-icon name="help_outline" size="14px" class="q-mr-xs" />
            Motivo de consulta
          </div>
          <div class="section-value">{{ consultation.motivoConsulta || '—' }}</div>
        </div>

        <!-- Anamnesis -->
        <div class="detail-section" v-if="consultation.anamnesis">
          <div class="section-label">
            <q-icon name="description" size="14px" class="q-mr-xs" />
            Anamnesis
          </div>
          <div class="section-value">{{ consultation.anamnesis }}</div>
        </div>

        <!-- Examen Físico -->
        <div class="detail-section" v-if="consultation.examenFisico">
          <div class="section-label">
            <q-icon name="accessibility_new" size="14px" class="q-mr-xs" />
            Examen físico
          </div>
          <div class="section-value">{{ consultation.examenFisico }}</div>
        </div>

        <!-- Diagnóstico + Tratamiento en fila -->
        <div class="detail-row">
          <div class="detail-section flex-1">
            <div class="section-label">
              <q-icon name="local_hospital" size="14px" class="q-mr-xs" />
              Diagnóstico
            </div>
            <div class="section-value">{{ consultation.diagnostico || '—' }}</div>
          </div>
          <div class="detail-section flex-1" v-if="consultation.tratamiento">
            <div class="section-label">
              <q-icon name="medication" size="14px" class="q-mr-xs" />
              Tratamiento
            </div>
            <div class="section-value">{{ consultation.tratamiento }}</div>
          </div>
        </div>

        <!-- Laboratorios -->
        <div class="detail-section highlight-green" v-if="consultation.laboratorios">
          <div class="section-label">
            <q-icon name="science" size="14px" class="q-mr-xs" />
            Laboratorios
          </div>
          <div class="section-value">{{ consultation.laboratorios }}</div>
        </div>

        <!-- Observaciones -->
        <div class="detail-section highlight-amber" v-if="consultation.observaciones">
          <div class="section-label">
            <q-icon name="speaker_notes" size="14px" class="q-mr-xs" />
            Observaciones
          </div>
          <div class="section-value">{{ consultation.observaciones }}</div>
        </div>

      </div>

      <!-- Footer -->
      <div class="detail-footer">
        <q-btn flat color="primary" label="Cerrar" icon="close" size="sm" @click="onDialogOK" />
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import type { Consultation as ConsultationType, Patient as PatientType } from 'src/types/index'

interface Props {
  consultation: ConsultationType
  patient: PatientType
}

defineProps<Props>()

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const formatDate = (date: any): string =>
  new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

const formatTime = (date: any): string =>
  new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
</script>

<style scoped>
.detail-card {
  width: 680px;
  max-width: 92vw;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.detail-header {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  padding: 18px 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.patient-name {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.patient-meta {
  font-size: 12px;
  color: #bbdefb;
  margin-top: 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.dot {
  margin: 0 5px;
  opacity: 0.5;
}

/* ── Scroll area ── */
.detail-scroll {
  overflow-y: auto;
  max-height: 70vh;
  padding: 18px 20px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ── Section ── */
.detail-section {
  background: #f8fafc;
  border: 1px solid #e8edf2;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
}

.detail-section.highlight-green {
  background: #f1f8f2;
  border-color: #c8e6c9;
}

.detail-section.highlight-amber {
  background: #fffbf0;
  border-color: #ffe082;
}

.section-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #90a4ae;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

.highlight-green .section-label {
  color: #388e3c;
}

.highlight-amber .section-label {
  color: #f57f17;
}

.section-value {
  font-size: 13.5px;
  color: #263238;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── Row layout para diagnóstico + tratamiento ── */
.detail-row {
  display: flex;
  gap: 8px;
  margin-bottom: 0;
}

.detail-row .detail-section {
  flex: 1;
}

.flex-1 {
  flex: 1;
}

/* ── Footer ── */
.detail-footer {
  padding: 10px 20px 14px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e8edf2;
}
</style>
