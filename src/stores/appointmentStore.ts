import { defineStore } from 'pinia';

interface Appointment {
    id: string;
    title: string;
    date: string; // Stored in 'YYYY-MM-DD' format
    time: string;
}

export const useAppointmentStore = defineStore('appointment', {
    state: () => ({
        appointments: [] as Appointment[],
    }),
    getters: {
        getAppointmentsByDate: (state) => (date: string) => {
            return state.appointments
                .filter(appointment => appointment.date === date)
                .sort((a, b) => a.time.localeCompare(b.time));
        },
    },
    actions: {
        addAppointment(appointment: Appointment) {
            this.appointments.push(appointment);
        },
    },
});