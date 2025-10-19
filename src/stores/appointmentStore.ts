// src/stores/appointmentStore.ts
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Turno } from 'src/types';
import { useAuthStore } from './authStore';
import { date } from 'quasar';

interface AppointmentState {
    turnos: Turno[];
    loading: boolean;
    error: string | null;
}

export const useAppointmentStore = defineStore('appointment', {
    state: (): AppointmentState => ({
        turnos: [],
        loading: false,
        error: null,
    }),

    // 👇 2. AÑADE ESTA SECCIÓN DE GETTERS
    getters: {
        turnosHoy: (state) => {
            const hoy = new Date();
            return state.turnos.filter(turno =>
                date.isSameDate(new Date(turno.fechaHora), hoy, 'day')
            );
        },
    },

    actions: {
        async fetchTurnos() {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) {
                this.error = 'No se pudo obtener el ID del médico.';
                return;
            }

            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<Turno[]>(`/turno/medico/${medicoId}`);
                this.turnos = response.data;
            } catch (err: any) {
                this.error = 'Error al cargar los turnos.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async addTurno(payload: { fechaHora: string; motivo?: string; id_paciente: number; }) {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) {
                this.error = 'No se pudo obtener el ID del médico para crear el turno.';
                return null;
            }

            this.loading = true;
            try {
                const response = await api.post<Turno>('/turno', { ...payload, id_medico: medicoId });
                this.turnos.push(response.data);
                return response.data;
            } catch (err: any) {
                this.error = 'Error al guardar el turno.';
                console.error(err);
                return null;
            } finally {
                this.loading = false;
            }
        },
    },
});