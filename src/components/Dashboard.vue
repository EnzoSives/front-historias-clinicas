<template>
  <div class="dashboard q-pa-md">
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar color="primary" text-color="white" size="52px">
                <q-icon name="people" size="28px" />
              </q-avatar>
              <div>
                <div class="text-h4 text-weight-bold text-primary">{{ totalPatients }}</div>
                <div class="text-subtitle2 text-grey-6">Pacientes Registrados</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar color="teal" text-color="white" size="52px">
                <q-icon name="medical_services" size="28px" />
              </q-avatar>
              <div>
                <div class="text-h4 text-weight-bold text-teal">{{ totalConsultations }}</div>
                <div class="text-subtitle2 text-grey-6">Total de Consultas</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar color="positive" text-color="white" size="52px">
                <q-icon name="calendar_month" size="28px" />
              </q-avatar>
              <div>
                <div class="text-h4 text-weight-bold text-positive">{{ consultationsThisMonth }}</div>
                <div class="text-subtitle2 text-grey-6">Consultas este Mes</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="stat-card" flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar color="deep-orange" text-color="white" size="52px">
                <q-icon name="event_available" size="28px" />
              </q-avatar>
              <div>
                <div class="text-h4 text-weight-bold text-deep-orange">{{ upcomingAppointments }}</div>
                <div class="text-subtitle2 text-grey-6">Turnos del día</div>
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
          <div class="row q-gutter-sm" :class="$q.screen.lt.sm ? 'column' : ''">
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
                <q-item-label caption lines="1">{{ truncateText(consultation.motivoConsulta ?? '', 40) }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ formatRelativeDate(consultation.fechaConsulta)
                }}</q-item-label>
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
import { useAppointmentStore } from "src/stores/appointmentStore";
import type { Patient as PatientType, Consultation as ConsultationType } from "src/types/index";


defineEmits<{
  "select-patient": [patient: PatientType];
  "view-consultation": [consultation: ConsultationType];
  "new-patient": [];
  "new-consultation": [];
  "search-patient": [];
}>();

const medicalStore = useMedicalStore();
const appointmentStore = useAppointmentStore();

// --- Computed Properties for Stats ---
const totalPatients = computed(() => medicalStore.getTotalPatients);
const totalConsultations = computed(() => medicalStore.getTotalConsultations);
const consultationsThisMonth = computed(() => medicalStore.getConsultationsThisMonth);

const upcomingAppointments = computed(() => {
  return appointmentStore.turnosHoy.length;
});

const recentPatients = computed(() => {
  return (medicalStore.patients || [])
    .sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime())
    .slice(0, 4); // Limitado a 4 pacientes
});

const recentConsultations = computed(() => {
  return (medicalStore.consultationsAll || [])
    .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime())
    .slice(0, 4); // Limitado a 4 consultas
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-50 {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.stat-card:hover .opacity-50 {
  opacity: 0.65;
}

.content-card {
  border-radius: 12px;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.q-item {
  padding: 16px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Recent sections styling */
.recent-section {
  border-radius: 12px;
  overflow: hidden;
}

.recent-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recent-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  padding-left: 20px;
}
</style>
