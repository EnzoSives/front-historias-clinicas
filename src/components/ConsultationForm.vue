<template>
  <q-card class="q-ma-sm full-width">
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-primary">
        <q-icon name="medical_services" class="q-mr-sm" />
        {{ isEdit ? 'Editar Consulta' : 'Nueva Consulta' }}
      </div>
      <div class="text-subtitle2 text-grey-7 q-pt-xs" v-if="patient || selectedPatient">
        Paciente: {{ (patient || selectedPatient)?.nombre }} {{ (patient || selectedPatient)?.apellido }} (DNI: {{
          (patient || selectedPatient)?.dni ?? 'N/A' }})
      </div>
      <div class="text-subtitle2 text-grey-7 q-pt-xs" v-else>
        Seleccione un paciente para continuar
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-sm">
        <div v-if="!patient" class="q-mb-sm">
          <q-select dense outlined v-model="selectedPatient" use-input hide-selected fill-input input-debounce="0"
            :options="patientOptions" @filter="filterPatients" label="Buscar Paciente por Nombre o DNI"
            :rules="[val => !!val || 'Debe seleccionar un paciente']" emit-value map-options>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se encontraron resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-expansion-item group="consultation-sections" icon="event" label="Información General" default-opened
          dense-toggle class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.fechaConsulta" label="Fecha de Consulta" type="datetime-local"
                  :rules="[val => !!val || 'La fecha es requerida']">
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined v-model="form.motivoConsulta" label="Motivo de Consulta"
                  :rules="[val => !!val || 'El motivo es requerido']" hint="Motivo principal de la visita" />
              </div>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="description" label="Anamnesis y Examen Físico"
          dense-toggle class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm q-gutter-sm">
            <q-input dense outlined v-model="form.anamnesis" label="Anamnesis" type="textarea" autogrow
              hint="Historial clínico y detalles del padecimiento actual" />
            <q-input dense outlined v-model="form.examenFisico" label="Examen Físico" type="textarea" autogrow
              hint="Resultados relevantes del examen físico" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="assignment_turned_in" label="Diagnóstico y Tratamiento"
          dense-toggle class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm q-gutter-sm">
            <q-input dense outlined v-model="form.diagnostico" label="Diagnóstico" type="textarea" autogrow
              :rules="[val => !!val || 'El diagnóstico es requerido']" hint="Diagnóstico médico basado en los datos" />
            <q-input dense outlined v-model="form.tratamiento" label="Tratamiento" type="textarea" autogrow
              :rules="[val => !!val || 'El tratamiento es requerido']"
              hint="Describa el tratamiento y las indicaciones recomendadas" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="speaker_notes" label="Observaciones" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <q-input dense outlined v-model="form.observaciones" label="Observaciones Adicionales" type="textarea"
              hint="Notas adicionales sobre la consulta, si las hubiera" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="science" label="Laboratorios" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <q-input dense outlined v-model="form.laboratorios" label="Estudios de Laboratorio" type="textarea"
              hint="Resultados de laboratorio o estudios complementarios" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="attach_file" label="Documentos" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
            <q-uploader label="Adjuntar archivos (imágenes o PDF)" multiple batch style="max-width: 100%"
              @added="filesAdded" @removed="filesRemoved" accept=".jpg, .jpeg, .png, .pdf" />
          </div>
        </q-expansion-item>

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat dense color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn dense type="submit" color="primary" :label="isEdit ? 'Actualizar Consulta' : 'Guardar Consulta'"
            :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import type { Patient as PatientType, Consultation as ConsultationType } from 'src/types/index';
import { useAuthStore } from 'src/stores/authStore';
import { useMedicalStore } from 'src/stores/medicalStore';

interface Props {
  patient: PatientType | null;
  consultation?: ConsultationType | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [];
  save: [consultationPayload: FormData];
}>();

const loading = ref(false);
const authStore = useAuthStore();
const medicalStore = useMedicalStore();

const selectedPatient = ref<PatientType | null>(null);
const patientOptions = ref<{ label: string; value: PatientType }[]>([]);

// --- CAMBIOS SCRIPT ---
// 1. Añadimos el ref para el q-uploader
const uploadedFiles = ref<File[]>([]);

// 2. Añadimos los manejadores de eventos
const filesAdded = (files: readonly File[]) => {
  uploadedFiles.value.push(...files);
};

const filesRemoved = (files: readonly File[]) => {
  uploadedFiles.value = uploadedFiles.value.filter(f => !files.includes(f));
};

// 3. Quitamos file1 y file2 del formulario reactivo
const form = reactive({
  fechaConsulta: '',
  motivoConsulta: '',
  anamnesis: '',
  examenFisico: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: '',
  laboratorios: '',
  // file1: null as File | null, // <--- ELIMINADO
  // file2: null as File | null, // <--- ELIMINADO
});

const isEdit = computed(() => !!props.consultation?.id);

