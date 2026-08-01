<template>
  <q-card class="consultation-card" flat>
    <!-- Header -->
    <div class="card-header">
      <div class="header-info">
        <div
          v-if="patient"
          class="patient-name cursor-pointer"
          @click.stop="$emit('view-patient')"
        >
          <q-icon name="person" size="13px" class="q-mr-xs" />
          {{ patient.apellido }}, {{ patient.nombre }}
          <q-tooltip>Ver historial del paciente</q-tooltip>
        </div>
        <div class="header-date">
          <q-icon name="calendar_today" size="11px" class="q-mr-xs" />
          {{ formatDate(consultation.fechaConsulta) }}
          <span class="separator">·</span>
          <q-icon name="schedule" size="11px" class="q-mr-xs" />
          {{ formatTime(consultation.fechaConsulta) }}
        </div>
      </div>
      <q-btn flat round dense icon="more_vert" color="white" size="sm">
        <q-menu anchor="bottom right" self="top right">
          <q-list dense style="min-width: 150px">
            <q-item clickable v-ripple @click="$emit('edit', consultation)">
              <q-item-section avatar><q-icon name="edit" size="xs" /></q-item-section>
              <q-item-section>Editar</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="confirmDelete">
              <q-item-section avatar><q-icon name="delete" color="negative" size="xs" /></q-item-section>
              <q-item-section>Eliminar</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Body -->
    <div class="card-body">
      <!-- Motivo -->
      <div class="field-block">
        <div class="field-label">
          <q-icon name="help_outline" size="11px" class="q-mr-xs" />
          Motivo
        </div>
        <div class="field-value clamp-2">
          {{ consultation.motivoConsulta || '—' }}
        </div>
      </div>

      <q-separator class="field-divider" />

      <!-- Diagnóstico -->
      <div class="field-block">
        <div class="field-label">
          <q-icon name="local_hospital" size="11px" class="q-mr-xs" />
          Diagnóstico
        </div>
        <div class="field-value clamp-2">
          {{ consultation.diagnostico || '—' }}
        </div>
      </div>
    </div>

    <!-- Footer: badges + acción -->
    <div class="card-footer">
      <div class="badge-row">
        <span
          v-if="images.length > 0"
          class="attach-badge badge-blue cursor-pointer"
          @click.stop="openImageDialog(0)"
        >
          <q-icon name="image" size="12px" />
          {{ images.length }}
        </span>
        <span
          v-if="pdfs.length > 0"
          class="attach-badge badge-red cursor-pointer"
          @click.stop="pdfs[0] && openPdf(pdfs[0].filename)"
        >
          <q-icon name="picture_as_pdf" size="12px" />
          {{ pdfs.length }}
        </span>
        <span v-if="consultation.laboratorios" class="attach-badge badge-green">
          <q-icon name="science" size="12px" />
          Lab
        </span>
      </div>

      <q-btn
        flat
        color="primary"
        label="Ver detalles"
        icon-right="chevron_right"
        size="xs"
        dense
        @click="showDetailsDialog"
      />
    </div>

    <!-- Carrusel de imágenes -->
    <q-dialog v-model="imageDialog">
      <q-carousel
        v-model="slide"
        animated arrows navigation infinite
        control-color="white"
        class="bg-black rounded-borders"
        style="width: 90vw; max-width: 90vw; height: 90vh;"
      >
        <q-carousel-slide
          v-for="(imagen, index) in images"
          :key="imagen.filename"
          :name="index"
          :img-src="getFileUrl(imagen.filename)"
          style="background-size: contain; background-repeat: no-repeat;"
        />
      </q-carousel>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { Consultation as ConsultationType, Patient as PatientType, PatientImage } from 'src/types/index'
import ConsultationDetail from 'src/components/ConsultationDetail.vue'

interface Props {
  consultation: ConsultationType;
  patient: PatientType | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit', consultation: ConsultationType): void;
  (e: 'delete', consultationId: number): void;
  (e: 'view-patient'): void;
}>()

const $q = useQuasar()
const imageDialog = ref(false);
const slide = ref(0);

const imageRegex = /\.(jpe?g|png|gif|bmp|webp)$/i;
const pdfRegex = /\.(pdf)$/i;

const getFileUrl = (filename: string) => `https://api.hcmadariaga.online/uploads/${filename}`;

const images = computed((): PatientImage[] => {
  if (!props.consultation.imagenes) return [];
  return props.consultation.imagenes.filter(f => imageRegex.test(f.filename));
});

const pdfs = computed((): PatientImage[] => {
  if (!props.consultation.imagenes) return [];
  return props.consultation.imagenes.filter(f => pdfRegex.test(f.filename));
});

const openImageDialog = (index: number) => {
  slide.value = index;
  imageDialog.value = true;
};

const openPdf = (filename: string) => window.open(getFileUrl(filename), '_blank');

const showDetailsDialog = () => {
  if (!props.consultation || !props.patient) return;
  $q.dialog({
    component: ConsultationDetail,
    componentProps: { consultation: props.consultation, patient: props.patient }
  });
};

const formatDate = (date: any): string =>
  new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const formatTime = (date: any): string =>
  new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

const confirmDelete = () => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Está seguro de que desea eliminar esta consulta?',
    persistent: true,
    ok: { color: 'negative', label: 'Eliminar' },
    cancel: { flat: true, label: 'Cancelar' }
  }).onOk(() => emit('delete', props.consultation.id));
};
</script>

<style scoped>
.consultation-card {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(25, 118, 210, 0.12);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.consultation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(25, 118, 210, 0.2);
}

/* ── Header ── */
.card-header {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.patient-name {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  display: flex;
  align-items: center;
}

.patient-name:hover {
  opacity: 0.85;
}

.header-date {
  font-size: 11px;
  color: #bbdefb;
  margin-top: 3px;
  display: flex;
  align-items: center;
}

.separator {
  margin: 0 5px;
  opacity: 0.6;
}

/* ── Body ── */
.card-body {
  flex: 1;
  padding: 12px 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.field-block {
  padding: 4px 0;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #90a4ae;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
}

.field-value {
  font-size: 12.5px;
  color: #37474f;
  line-height: 1.45;
}

.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.field-divider {
  margin: 6px 0;
  opacity: 0.35;
}

/* ── Footer ── */
.card-footer {
  padding: 8px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.badge-row {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
}

.attach-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  line-height: 1.6;
}

.badge-blue {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-red {
  background: #fce4ec;
  color: #c62828;
}

.badge-green {
  background: #e8f5e9;
  color: #2e7d32;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  filter: brightness(0.93);
}
</style>
