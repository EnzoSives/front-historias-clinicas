<template>
  <div v-if="patient" class="patient-history">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center justify-between wrap q-col-gutter-xs">
          <div class="col">
            <div class="text-h5 text-primary">
              <q-icon name="history" class="q-mr-sm" />
              Historial Médico
            </div>
            <div class="text-h6">
              {{ patient.nombre }} {{ patient.apellido }}
            </div>
            <div class="text-subtitle2 text-grey-7">
              DNI: {{ patient.dni }} •
              {{ patient.edad || calculateAge(String(patient.fechaNacimiento || '')) }} años •
              {{ patient.sexo }}
            </div>
          </div>
          <div class="col-auto" v-if="$q.screen.gt.xs">
            <q-btn color="orange" icon="edit" label="Editar Paciente" class="q-mr-sm" :disable="!patient"
              @click="patient && $emit('edit-patient', patient)" />
            <q-btn color="primary" icon="add" label="Nueva Consulta" :disable="!patient"
              @click="patient && $emit('new-consultation', patient)" />
          </div>
          <div class="col-auto" v-else>
            <q-btn round dense color="orange" icon="edit" class="q-mr-sm" :disable="!patient"
              @click="patient && $emit('edit-patient', patient)">
              <q-tooltip class="bg-grey-8" anchor="bottom middle" self="top middle">Editar Paciente</q-tooltip>
            </q-btn>
            <q-btn round dense color="primary" icon="add" :disable="!patient"
              @click="patient && $emit('new-consultation', patient)">
              <q-tooltip class="bg-grey-8" anchor="bottom middle" self="top middle">Nueva Consulta</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-7">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">
              <q-icon name="person" class="q-mr-sm" />
              Información del Paciente
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md">
                <q-list separator>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="cake" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Fecha de Nacimiento</q-item-label>
                      <q-item-label caption>{{ formatDate(String(patient.fechaNacimiento || '')) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="public" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Lugar de Nacimiento</q-item-label>
                      <q-item-label caption>{{ patient.lugarNacimiento || "No especificado" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="phone" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Teléfono Celular</q-item-label>
                      <q-item-label caption>{{ patient.telefonoCelular || "No especificado" }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Teléfono Fijo</q-item-label>
                      <q-item-label caption>{{ patient.telefonoFijo || "No especificado" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="location_on" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Dirección</q-item-label>
                      <q-item-label caption>{{ patient.direccion || "No especificada" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-12 col-md">
                <q-list separator>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="work" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Ocupación</q-item-label>
                      <q-item-label caption>{{ patient.ocupacion || "No especificada" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="favorite" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Estado Civil</q-item-label>
                      <q-item-label caption>{{ patient.estadoCivil || "No especificado" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="shield" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Obra Social</q-item-label>
                      <q-item-label caption>{{ patient.obraSocial || "No especificada" }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Nº Afiliado</q-item-label>
                      <q-item-label caption>{{ patient.afiliadoObraSocial || "No especificado" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="calendar_today" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Fecha de Creación</q-item-label>
                      <q-item-label caption>{{ formatDate(String(patient.fechaCreacion || '')) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">
              <q-icon name="medical_information" class="q-mr-sm" />
              Información Médica y Antecedentes
            </div>
            <div class="q-gutter-y-md">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-weight-medium">
                    <q-icon name="history" class="q-mr-sm" />Antecedentes Personales Médicos
                  </div>
                  <div class="q-mt-sm text-caption">{{ patient.antecedentesPersonalesMedicos || "No se reportan." }}
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-weight-medium">
                    <q-icon name="healing" class="q-mr-sm" />Antecedentes Quirúrgicos
                  </div>
                  <div class="q-mt-sm text-caption">{{ patient.antecedentesQuirurgicos || "No se reportan." }}</div>
                </q-card-section>
              </q-card>
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-weight-medium">
                    <q-icon name="family_restroom" class="q-mr-sm" />Antecedentes
                    Heredo-Familiares
                  </div>
                  <div class="q-mt-sm text-caption">{{ patient.antecedentesHeredoFamiliares || "No se reportan." }}
                  </div>
                </q-card-section>
              </q-card>
              <div class="row q-gutter-md">
                <div class="col-12 col-md">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-weight-medium text-negative">
                        <q-icon name="warning" class="q-mr-sm" />Alergias
                      </div>
                      <div class="q-mt-sm text-caption">{{ patient.alergias || "No se reportan alergias." }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-weight-medium text-info">
                        <q-icon name="medication" class="q-mr-sm" />Medicación
                        Habitual
                      </div>
                      <div class="q-mt-sm text-caption">{{ patient.medicacionHabitual }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-weight-medium text-orange">
                        <q-icon name="smoking_rooms" class="q-mr-sm" />Hábitos
                        Tóxicos
                      </div>
                      <div class="q-mt-sm text-caption">{{ patient.habitosToxicos || "No se reportan." }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">
              <q-icon name="accessibility_new" class="q-mr-sm" />
              Examen Físico
            </div>
            <div class="row q-col-gutter-sm q-mb-md text-center">
              <div class="col-4 col-sm-2">
                <q-item-label>Peso</q-item-label>
                <q-item-label caption>{{ patient.examenFisicoPeso
                  || 'N/A' }} kg</q-item-label>
              </div>
              <div class="col-4 col-sm-2">
                <q-item-label>Talla</q-item-label>
                <q-item-label caption>{{
                  patient.examenFisicoTalla || 'N/A' }} m</q-item-label>
              </div>
              <div class="col-4 col-sm-2">
                <q-item-label>IMC</q-item-label>
                <q-item-label caption>{{ patient.examenFisicoIMC
                  || 'N/A' }}</q-item-label>
              </div>
              <div class="col-4 col-sm-2">
                <q-item-label>TA</q-item-label>
                <q-item-label caption>{{ patient.examenFisicoTA ||
                  'N/A' }}</q-item-label>
              </div>
              <div class="col-4 col-sm-2">
                <q-item-label>FC</q-item-label>
                <q-item-label caption>{{ patient.examenFisicoFC ||
                  'N/A' }}</q-item-label>
              </div>
              <div class="col-4 col-sm-2">
                <q-item-label>FR</q-item-label>
                <q-item-label caption>{{ patient.examenFisicoFR ||
                  'N/A' }}</q-item-label>
              </div>
            </div>
            <q-list bordered>
              <q-expansion-item expand-separator icon="list" label="Revisión Detallada por Sistemas"
                header-class="text-primary">
                <q-card>
                  <q-card-section>
                    <p><strong>Sistema Nervioso:</strong> {{ patient.examenFisicoSistemaNervioso }}</p>
                    <p><strong>AP Cardiovascular:</strong> {{ patient.examenFisicoAPCardiovascular }}</p>
                    <p><strong>AP Respiratorio:</strong> {{ patient.examenFisicoAPRespiratorio }}</p>
                    <p><strong>AP Digestivo:</strong> {{ patient.examenFisicoAPDigestivo }}</p>
                    <p><strong>AP Genitourinario:</strong> {{ patient.examenFisicoAPGenitourinario }}</p>
                    <p><strong>Sistema Endocrino:</strong> {{ patient.examenFisicoSistemaEndocrino }}</p>
                    <p><strong>Sistema Hematopoyético:</strong> {{ patient.examenFisicoSistemaHematopoyetico }}</p>
                    <p><strong>Sistema Musculoesquelético:</strong> {{ patient.examenFisicoSistemaMusculoEsqueletico }}
                    </p>
                    <p><strong>Piel y Anexos:</strong> {{ patient.examenFisicoPielAnexos }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>

            <div class="text-weight-medium q-mt-lg">
              <q-icon name="visibility" class="q-mr-sm" />
              Observaciones
            </div>
            <q-card flat bordered class="q-mt-sm">
              <q-card-section>
                <div class="text-caption">{{ patient.primerObservacion || "No se reportan observaciones." }}</div>
              </q-card-section>
            </q-card>

            <div class="text-weight-medium q-mt-lg">
              <q-icon name="science" class="q-mr-sm" />
              Laboratorios
            </div>
            <q-card flat bordered class="q-mt-sm">
              <q-card-section>
                <div class="text-caption">{{ patient.laboratorios || "No se reportan estudios de laboratorio." }}</div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>

        <q-card v-if="patientImageUrls.length > 0" class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">
              <q-icon name="image" class="q-mr-sm" />
              Imágenes Adjuntas
            </div>
            <div class="row q-gutter-md">
              <div v-for="url in patientImageUrls" :key="url" class="col-12 col-sm-6 col-md-4">
                <a :href="url" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                  <q-img :src="url" spinner-color="primary"
                    style="height: 200px; max-width: 100%; border-radius: 8px; cursor: pointer;">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-negative text-white text-center q-pa-sm">
                        No se pudo cargar la imagen
                      </div>
                    </template>
                  </q-img>
                </a>
              </div>
            </div>
          </q-card-section>
        </q-card>

      </div>
      <div class="col-12 col-lg-5 consultations-col">
        <q-card class="consultations-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="col">
                <div class="text-h6 text-primary">
                  <q-icon name="history_edu" class="q-mr-sm" />
                  Historial de Consultas ({{ sortedConsultations.length }})
                </div>
              </div>
              <div class="col-auto">
                <q-btn-toggle v-model="sortOrder" :options="sortOptions" color="primary" flat />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="consultations-scroll">
              <div v-if="sortedConsultations.length === 0" class="text-center text-grey-6 q-pa-lg">
                <q-icon name="medical_services" size="64px" />
                <div class="q-mt-md">No hay consultas registradas</div>
              </div>
              <div v-else>
                <ConsultationCard v-for="consultation in sortedConsultations" :key="consultation.id"
                  :consultation="consultation" :patient="patient" @edit="$emit('edit-consultation', consultation)"
                  @delete="$emit('delete-consultation', consultation.id)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  watch,
  defineProps,
  defineEmits
} from "vue";
import type {
  Patient as PatientType, Consultation as ConsultationType
} from "src/types/index";
import ConsultationCard from "src/components/ConsultationCard.vue";
import {
  useMedicalStore
} from "src/stores/medicalStore";
import { useQuasar } from "quasar";

interface Props {
  patient: PatientType | null;
}

const props = defineProps<Props>();

defineEmits<{
  "new-consultation": [patient: PatientType];
  "edit-consultation": [consultation: ConsultationType];
  "delete-consultation": [consultationId: number];
  "edit-patient": [patient: PatientType];
}>();

const medicalStore = useMedicalStore();
const $q = useQuasar();
const sortOrder = ref("newest");
const loading = ref(false);

// Propiedad computada que construye las URLs de las imágenes.
const patientImageUrls = computed(() => {
  const urls = [];
  // Asegúrate de que esta URL coincida con la de tu servidor backend.
  const baseUrl = 'http://localhost:3000/uploads/';

  // Si el paciente tiene un nombre de archivo para 'imagen', construye la URL completa.
  if (props.patient?.imagenes) {
    urls.push(baseUrl + props.patient.imagenes[0]?.filename);
  }
  // Lo mismo para 'imagen2'.
  if (props.patient?.imagenes) {
    urls.push(baseUrl + props.patient.imagenes[1]?.filename);
  }

  return urls;
});

const loadConsultations = async () => {
  if (!props.patient?.id_paciente) return;
  loading.value = true;
  try {
    await medicalStore.fetchConsultationsByPatient(props.patient.id_paciente);
  } catch (error) {
    console.error("Error al cargar las consultas:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadConsultations();
});

watch(() => props.patient, (newPatient, oldPatient) => {
  if (newPatient && newPatient.id_paciente !== oldPatient?.id_paciente) {
    loadConsultations();
  }
}, { immediate: true });

const sortOptions = [{
  label: "Más reciente",
  value: "newest"
},
{
  label: "Más antiguo",
  value: "oldest"
},
];

const sortedConsultations = computed(() => {
  const patientConsultations = (medicalStore.consultations || []).filter(
    (c) => props.patient && c.id_paciente === props.patient.id_paciente
  );

  if (sortOrder.value === "newest") {
    return [...patientConsultations].sort(
      (a, b) =>
        new Date(b.fechaConsulta).getTime() -
        new Date(a.fechaConsulta).getTime()
    );
  } else {
    return [...patientConsultations].sort(
      (a, b) =>
        new Date(a.fechaConsulta).getTime() -
        new Date(b.fechaConsulta).getTime()
    );
  }
});

const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Fecha no disponible';
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.patient-history {
  max-width: 1800px;
  margin: 0 auto;
  padding: 16px;
}

/* Desktop: mantener visible el panel de consultas con scroll interno */
@media (min-width: 1024px) {
  .consultations-card {
    position: sticky;
    top: 16px;
  }

  .consultations-scroll {
    max-height: 70vh;
    overflow: auto;
  }
}
</style>