<template>
  <div class="dashboard q-pa-md">
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-primary text-white" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">{{ totalPatients }}</div>
                <div class="text-subtitle2 opacity-80">
                  Pacientes Registrados
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="people" size="40px" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-secondary text-white" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">
                  {{ totalConsultations }}
                </div>
                <div class="text-subtitle2 opacity-80">Total de Consultas</div>
              </div>
              <div class="col-auto">
                <q-icon name="medical_services" size="40px" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-positive text-white" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">
                  {{ consultationsThisMonth }}
                </div>
                <div class="text-subtitle2 opacity-80">
                  Consultas este Mes
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="calendar_month" size="40px" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card bg-warning text-white" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h4 text-weight-bold">
                  {{ upcomingAppointments }}
                </div>
                <div class="text-subtitle2 opacity-80">Citas Pendientes</div>
              </div>
              <div class="col-auto">
                <q-icon name="event_available" size="40px" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-mb-lg">
      <q-card class="content-card" flat bordered>
        <q-card-section>
          <div class="text-h6 text-primary q-mb-sm">
            <q-icon name="flash_on" class="q-mr-sm" />
            Acciones Rápidas
          </div>
          <div class="row q-gutter-sm">
            <q-btn class="col" color="primary" icon="person_add" label="Nuevo Paciente" @click="$emit('new-patient')"
              unelevated />
            <q-btn class="col" color="secondary" icon="add_circle" label="Nueva Consulta"
              @click="$emit('new-consultation')" unelevated />
            <q-btn class="col" color="deep-purple" icon="search" label="Buscar Paciente"
              @click="$emit('search-patient')" unelevated />
          </div>
        </q-card-section>
      </q-card>
    </div>


    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-6">
        <q-card class="content-card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-primary">
              <q-icon name="people_alt" class="q-mr-sm" />
              Pacientes Recientes
            </div>
          </q-card-section>

          <q-separator />

          <q-list separator v-if="recentPatients.length > 0">
            <q-item v-for="patient in recentPatients" :key="patient.id_paciente" clickable v-ripple
              @click="$emit('select-patient', patient)">
              <q-item-section avatar>
                <q-avatar :color="getPatientAvatarColor(patient)" text-color="white">
                  {{ getPatientInitials(patient) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ patient.nombre }} {{ patient.apellido }}</q-item-label>
                <q-item-label caption>DNI: {{ patient.dni }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ formatRelativeDate(patient.fechaCreacion) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-lg text-grey">
            <q-icon name="person_search" size="48px" />
            <p class="q-mt-md">Aún no hay pacientes registrados.</p>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-lg-6">
        <q-card class="content-card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-primary">
              <q-icon name="medical_information" class="q-mr-sm" />
              Consultas Recientes
            </div>
          </q-card-section>
          <q-separator />
          <q-list separator v-if="recentConsultations.length > 0">
            <q-item v-for="consultation in recentConsultations" :key="consultation.id" clickable v-ripple
              @click="$emit('view-consultation', consultation)">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white">
                  <q-icon name="medical_services" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ getPatientName(consultation.id_paciente) }}</q-item-label>
                <q-item-label caption lines="1">{{ truncateText(consultation.motivoConsulta ?? undefined, 40)
                }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ formatRelativeDate(consultation.fechaConsulta) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-lg text-grey">
            <q-icon name="history_edu" size="48px" />
            <p class="q-mt-md">No hay consultas recientes.</p>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMedicalStore } from "src/stores/medicalStore";
import type { Patient as PatientType, Consultation as ConsultationType } from "src/types/index";

defineEmits<{
  "select-patient": [patient: PatientType];
  "view-consultation": [consultation: ConsultationType];
  "new-patient": [];
  "new-consultation": [];
  "search-patient": [];
}>();

const medicalStore = useMedicalStore();

// --- Computed Properties for Stats ---
const totalPatients = computed(() => medicalStore.getTotalPatients);
const totalConsultations = computed(() => medicalStore.getTotalConsultations);
const consultationsThisMonth = computed(() => medicalStore.getConsultationsThisMonth);

const upcomingAppointments = computed(() => {
  // Lógica a implementar
  return 0;
});

const recentPatients = computed(() => {
  return (medicalStore.patients || [])
    .sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime())
    .slice(0, 5);
});

const recentConsultations = computed(() => {
  return (medicalStore.consultations || [])
    .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime())
    .slice(0, 5);
});

// --- Helper Functions ---
const getPatientName = (patientId: number): string => {
  const patient = medicalStore.getPatientById(patientId);
  return patient ? `${patient.nombre} ${patient.apellido}` : "Paciente no encontrado";
};

const getPatientInitials = (patient: PatientType): string => {
  return `${patient.nombre?.[0] || ""}${patient.apellido?.[0] || ""}`.toUpperCase();
};

const getPatientAvatarColor = (patient: PatientType): string => {
  const colors = ["primary", "secondary", "positive", "info", "warning", "accent"];
  const index = ((patient.nombre?.charCodeAt(0) || 0) + (patient.apellido?.charCodeAt(0) || 0)) % colors.length;
  return colors[index] || 'primary';
};

const formatRelativeDate = (dateString?: Date | string): string => {
  if (!dateString) return "Fecha desconocida";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString("es-ES", { year: 'numeric', month: 'short', day: 'numeric' });
};

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "Sin diagnóstico";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

</script>

<style scoped>
.dashboard {
  max-width: 1600px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-50 {
  opacity: 0.5;
}

.content-card {
  border-radius: 12px;
  height: 100%;
}

.q-item {
  padding: 16px;
}
</style>