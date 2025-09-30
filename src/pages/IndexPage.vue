<template>
  <q-layout view="lHh Lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawerOpen = !drawerOpen" />

        <q-toolbar-title>
          <q-icon name="local_hospital" class="q-mr-sm" />
          Sistema de Historias Clínicas
        </q-toolbar-title>

        <q-space />

        <q-btn v-if="currentView !== 'dashboard'" flat icon="arrow_back" label="Volver" @click="goBack" />

        <q-btn flat round dense>
          <q-avatar size="32px">
            <img :src="user.avatar" />
          </q-avatar>
          <q-menu>
            <div class="q-pa-md">
              <div class="text-center">
                <q-avatar size="72px">
                  <img :src="user.avatar" />
                </q-avatar>
                <div class="text-weight-bold q-mt-sm">{{ user.name }}</div>
                <div class="text-caption text-grey">{{ user.email }}</div>
              </div>
              <q-separator class="q-my-md" />
              <q-list dense>
                <q-item clickable v-ripple @click="goToProfile">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Mi Perfil</q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-drawer v-model="drawerOpen" :width="280" :breakpoint="700" elevated class="bg-grey-2">
        <q-scroll-area class="fit">
          <q-list>
            <q-item-label header class="flex items-center text-primary q-mb-sm">

              <span class="text-h6">Menú</span>
            </q-item-label>

            <q-item clickable v-ripple @click="currentView = 'dashboard'" :active="currentView === 'dashboard'">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>Inicio</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="currentView = 'patients'" :active="currentView === 'patients'">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>Pacientes</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="currentView = 'consultations'" :active="currentView === 'consultations'">
              <q-item-section avatar>
                <q-icon name="history_edu" />
              </q-item-section>
              <q-item-section>Consultas</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="currentView = 'calendar'" :active="currentView === 'calendar'">
              <q-item-section avatar>
                <q-icon name="event" />
              </q-item-section>
              <q-item-section>Turnos</q-item-section>
            </q-item>

            <!-- <q-item clickable v-ripple @click="showNewPatientForm">
              <q-item-section avatar>
                <q-icon name="person_add" />
              </q-item-section>
              <q-item-section>Nuevo Paciente</q-item-section>
            </q-item> -->

            <q-separator class="q-my-md" />

            <q-item-label header class="text-grey-7">
              <q-icon name="analytics" class="q-mr-sm" />
              Estadísticas
            </q-item-label>

            <q-item>
              <q-item-section avatar>
                <q-icon name="people" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ medicalStore.getTotalPatients }}</q-item-label>
                <q-item-label caption>Pacientes</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="medical_services" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  medicalStore.getTotalConsultations
                }}</q-item-label>
                <q-item-label caption>Consultas</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page class="bg-grey-1 q-page-no-padding-top">
        <div v-if="currentView === 'dashboard'">
          <Dashboard @select-patient="selectPatient" @view-consultation="viewConsultation"
            @new-patient="showNewPatientForm" @new-consultation="showNewConsultationForm(selectedPatient!)"
            @search-patient="currentView = 'patients'" />
        </div>

        <div v-else-if="currentView === 'calendar'">
          <CalendarView />
        </div>

        <div v-else-if="currentView === 'consultations'">
          <div class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="col">
                <div class="text-h4 text-primary">
                  <q-icon name="history_edu" class="q-mr-sm" />
                  Historial de Consultas
                </div>
                <div class="text-subtitle1 text-grey-7">
                  {{ filteredConsultations.length }} consulta(s) encontrada(s)
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="add" label="Nueva Consulta" @click="showNewConsultationForm(null)" />
              </div>
            </div>

            <q-card class="q-mb-md" flat bordered>
              <q-card-section>
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12 col-md-8">
                    <q-input v-model="consultationSearchQuery" filled
                      placeholder="Buscar por paciente, DNI o diagnóstico..." dense>
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                      <template v-slot:append>
                        <q-icon v-if="consultationSearchQuery" name="close" @click="consultationSearchQuery = ''"
                          class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-4 text-right">
                    <q-btn-toggle v-model="consultationSortOrder"
                      :options="[{ label: 'Recientes', value: 'newest' }, { label: 'Antiguas', value: 'oldest' }]"
                      toggle-color="primary" flat dense />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div v-if="filteredConsultations.length > 0" class="row q-col-gutter-md">
              <div v-for="consultation in filteredConsultations" :key="consultation.id"
                class="col-12 col-md-6 col-lg-4">
                <ConsultationCard :consultation="consultation"
                  :patient="getPatientById(consultation.id_paciente) ?? null" @edit="editConsultation"
                  @delete="deleteConsultation" @view-patient="viewPatientHistoryById(consultation.id_paciente)" />
              </div>
            </div>
            <div v-else class="text-center text-grey-6 q-pa-xl">
              <q-icon name="search_off" size="64px" />
              <div class="q-mt-md text-h6">No se encontraron consultas</div>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'patients'">
          <div class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="col">
                <div class="text-h4 text-primary">
                  <q-icon name="people" class="q-mr-sm" />
                  Pacientes
                </div>
                <div class="text-subtitle1 text-grey-7">
                  {{ medicalStore.patients.length }} paciente(s) registrado(s)
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="person_add" label="Nuevo Paciente" @click="showNewPatientForm" />
              </div>
            </div>

            <q-input v-model="patientSearchQuery" filled placeholder="Buscar por nombre, DNI o email..."
              class="q-mb-md">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon v-if="patientSearchQuery" name="close" @click="patientSearchQuery = ''"
                  class="cursor-pointer" />
              </template>
            </q-input>

            <div v-if="filteredPatients.length === 0" class="text-center text-grey-6 q-pa-xl">
              <q-icon name="people" size="64px" />
              <div class="q-mt-md">No se encontraron pacientes</div>
            </div>

            <div v-else class="row">
              <div v-for="patient in filteredPatients" :key="patient.id_paciente" class="col-12 col-md-6 col-lg-4">
                <PatientCard :patient="patient" @select-patient="selectPatient" @view-history="viewPatientHistory"
                  @new-consultation="showNewConsultationForm" @edit-patient="showEditPatientForm"
                  @delete-patient="confirmDeletePatient" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'patient-form'">
          <div class="flex flex-center q-pa-md">
            <PatientForm :patient="selectedPatient" :is-edit="!!selectedPatient" @saved="savePatient"
              @cancel="goBack" />
          </div>
        </div>

        <div v-else-if="currentView === 'patient-history'">
          <PatientHistory :patient="selectedPatient" :consultations="patientConsultations"
            @new-consultation="showNewConsultationForm" @edit-consultation="editConsultation"
            @delete-consultation="deleteConsultation" @edit-patient="showEditPatientForm" />
        </div>

        <div v-else-if="currentView === 'consultation-form'">
          <div class="flex flex-center q-pa-md">
            <ConsultationForm :patient="selectedPatient" :consultation="selectedConsultation" @save="saveConsultation"
              @cancel="goBack" />
          </div>
        </div>

        <div v-else-if="currentView === 'profile'">
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useMedicalStore } from "src/stores/medicalStore";
import { useAuthStore } from "src/stores/authStore";
import type { Patient as PatientType, Consultation as ConsultationType } from "src/types/index";
import Dashboard from "src/components/Dashboard.vue";
import PatientCard from "src/components/PatientCard.vue";
import PatientForm from "src/components/PatientForm.vue";
import PatientHistory from "src/components/PatientHistory.vue";
import ConsultationForm from "src/components/ConsultationForm.vue";
import ConsultationCard from "src/components/ConsultationCard.vue";
import CalendarView from "src/components/CalendarView.vue";

