<template>
    <div class="q-pa-md">
        <div class="text-h4 text-primary q-mb-md">
            <q-icon name="event" class="q-mr-sm" />
            Calendario de Turnos
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
                        <q-item v-if="sortedAppointments.length === 0" class="text-center">
                            <q-item-section>
                                <q-item-label header class="text-grey-7 q-pa-lg">
                                    No hay turnos para esta fecha.
                                </q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item v-for="appointment in sortedAppointments" :key="appointment.id">
                            <q-item-section avatar>
                                <q-avatar color="primary" text-color="white" icon="schedule" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-weight-bold">{{ appointment.title }}</q-item-label>
                                <q-item-label caption><q-icon name="access_time" class="q-mr-xs" />{{ appointment.time
                                    }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card>
            </div>
        </div>

        <q-dialog v-model="showAddAppointmentDialog" @hide="resetForm">
            <q-card style="width: 400px">
                <q-form @submit="addAppointment">
                    <q-card-section>
                        <div class="text-h6">Nuevo Turno para el {{ formattedDate }}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input v-model="newAppointment.title" label="Título del turno" autofocus lazy-rules
                            :rules="[val => !!val || 'El título es obligatorio']" />
                        <q-input class="q-mt-md" v-model="newAppointment.time" type="time" label="Hora" lazy-rules
                            :rules="[val => !!val || 'La hora es obligatoria']" />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat label="Guardar" color="primary" type="submit" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>
    </div>
</template>
<script setup lang="ts">

import { ref, computed } from 'vue';
import { useAppointmentStore } from 'src/stores/appointmentStore'; // Asumiendo que exportas el tipo Appointment
import { date, useQuasar } from 'quasar';
// import { type DateObject } from 'v-calendar';

const appointmentStore = useAppointmentStore();
const $q = useQuasar();

const selectedDate = ref(new Date());
const showAddAppointmentDialog = ref(false);
const newAppointment = ref({
    title: '',
    time: '',
});

const formattedDate = computed(() => {
    return date.formatDate(selectedDate.value, 'DD [de] MMMM [de] YYYY', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    });
});

const calendarAttributes = computed(() => {
    // MEJORA: Usar un Set para obtener fechas únicas y evitar duplicados
    const appointmentDates = [...new Set(appointmentStore.appointments.map(appt => appt.date))];

    return [
        { key: 'today', highlight: true, dates: new Date() },
        {
            key: 'appointments',
            dot: 'blue',
            // Añadir T00:00:00 para evitar problemas de zona horaria al crear el objeto Date
            dates: appointmentDates.map(d => new Date(`${d}T00:00:00`)),
        },
    ];
});

const appointmentsForSelectedDate = computed(() => {
    const formatted = date.formatDate(selectedDate.value, 'YYYY-MM-DD');
    return appointmentStore.getAppointmentsByDate(formatted);
});

// MEJORA: Propiedad computada para ordenar los turnos por hora
const sortedAppointments = computed(() => {
    // Usar slice() o [...] para crear una copia antes de ordenar, para no mutar el array original
    return [...appointmentsForSelectedDate.value].sort((a, b) => a.time.localeCompare(b.time));
});

// MEJORA: Tipado correcto para el payload del evento
const handleDayClick = (day: any) => {
    if (day.date) {
        selectedDate.value = day.date;
    }
};

const resetForm = () => {
    newAppointment.value = { title: '', time: '' };
};

const addAppointment = () => {
    appointmentStore.addAppointment({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Genera un id único
        title: newAppointment.value.title,
        time: newAppointment.value.time,
        date: date.formatDate(selectedDate.value, 'YYYY-MM-DD'),
    });
    showAddAppointmentDialog.value = false;
    // resetForm se llama ahora con el evento @hide del dialog

    // MEJORA: Notificación de éxito para el usuario
    $q.notify({
        color: 'positive',
        position: 'top',
        icon: 'check_circle',
        message: 'Turno guardado correctamente'
    });
};
</script>

<style scoped>
.custom-calendar {
    border: none;
    width: 100%;
}
</style>