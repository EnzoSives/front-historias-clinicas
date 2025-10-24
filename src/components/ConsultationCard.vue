<template>
  <q-card class="consultation-card q-ma-sm q-hoverable" flat bordered>
    <q-card-section class="q-pb-sm">
      <div class="row items-center no-wrap">
        <div class="col-grow">
          <div v-if="patient" class="text-body1 text-weight-medium text-primary cursor-pointer ellipsis"
            @click.stop="$emit('view-patient')">
            <q-icon name="person" class="q-mr-xs" size="sm" />
            {{ patient.nombre }} {{ patient.apellido }}
            <q-tooltip>Ver historial del paciente</q-tooltip>
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            <q-icon name="event" size="xs" class="q-mr-xs" />
            {{ formatDate(consultation.fechaConsulta) }}
            <span class="q-mx-xs">·</span>
            <q-icon name="schedule" size="xs" class="q-mr-xs" />
            {{ formatTime(consultation.fechaConsulta) }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn flat round color="grey-7" icon="more_vert" size="sm">
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
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="q-pt-sm q-pb-md" style="flex-grow: 1;">
      <div class="text-subtitle2 text-grey-9 q-mb-xs">
        <q-icon name="priority_high" class="q-mr-xs" size="xs" /> Motivo:
      </div>
      <div class="text-body2 text-grey-8 ellipsis-2-lines q-mb-sm">
        {{ consultation.motivoConsulta || 'No especificado' }}
      </div>
      <div class="text-subtitle2 text-grey-9 q-mb-xs">
        <q-icon name="medical_information" class="q-mr-xs" size="xs" /> Diagnóstico:
      </div>
      <div class="text-body2 text-grey-8 ellipsis-2-lines">
        {{ consultation.diagnostico || 'No especificado' }}
      </div>
    </q-card-section>

    <q-card-section v-if="images.length > 0" class="q-pt-none q-pb-sm">
      <div class="text-subtitle2 text-grey-9 q-mb-xs">
        <q-icon name="image" class="q-mr-xs" size="xs" /> Imágenes:
      </div>
      <div class="row q-gutter-sm">
        <div v-for="(imagen, index) in images" :key="imagen.filename" class="col-auto cursor-pointer"
          @click="openImageDialog(index)">
          <q-img :src="getFileUrl(imagen.filename)" spinner-color="primary"
            style="height: 50px; width: 50px; border-radius: 4px;">
            <q-tooltip>Ver imagen</q-tooltip>
          </q-img>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="pdfs.length > 0" class="q-pt-none">
      <div class="text-subtitle2 text-grey-9 q-mb-xs">
        <q-icon name="picture_as_pdf" class="q-mr-xs" size="xs" /> Archivos PDF:
      </div>
      <div class="row q-gutter-sm">
        <div v-for="pdf in pdfs" :key="pdf.filename" class="col-auto cursor-pointer"
          @click="openPdf(pdf.filename)">
          <q-avatar icon="picture_as_pdf" color="red-1" text-color="red-8" font-size="30px" square
            style="height: 50px; width: 50px; border-radius: 4px;" />
          <q-tooltip>Ver PDF: {{ pdf.filename }}</q-tooltip>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="images.length === 0 && pdfs.length === 0" class="q-pt-none">
      <div style="min-height: 70px;"></div>
    </q-card-section>


    <q-card-actions align="right" class="q-pa-sm">
      <q-btn flat color="primary" label="Ver Detalles" icon-right="visibility" size="sm" @click="showDetailsDialog" />
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
import type { Consultation as ConsultationType, Patient as PatientType, Imagen } from 'src/types/index'
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
  return `http://localhost:3000/uploads/${filename}`;
};

// Computed property para filtrar solo imágenes
const images = computed((): Imagen[] => {
  if (!props.consultation.imagenes) return [];
  return props.consultation.imagenes.filter(file => imageRegex.test(file.filename));
});

// Computed property para filtrar solo PDFs
const pdfs = computed((): Imagen[] => {
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
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  cursor: default;
  background-color: var(--app-white);
  border-left: 5px solid transparent;
  border: 1px solid #e0e0e0;
  min-height: 250px;
  display: flex;
  flex-direction: column;
}

.consultation-card.q-hoverable:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
  border-left-color: var(--q-primary);
}

.cursor-pointer {
  cursor: pointer;
}

.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.text-body1.text-weight-medium {
  font-size: 1.1rem;
  font-weight: 500;
}

.q-icon {
  vertical-align: middle;
}
</style>