const $q = useQuasar();
const router = useRouter();
const medicalStore = useMedicalStore();
const authStore = useAuthStore();

const drawerOpen = ref(false);
const currentView = ref<
  | "dashboard"
  | "patients"
  | "consultations"
  | "patient-form"
  | "patient-history"
  | "consultation-form"
  | "profile"
  | "calendar"
>("dashboard");

const selectedPatient = ref<PatientType | null>(null);
const selectedConsultation = ref<ConsultationType | null>(null);
const patientSearchQuery = ref("");
const consultationSearchQuery = ref("");
const consultationSortOrder = ref("newest");
const previousView = ref<string>("");

const user = ref({
  name: authStore.user?.username,
  email: authStore.user?.email,
  avatar: "iconDoc.jpg",
});

const goToProfile = () => {
  previousView.value = currentView.value;
  currentView.value = "profile";
};

const logout = () => {
  $q.dialog({
    title: "Confirmar",
    message: "¿Estás seguro de que quieres cerrar la sesión?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authStore.logout();
    medicalStore.clearData();
    router.push("/login");
  });
};

const filteredPatients = computed(() => {
  if (!patientSearchQuery.value) return medicalStore.patients;
  const query = patientSearchQuery.value.toLowerCase();
  return medicalStore.patients.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(query) ||
      p.apellido?.toLowerCase().includes(query) ||
      p.dni?.toLowerCase().includes(query)
  );
});

const getPatientById = (patientId: number): PatientType | undefined => {
  return medicalStore.getPatientById(patientId);
};