const populateForm = () => {
  const consultation = props.consultation;
  if (isEdit.value && consultation) {
    const date = new Date(consultation.fechaConsulta);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    form.fechaConsulta = date.toISOString().slice(0, 16);
    form.motivoConsulta = consultation.motivoConsulta || '';
    form.examenFisico = consultation.examenFisico || '';
    form.diagnostico = consultation.diagnostico || '';
    form.tratamiento = consultation.tratamiento || '';
    form.anamnesis = consultation.anamnesis || '';
    form.observaciones = consultation.observaciones || '';
    form.laboratorios = consultation.laboratorios || '';
    // NOTA: La carga inicial de archivos existentes no se maneja aquí.
    // Necesitarías mostrar las imágenes existentes de props.consultation.imagenes
    // y permitir reemplazarlas o borrarlas.

    // 4. Actualizamos el reseteo del formulario
    // form.file1 = null; // <--- ELIMINADO
    // form.file2 = null; // <--- ELIMINADO
    uploadedFiles.value = []; // <--- AÑADIDO

  } else {
    // Resetear formulario para nueva consulta
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    form.fechaConsulta = now.toISOString().slice(0, 16);
    form.motivoConsulta = '';
    form.examenFisico = '';
    form.anamnesis = '';
    form.diagnostico = '';
    form.tratamiento = '';
    form.observaciones = '';
    form.laboratorios = '';

    // 4. Actualizamos el reseteo del formulario
    // form.file1 = null; // <--- ELIMINADO
    // form.file2 = null; // <--- ELIMINADO
    uploadedFiles.value = []; // <--- AÑADIDO
  }
};

onMounted(() => {
  populateForm();
  if (!props.patient) {
    patientOptions.value = medicalStore.patients.map(p => ({
      label: `${p.nombre} ${p.apellido} - DNI: ${p.dni}`,
      value: p
    }));
  } else {
    selectedPatient.value = props.patient; // Asigna el paciente si viene por prop
  }
});

watch(() => props.consultation, populateForm, { deep: true, immediate: true });
watch(() => props.patient, (newPatient) => {
  if (newPatient) selectedPatient.value = newPatient;
});


const filterPatients = (val: string, update: (callbackFn: () => void) => void) => {
  if (val === '') {
    update(() => {
      patientOptions.value = medicalStore.patients.map(p => ({
        label: `${p.nombre} ${p.apellido} - DNI: ${p.dni}`,
        value: p
      }));
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    const filtered = medicalStore.patients.filter(
      p =>
        p.nombre?.toLowerCase().includes(needle) ||
        p.apellido?.toLowerCase().includes(needle) ||
        p.dni?.includes(needle)
    );
    patientOptions.value = filtered.map(p => ({
      label: `${p.nombre} ${p.apellido} - DNI: ${p.dni}`,
      value: p
    }));
  });
};

const handleSubmit = async () => {
  loading.value = true;
  const medicoId = authStore.user?.medico?.id_medico;

  if (!medicoId) {
    console.error("Error: No se pudo obtener el ID del médico.");
    loading.value = false;
    return;
  }

  const patientToAssign = props.patient || selectedPatient.value;
  if (!patientToAssign) {
    console.error("Error: Paciente no seleccionado.");
    loading.value = false;
    return; // O mostrar notificación al usuario
  }

  try {
    const formData = new FormData();

    formData.append('id_paciente', patientToAssign.id_paciente.toString());
    formData.append('id_medico', medicoId.toString());
    formData.append('fechaConsulta', new Date(form.fechaConsulta).toISOString());
    formData.append('motivoConsulta', form.motivoConsulta || '');
    formData.append('observaciones', form.observaciones || '');
    formData.append('laboratorios', form.laboratorios || '');
    formData.append('anamnesis', form.anamnesis || '');
    formData.append('examenFisico', form.examenFisico || '');
    formData.append('diagnostico', form.diagnostico || '');
    formData.append('tratamiento', form.tratamiento || '');

    // 5. Actualizamos el envío de archivos
    // Adjuntar archivos si existen
    // if (form.file1) { // <--- ELIMINADO
    //   formData.append('files', form.file1); // El backend debe estar preparado para recibir 'files'
    // }
    // if (form.file2) { // <--- ELIMINADO
    //   formData.append('files', form.file2);
    // }

    // <--- AÑADIDO ---
    // Adjuntar archivos del q-uploader
    uploadedFiles.value.forEach(file => {
      // Usamos 'files' como clave, ya que así lo tenías para file1 y file2
      formData.append('files', file);
    });
    // --- FIN CAMBIOS SCRIPT ---

    emit('save', formData);

  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Card improvements */
.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Form inputs improvements */
::v-deep .q-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .q-field:focus-within {
  opacity: 1;
}

::v-deep .q-field__input {
  border-radius: 6px;
  transition: all 0.3s ease;
}

/* Expansion items improvements */
.expansion-style {
  border-radius: 8px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(0, 0, 0, 0.01) !important;
}

.expansion-style:hover {
  background-color: rgba(0, 0, 0, 0.02) !important;
}

.expansion-style :deep(.q-expansion-item__container) {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expansion-style :deep(.q-expansion-item__content) {
  background: var(--app-white);
  border-radius: 0 0 8px 8px;
  padding: 12px;
}

/* Button styling */
::v-deep .q-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

::v-deep .q-btn:hover {
  transform: translateY(-2px);
}

/* Select and other components improvements */
::v-deep .q-select {
  transition: all 0.3s ease;
}

::v-deep .q-uploader {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Icon improvements */
::v-deep .q-icon {
  transition: color 0.3s ease, opacity 0.3s ease;
}

/* Text improvements */
.text-h6 {
  letter-spacing: -0.3px;
  font-weight: 600;
}

.text-subtitle2 {
  letter-spacing: -0.2px;
}

/* Card actions improvements */
::v-deep .q-card-actions {
  gap: 8px;
}
</style>
