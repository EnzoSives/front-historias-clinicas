<template>
  <q-card class="consultation-card q-ma-sm" flat>
    <!-- Header con banda de color -->
    <div class="consultation-card__header">
      <div class="consultation-card__header-info">
        <div v-if="patient" class="text-subtitle1 text-weight-bold text-white ellipsis cursor-pointer"
          @click.stop="$emit('view-patient')">
          <q-icon name="person" size="14px" class="q-mr-xs" />
          {{ patient.apellido }} {{ patient.nombre }}
          <q-tooltip>Ver historial del paciente</q-tooltip>
        </div>
        <div class="text-caption" style="opacity:0.85; color:#e0f2f1;">
          <q-icon name="event" size="10px" class="q-mr-xs" />
          {{ formatDate(consultation.fechaConsulta) }}
          <span class="q-mx-xs">·</span>
          <q-icon name="schedule" size="10px" class="q-mr-xs" />
          {{ formatTime(consultation.fechaConsulta) }}
        </div>
      </div>
      <q-btn flat round dense icon="more_vert" color="white" size="sm" aria-label="Opciones">
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

    <!-- Contenido: área de altura fija -->
    <q-card-section class="q-pt-sm q-pb-sm card-body">
      <div class="row q-gutter-xs q-mb-xs">
        <q-chip dense icon="badge" color="primary" text-color="white" class="chip-data">
          {{ consultation.motivoConsulta || 'Sin motivo' }}
        </q-chip>
      </div>
      <div class="row q-gutter-xs q-mb-xs">
        <q-chip dense icon="medical_information" color="indigo-1" text-color="indigo-9" class="chip-data">
          {{ consultation.diagnostico || 'Sin diagnóstico' }}
        </q-chip>
      </div>
      <!-- Adjuntos: siempre presentes para mantener la altura -->
      <div class="row q-gutter-xs" style="min-height: 26px;">
        <q-chip v-if="images.length > 0" dense icon="image" color="blue-1" text-color="blue-9"
          class="chip-data cursor-pointer" @click.stop="openImageDialog(0)">
          {{ images.length }} imagen{{ images.length > 1 ? 'es' : '' }}
        </q-chip>
        <q-chip v-if="pdfs.length > 0" dense icon="picture_as_pdf" color="red-1" text-color="red-9"
          class="chip-data cursor-pointer" @click.stop="pdfs[0] && openPdf(pdfs[0].filename)">
          {{ pdfs.length }} PDF{{ pdfs.length > 1 ? 's' : '' }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-xs">
      <q-btn flat color="primary" label="Ver Detalles" icon-right="open_in_new" size="sm" @click="showDetailsDialog" />
    </q-card-actions>

    <q-dialog v-model="imageDialog">
      <q-carousel v-model="slide" animated arrows navigation infinite control-color="white"
        class="bg-black rounded-borders" style="width: 90vw; max-width: 90vw; height: 90vh;">
        <q-carousel-slide v-for="(imagen, index) in images" :key="imagen.filename" :name="index"
          :img-src="getFileUrl(imagen.filename)" style="background-size: contain; background-repeat: no-repeat;" />
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

// --- INICIO DE CAMBIOS ---

// Expresiones regulares para filtrar tipos de archivo
const imageRegex = /\.(jpe?g|png|gif|bmp|webp)$/i;
const pdfRegex = /\.(pdf)$/i;

// Devuelve la URL base para cualquier archivo
const getFileUrl = (filename: string) => {
  return `https://api.hcmadariaga.online/uploads/${filename}`;
};

// Computed property para filtrar solo imágenes
const images = computed((): PatientImage[] => {
  if (!props.consultation.imagenes) return [];
  return props.consultation.imagenes.filter(file => imageRegex.test(file.filename));
});

// Computed property para filtrar solo PDFs
const pdfs = computed((): PatientImage[] => {
  if (!props.consultation.imagenes) return [];
  return props.consultation.imagenes.filter(file => pdfRegex.test(file.filename));
});

// Abre el carrusel de imágenes
const openImageDialog = (index: number) => {
  slide.value = index;
  imageDialog.value = true;
};

// Abre el PDF en una nueva pestaña
const openPdf = (filename: string) => {
  const url = getFileUrl(filename);
  window.open(url, '_blank');
};

// --- FIN DE CAMBIOS ---

const showDetailsDialog = () => {
  if (!props.consultation || !props.patient) return;

  $q.dialog({
    component: ConsultationDetail,
    componentProps: {
      consultation: props.consultation,
      patient: props.patient
    }
  })
}

const formatDate = (date: any): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
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
    persistent: true,
    ok: { color: 'negative', label: 'Eliminar' },
    cancel: { flat: true, label: 'Cancelar' }
  }).onOk(() => {
    emit('delete', props.consultation.id)
  })
}
</script>

<style scoped>
.consultation-card {
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(63, 81, 181, 0.25);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.consultation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
}

.consultation-card__header {
  background: #1976D2;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-body {
  flex: 1;
}

.consultation-card__header-info {
  flex: 1;
  min-width: 0;
}

.consultation-field__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #78909c;
  margin-bottom: 2px;
}

.consultation-field__value {
  font-size: 13px;
  color: #37474f;
  line-height: 1.4;
}

.card-footer {
  background-color: #1976D2;
}

.chip-data {
  font-size: 11px;
  height: 22px;
  max-width: 100%;
}

.chip-data :deep(.q-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cursor-pointer:hover {
  opacity: 0.85;
}

.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: all 0.3s ease;
}

.consultation-card:hover .ellipsis-2-lines {
  opacity: 0.95;
}

.text-body1.text-weight-medium {
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.consultation-card:hover .text-body1.text-weight-medium {
  color: var(--q-primary);
  opacity: 1;
}

.q-icon {
  vertical-align: middle;
  transition: all 0.3s ease;
}

.consultation-card:hover .q-icon {
  opacity: 0.9;
}

/* Card sections */
.q-card-section {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Separator improvements */
::v-deep .q-separator {
  opacity: 0.4;
}

/* Button styling */
.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-2px);
}

/* Image styling */
.q-img {
  transition: all 0.3s ease;
  border-radius: 4px;
}

.q-img:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}
</style>