const getPatientName = (patientId: number): string => {
  const patient = medicalStore.getPatientById(patientId);
  return patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente Desconocido';
};

const filteredConsultations = computed(() => {
  let consultations = [...medicalStore.consultationsAll];
  if (consultationSearchQuery.value) {
    const query = consultationSearchQuery.value.toLowerCase();
    consultations = consultations.filter(c => {
      const patientName = getPatientName(c.id_paciente).toLowerCase();
      const patientDNI = medicalStore.getPatientById(c.id_paciente)?.dni?.toLowerCase() || '';
      const diagnosis = c.diagnostico?.toLowerCase() || '';
      return patientName.includes(query) || patientDNI.includes(query) || diagnosis.includes(query);
    });
  }
  consultations.sort((a, b) => {
    const dateA = new Date(a.fechaConsulta).getTime();
    const dateB = new Date(b.fechaConsulta).getTime();
    return consultationSortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return consultations;
});

const patientConsultations = computed(() => {
  if (!selectedPatient.value) return [];
  return medicalStore.getConsultationsByPatientId(selectedPatient.value.id_paciente);
});

const selectPatient = (patient: PatientType) => {
  selectedPatient.value = patient;
};

const viewPatientHistory = (patient: PatientType) => {
  previousView.value = currentView.value;
  selectedPatient.value = patient;
  currentView.value = "patient-history";
};

const viewPatientHistoryById = (patientId: number) => {
  const patient = medicalStore.getPatientById(patientId);
  if (patient) {
    viewPatientHistory(patient);
  }
};

const showNewPatientForm = () => {
  previousView.value = currentView.value;
  selectedPatient.value = null;
  currentView.value = "patient-form";
};

const showEditPatientForm = (patient: PatientType) => {
  previousView.value = currentView.value;
  selectedPatient.value = patient;
  currentView.value = "patient-form";
};

const showNewConsultationForm = (patient: PatientType | null) => {
  previousView.value = currentView.value;
  selectedPatient.value = patient;
  selectedConsultation.value = null;
  currentView.value = "consultation-form";
};

const editConsultation = (consultation: ConsultationType) => {
  previousView.value = currentView.value;
  selectedPatient.value = medicalStore.getPatientById(consultation.id_paciente) || null;
  selectedConsultation.value = consultation;
  currentView.value = "consultation-form";
};

const savePatient = async () => {
  await medicalStore.fetchAllPatients(true);
  goBack();
};

// ✅ --- CORRECCIÓN --- ✅
const saveConsultation = async (consultationPayload: any) => {
  try {
    await medicalStore.addConsultation(consultationPayload);
    $q.notify({
      type: "positive",
      message: "Consulta guardada exitosamente",
    });
    await medicalStore.fetchAllConsultations(true); // Recargar la lista de consultas
    if (previousView.value === 'patient-history') {
      currentView.value = 'patient-history';
    } else {
      currentView.value = 'consultations';
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al guardar la consulta",
    });
  }
};


const confirmDeletePatient = (patientId: number) => {
  $q.dialog({
    title: "Confirmar Eliminación",
    message: "Esta acción es irreversible. ¿Está seguro?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deletePatient(patientId);
  });
};

const deletePatient = async (patientId: number) => {
  try {
    await medicalStore.deletePatient(patientId);
    $q.notify({ type: "positive", message: "Paciente eliminado." });
    if (currentView.value === 'patient-history') {
      currentView.value = 'patients';
    }
  } catch (error) {
    $q.notify({ type: "negative", message: "Error al eliminar el paciente." });
  }
};

const deleteConsultation = (consultationId: number) => {
  $q.dialog({
    title: "Confirmar Eliminación",
    message: "¿Eliminar esta consulta?",
    cancel: true,
  }).onOk(async () => {
    try {
      // await medicalStore.deleteConsultation(consultationId);
      $q.notify({ type: 'positive', message: 'Consulta eliminada.' });
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar la consulta.' });
    }
  });
};

const viewConsultation = async (consultation: ConsultationType) => {
  viewPatientHistoryById(consultation.id_paciente);
};

const goBack = () => {
  const validViews = ["dashboard", "patients", "consultations", "patient-history"];
  currentView.value = (validViews.includes(previousView.value) ? previousView.value : "dashboard") as any;
  previousView.value = "";
  selectedPatient.value = null;
  selectedConsultation.value = null;
};

onMounted(async () => {
  await medicalStore.initializeStore();
});
</script>

<style scoped>
.q-layout {
  min-height: 100vh;
}

.q-page-no-padding-top {
  padding-top: 0 !important;
}
</style>