// src/stores/appointmentStore.ts
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Turno } from 'src/types';
import { useAuthStore } from './authStore';
import { date } from 'quasar';

export interface HorarioMedico {
    id: number;
    id_medico: number;
    diaSemana: number; // 0=Dom … 6=Sáb
    horaInicio: string; // "HH:mm:ss"
    horaFin: string;
    duracionMinutos: number;
    maxTurnosPorDia: number;
}

interface AppointmentState {
    turnos: Turno[];
    horarios: HorarioMedico[];
    loading: boolean;
    loadingHorarios: boolean;
    error: string | null;
}

export const useAppointmentStore = defineStore('appointment', {
    state: (): AppointmentState => ({
        turnos: [],
        horarios: [],
        loading: false,
        loadingHorarios: false,
        error: null,
    }),

    getters: {
        turnosHoy: (state) => {
            const hoy = new Date();
            return state.turnos.filter(turno =>
                date.isSameDate(new Date(turno.fechaHora), hoy, 'day')
            );
        },
        maxTurnosDia: (state) => {
            return state.horarios.reduce((sum, h) => sum + h.maxTurnosPorDia, 0);
        },
    },

    actions: {
        async fetchTurnos() {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) { this.error = 'No se pudo obtener el ID del médico.'; return; }

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

        async addTurno(payload: { fechaHora: string; motivo?: string; id_paciente: number }) {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) { this.error = 'No se pudo obtener el ID del médico.'; return null; }

            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Turno>('/turno', { ...payload, id_medico: medicoId });
                this.turnos.push(response.data);
                return response.data;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al guardar el turno.';
                console.error(err);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateTurnoEstado(id: number, estado: Turno['estado']) {
            this.error = null;
            try {
                await api.patch<Turno>(`/turno/${id}`, { estado });
                const idx = this.turnos.findIndex(t => t.id_turno === id);
                if (idx !== -1) this.turnos[idx] = { ...this.turnos[idx]!, estado };
                return true;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al actualizar el turno.';
                console.error(err);
                return null;
            }
        },

        async updateTurno(id: number, payload: { fechaHora?: string; motivo?: string; notas?: string }) {
            this.loading = true;
            this.error = null;
            try {
                await api.patch<Turno>(`/turno/${id}`, payload);
                const idx = this.turnos.findIndex(t => t.id_turno === id);
                if (idx !== -1) this.turnos[idx] = { ...this.turnos[idx]!, ...payload };
                return true;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al actualizar el turno.';
                console.error(err);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deleteTurno(id: number) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/turno/${id}`);
                this.turnos = this.turnos.filter(t => t.id_turno !== id);
                return true;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al eliminar el turno.';
                console.error(err);
                return false;
            } finally {
                this.loading = false;
            }
        },

        // ── Horarios ───────────────────────────────────────────────
        async fetchHorarios() {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) return;

            this.loadingHorarios = true;
            try {
                const response = await api.get<HorarioMedico[]>(`/horario-medico/medico/${medicoId}`);
                this.horarios = response.data;
            } catch (err: any) {
                console.error('Error al cargar horarios:', err);
            } finally {
                this.loadingHorarios = false;
            }
        },

        async addHorario(payload: Omit<HorarioMedico, 'id' | 'id_medico'>) {
            const authStore = useAuthStore();
            const medicoId = authStore.getMedicoId;
            if (!medicoId) return null;

            this.loadingHorarios = true;
            try {
                const response = await api.post<HorarioMedico>('/horario-medico', { ...payload, id_medico: medicoId });
                this.horarios.push(response.data);
                return response.data;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al guardar el horario.';
                return null;
            } finally {
                this.loadingHorarios = false;
            }
        },

        async updateHorario(id: number, payload: Partial<Omit<HorarioMedico, 'id' | 'id_medico'>>) {
            this.loadingHorarios = true;
            try {
                const response = await api.patch<HorarioMedico>(`/horario-medico/${id}`, payload);
                const idx = this.horarios.findIndex(h => h.id === id);
                if (idx !== -1) this.horarios[idx] = response.data;
                return response.data;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al actualizar el horario.';
                return null;
            } finally {
                this.loadingHorarios = false;
            }
        },

        async deleteHorario(id: number) {
            this.loadingHorarios = true;
            try {
                await api.delete(`/horario-medico/${id}`);
                this.horarios = this.horarios.filter(h => h.id !== id);
                return true;
            } catch (err: any) {
                this.error = err?.response?.data?.message ?? 'Error al eliminar el horario.';
                return false;
            } finally {
                this.loadingHorarios = false;
            }
        },
    },
});