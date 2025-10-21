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

        <q-expansion-item group="consultation-sections" icon="description" label="Anamnesis y Examen Físico" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
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
              autogrow hint="Notas adicionales sobre la consulta, si las hubiera" />
          </div>
        </q-expansion-item>

        <q-expansion-item group="consultation-sections" icon="attach_file" label="Archivos Adjuntos" dense-toggle
          class="q-mb-sm bg-grey-1 expansion-style" header-class="text-primary">
          <div class="q-pa-sm">
             <div class="row q-col-gutter-sm">
               <div class="col-12 col-sm-6">
                 <q-file dense outlined v-model="form.file1" label="Imagen 1" hint="Opcional" accept=".jpg, image/*" />
               </div>
               <div class="col-12 col-sm-6">
                 <q-file dense outlined v-model="form.file2" label="Imagen 2" hint="Opcional" accept=".jpg, image/*" />
               </div>
               </div>
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

// Añade campos para los archivos
const form = reactive({
  fechaConsulta: '',
  motivoConsulta: '',
  anamnesis: '',
  examenFisico: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: '',
  file1: null as File | null,
  file2: null as File | null,
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
    // NOTA: La carga inicial de archivos existentes no se maneja aquí.
    // Necesitarías mostrar las imágenes existentes de props.consultation.imagenes
    // y permitir reemplazarlas o borrarlas.
    form.file1 = null;
    form.file2 = null;
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
    form.file1 = null;
    form.file2 = null;
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
    formData.append('anamnesis', form.anamnesis || '');
    formData.append('examenFisico', form.examenFisico || '');
    formData.append('diagnostico', form.diagnostico || '');
    formData.append('tratamiento', form.tratamiento || '');

    // Adjuntar archivos si existen
    if (form.file1) {
      formData.append('files', form.file1); // El backend debe estar preparado para recibir 'files'
    }
    if (form.file2) {
      formData.append('files', form.file2);
    }

    emit('save', formData);

  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Copiamos los estilos relevantes de PatientForm */
.expansion-style :deep(.q-expansion-item__container) {
  border-radius: 8px;
  /* margin-bottom: 8px; No necesario por q-gutter-sm */
}

.expansion-style :deep(.q-expansion-item__content) {
  background: white;
  /* Añadimos padding para separar el contenido del borde */
  /* padding-top: 8px; */ /* Eliminado para usar q-pa-sm en el div interno */
}

/* Ajustes opcionales para q-tabs si los usaras (no es el caso aquí) */
/* .expansion-style :deep(.q-tab) {
  padding: 0 12px;
  min-height: 32px;
} */
/* .expansion-style :deep(.q-tab__label) {
  font-size: 0.875rem;
} */
/* .expansion-style :deep(.q-separator) {
  margin: 8px 0;
} */
</style>
