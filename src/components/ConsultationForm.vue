<template>
  <q-card class="q-ma-md" style="max-width: 900px; width: 100%;">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">
        <q-icon name="medical_services" class="q-mr-sm" />
        {{ isEdit ? 'Editar Consulta' : 'Nueva Consulta' }}
      </div>
      <div class="text-subtitle2" v-if="patient || selectedPatient">
        Paciente: {{ (patient || selectedPatient)?.nombre }} {{ (patient || selectedPatient)?.apellido }} (DNI: {{
          (patient || selectedPatient)?.dni ?? 'N/A' }})
      </div>
      <div class="text-subtitle2" v-else>
        Seleccione un paciente para continuar
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div v-if="!patient">
          <q-select filled v-model="selectedPatient" use-input hide-selected fill-input input-debounce="0"
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

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input v-model="form.fechaConsulta" label="Fecha de Consulta" filled type="datetime-local"
              :rules="[val => !!val || 'La fecha es requerida']">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-input v-model="form.motivoConsulta" label="Motivo de Consulta" filled
              :rules="[val => !!val || 'El motivo es requerido']" hint="Motivo principal de la visita">
              <template v-slot:prepend>
                <q-icon name="live_help" />
              </template>
            </q-input>
          </div>
        </div>

        <q-card flat bordered class="q-my-md">
          <q-card-section>
            <div class="text-subtitle1 text-primary q-mb-sm">
              <q-icon name="description" /> Anamnesis y Examen Físico
            </div>
            <q-input v-model="form.anamnesis" label="Anamnesis" filled type="textarea" autogrow
              hint="Historial clínico y detalles del padecimiento actual" />
            <q-input v-model="form.examenFisico" label="Examen Físico" filled type="textarea" autogrow class="q-mt-md"
              hint="Resultados relevantes del examen físico" />
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-primary q-mb-sm">
              <q-icon name="assignment_turned_in" /> Diagnóstico y Tratamiento
            </div>
            <q-input v-model="form.diagnostico" label="Diagnóstico" filled type="textarea" autogrow
              :rules="[val => !!val || 'El diagnóstico es requerido']" hint="Diagnóstico médico basado en los datos" />
            <q-input v-model="form.tratamiento" label="Tratamiento" filled type="textarea" autogrow class="q-mt-md"
              :rules="[val => !!val || 'El tratamiento es requerido']"
              hint="Describa el tratamiento y las indicaciones recomendadas" />
          </q-card-section>
        </q-card>

        <q-input v-model="form.observaciones" label="Observaciones Adicionales" filled type="textarea" autogrow
          hint="Notas adicionales sobre la consulta, si las hubiera">
          <template v-slot:prepend>
            <q-icon name="speaker_notes" />
          </template>
        </q-input>

        <q-card flat bordered class="q-my-md">
          <q-card-section>
            <div class="text-subtitle1 text-primary q-mb-sm">
              <q-icon name="image" /> Imágenes de la Consulta
            </div>
            <q-uploader url="" label="Seleccionar Imágenes" multiple batch accept=".jpg, image/*" @added="onFilesAdded"
              @removed="onFilesRemoved" style="width: 100%;" />
          </q-card-section>
        </q-card>

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat color="grey-7" label="Cancelar" @click="$emit('cancel')" />
          <q-btn type="submit" color="primary" :label="isEdit ? 'Actualizar Consulta' : 'Guardar Consulta'"
            :loading="loading" icon="save" unelevated />
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
  save: [consultationPayload: FormData]; // Se emite un FormData
}>();

const loading = ref(false);
const authStore = useAuthStore();
const medicalStore = useMedicalStore();

const selectedPatient = ref<PatientType | null>(null);
const patientOptions = ref<{ label: string; value: PatientType }[]>([]);
const uploadedFiles = ref<File[]>([]); // Para almacenar los archivos seleccionados

const form = reactive({
  fechaConsulta: '',
  motivoConsulta: '',
  anamnesis: '',
  examenFisico: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: ''
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
  } else {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    form.fechaConsulta = now.toISOString().slice(0, 16);
    form.motivoConsulta = '';
    form.examenFisico = '';
    form.anamnesis = '';
    form.diagnostico = '';
    form.tratamiento = '';
    form.observaciones = '';
  }
};

onMounted(() => {
  populateForm();
  if (!props.patient) {
    patientOptions.value = medicalStore.patients.map(p => ({
      label: `${p.nombre} ${p.apellido} - DNI: ${p.dni}`,
      value: p
    }));
  }
});

watch(() => props.consultation, populateForm, { deep: true, immediate: true });

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

// MANEJO DE ARCHIVOS
const onFilesAdded = (files: readonly File[]) => {
  uploadedFiles.value.push(...files);
};

const onFilesRemoved = (files: readonly File[]) => {
  for (const file of files) {
    const index = uploadedFiles.value.findIndex(f => f.name === file.name);
    if (index > -1) {
      uploadedFiles.value.splice(index, 1);
    }
  }
};

const handleSubmit = async () => {
  loading.value = true;
  const medicoId = authStore.user?.medico?.id_medico;

  if (!medicoId) {
    console.error("Error: No se pudo obtener el ID del médico. Revisa el authStore.");
    loading.value = false;
    return;
  }

  try {
    const formData = new FormData();
    const patientToAssign = props.patient || selectedPatient.value;

    if (!patientToAssign) {
      loading.value = false;
      return;
    }

    formData.append('id_paciente', patientToAssign.id_paciente.toString());
    formData.append('id_medico', medicoId.toString());
    formData.append('fechaConsulta', new Date(form.fechaConsulta).toISOString());
    formData.append('motivoConsulta', form.motivoConsulta || '');
    formData.append('observaciones', form.observaciones || '');
    formData.append('anamnesis', form.anamnesis || '');
    formData.append('examenFisico', form.examenFisico || '');
    formData.append('diagnostico', form.diagnostico || '');
    formData.append('tratamiento', form.tratamiento || '');

    // Adjuntar archivos
    for (const file of uploadedFiles.value) {
      formData.append('files', file);
    }

    if (isEdit.value && props.consultation) {
      // En un caso de edición, necesitarías un endpoint diferente que maneje la actualización
      // de los datos y, opcionalmente, la adición/eliminación de imágenes.
      // Por simplicidad, este ejemplo se enfoca en la creación.
    }

    emit('save', formData);

  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}

.q-card__section--bordered {
  border-color: rgba(0, 0, 0, 0.05);
}
</style>