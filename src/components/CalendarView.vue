<template>
    <div class="q-pa-md">
        <div class="text-h4 text-primary text-weight-bold q-mb-md">
            <!-- <q-icon name="event" class="q-mr-sm" /> -->
            Turnos
        </div>

        <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
                <q-card flat bordered>
                    <v-calendar :attributes="calendarAttributes" @dayclick="handleDayClick" title-position="left"
                        expanded class="custom-calendar" />
                </q-card>
            </div>

            <div class="col-12 col-md-8">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="row items-center justify-between">
                            <div class="col">
                                <div class="text-h6">Turnos para el {{ formattedDate }}</div>
                            </div>
                            <div class="col-auto">
                                <q-btn color="primary" icon="add" round @click="showAddAppointmentDialog = true"
                                    aria-label="Agregar Turno" />
                            </div>
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-list separator>
                        <q-item v-if="appointmentsForSelectedDate.length === 0" class="text-center">
                            <q-item-section>
                                <q-item-label header class="text-grey-7 q-pa-lg">
                                    No hay turnos para esta fecha.
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item v-for="turno in appointmentsForSelectedDate" :key="turno.id_turno">
                            <q-item-section avatar>
                                <q-avatar color="primary" text-color="white" icon="person" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-weight-bold">{{ turno.paciente.nombre }} {{
                                    turno.paciente.apellido }}</q-item-label>
                                <q-item-label caption><q-icon name="access_time" class="q-mr-xs" />{{
                                    formatTime(turno.fechaHora)
                                }}</q-item-label>
                                <q-item-label caption v-if="turno.motivo" class="ellipsis">{{ turno.motivo
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card>
            </div>
        </div>

        <q-dialog v-model="showAddAppointmentDialog" @hide="resetForm">
            <q-card class="q-dialog-responsive">
                <q-form @submit="addAppointment">
                    <q-card-section>
                        <div class="text-h6">Nuevo Turno para el {{ formattedDate }}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none q-gutter-md">
                        <q-select filled v-model="newAppointment.paciente" use-input hide-selected fill-input
                            input-debounce="0" :options="patientOptions" @filter="filterPatients"
                            label="Buscar Paciente" :rules="[val => !!val || 'Debe seleccionar un paciente']">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">No se encontraron pacientes</q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-input v-model="newAppointment.time" type="time" label="Hora" lazy-rules
                            :rules="[val => !!val || 'La hora es obligatoria']" />
                        <q-input v-model="newAppointment.motivo" label="Motivo (opcional)" autogrow type="textarea" />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat label="Guardar" color="primary" type="submit" :loading="appointmentStore.loading" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAppointmentStore } from 'src/stores/appointmentStore';
import { useMedicalStore } from 'src/stores/medicalStore';
import { date, useQuasar } from 'quasar';
import type { Turno } from 'src/types';

const appointmentStore = useAppointmentStore();
const medicalStore = useMedicalStore();
const $q = useQuasar();

const selectedDate = ref(new Date());
const showAddAppointmentDialog = ref(false);

const newAppointment = ref<{
    paciente: { label: string, value: number } | null;
    time: string;
    motivo: string;
}>({
    paciente: null,
    time: '',
    motivo: ''
});

const patientOptions = ref<{ label: string, value: number }[]>([]);

onMounted(() => {
    appointmentStore.fetchTurnos();
    if (medicalStore.patients.length === 0) {
        medicalStore.fetchAllPatients();
    }
    patientOptions.value = medicalStore.patients.map(p => ({
        label: `${p.nombre} ${p.apellido} (DNI: ${p.dni})`,
        value: p.id_paciente,
    }));
});

const formattedDate = computed(() => date.formatDate(
    selectedDate.value,
    'DD [de] MMMM [de] YYYY',
    {
        days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        months: [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
    }
));

const calendarAttributes = computed(() => [
    { key: 'today', highlight: true, dates: new Date() },
    {
        key: 'turnos',
        dot: 'blue',
        dates: appointmentStore.turnos.map(t => new Date(t.fechaHora)),
    },
]);

const appointmentsForSelectedDate = computed(() => {
    return appointmentStore.turnos
        .filter(t => date.isSameDate(new Date(t.fechaHora), selectedDate.value, 'day'))
        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
});

const formatTime = (isoString: string) => date.formatDate(new Date(isoString), 'HH:mm');

const handleDayClick = (day: any) => {
    if (day.date) {
        selectedDate.value = day.date;
    }
};

const filterPatients = (val: string, update: (callbackFn: () => void) => void) => {
    update(() => {
        if (!val) {
            patientOptions.value = medicalStore.patients.map(p => ({
                label: `${p.nombre} ${p.apellido} (DNI: ${p.dni})`,
                value: p.id_paciente
            }));
        } else {
            const needle = val.toLowerCase();
            patientOptions.value = medicalStore.patients
                .filter(p =>
                    p.nombre?.toLowerCase().includes(needle) ||
                    p.apellido?.toLowerCase().includes(needle) ||
                    p.dni?.includes(needle)
                )
                .map(p => ({
                    label: `${p.nombre} ${p.apellido} (DNI: ${p.dni})`,
                    value: p.id_paciente
                }));
        }
    });
};

const resetForm = () => {
    newAppointment.value = { paciente: null, time: '', motivo: '' };
};

const addAppointment = async () => {
    if (!newAppointment.value.paciente || !newAppointment.value.time) {
        $q.notify({
            color: 'negative',
            icon: 'report_problem',
            message: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    const [hours, minutes] = newAppointment.value.time.split(':');
    const fechaHora = new Date(selectedDate.value);
    fechaHora.setHours(
        parseInt(hours ?? '0', 10),
        parseInt(minutes ?? '0', 10),
        0,
        0
    );

    const result = await appointmentStore.addTurno({
        fechaHora: fechaHora.toISOString(),
        id_paciente: newAppointment.value.paciente.value,
        motivo: newAppointment.value.motivo,
    });

    if (result) {
        showAddAppointmentDialog.value = false;
        $q.notify({
            color: 'positive',
            icon: 'check_circle',
            message: 'Turno guardado correctamente'
        });
    } else {
        $q.notify({
            color: 'negative',
            icon: 'report_problem',
            message: appointmentStore.error || 'Error al guardar el turno.'
        });
    }
};
</script>

<style scoped>
/* Card improvements */
::v-deep .q-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .q-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Calendar styling */
.custom-calendar {
    border: none;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
}

/* Calendar items improvements */
::v-deep .vc-header {
    transition: all 0.3s ease;
}

::v-deep .vc-day {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 6px;
}

::v-deep .vc-day:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

/* List items improvements */
::v-deep .q-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
}

::v-deep .q-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

/* Button styling */
::v-deep .q-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
}

::v-deep .q-btn:hover {
    transform: translateY(-2px);
}

/* Avatar styling */
::v-deep .q-avatar {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .q-item:hover .q-avatar {
    transform: scale(1.05);
}

/* Input fields improvements */
::v-deep .q-field {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Separator improvements */
::v-deep .q-separator {
    opacity: 0.4;
}

/* Title improvements */
.text-h4 {
    letter-spacing: -0.5px;
    font-weight: 600;
}

.text-h6 {
    letter-spacing: -0.3px;
    font-weight: 500;
}

/* Dialog responsive improvements */
::v-deep .q-dialog__inner {
    border-radius: 12px;
}

::v-deep .q-dialog-responsive {
    min-width: 400px;
}

@media (max-width: 600px) {
    ::v-deep .q-dialog-responsive {
        min-width: 90vw;
    }
}
</style>