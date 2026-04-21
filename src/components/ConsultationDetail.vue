<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
            <q-card-section class="bg-primary text-white row items-center q-pb-sm">
                <q-icon name="visibility" size="sm" class="q-mr-md" />
                <div class="text-h6">Detalles de la Consulta</div>
                <q-space />
                <q-btn icon="close" flat round dense @click="onDialogHide" />
            </q-card-section>

            <q-card-section v-if="consultation && patient" class="q-pt-md">
                <div class="q-mb-md">
                    <div class="text-h6">{{ patient.apellido }} {{ patient.nombre }}</div>
                    <div class="text-caption text-grey">DNI: {{ patient.dni }}</div>
                </div>

                <q-list bordered separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="event" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Fecha y Hora</q-item-label>
                            <q-item-label caption>{{ formatDate(consultation.fechaConsulta) }} - {{
                                formatTime(consultation.fechaConsulta) }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="live_help" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Motivo de Consulta</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.motivoConsulta
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="description" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Anamnesis</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.anamnesis
                                }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="accessibility" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Examen Físico</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.examenFisico
                                }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="flag" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Diagnóstico</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.diagnostico
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="primary" name="medication" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Tratamiento</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.tratamiento
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item v-if="consultation.observaciones">
                        <q-item-section avatar>
                            <q-icon color="primary" name="speaker_notes" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Observaciones</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.observaciones
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item v-if="consultation.laboratorios">
                        <q-item-section avatar>
                            <q-icon color="primary" name="science" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Laboratorios</q-item-label>
                            <q-item-label caption class="text-body2 text-wrap">{{ consultation.laboratorios
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="primary" flat label="Cerrar" @click="onDialogOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar' // <-- 4. Importar el composable
import type { Consultation as ConsultationType, Patient as PatientType } from 'src/types/index';

interface Props {
    consultation: ConsultationType;
    patient: PatientType;
}

defineProps<Props>();

// 5. Definir los emits requeridos por el plugin
defineEmits([
    ...useDialogPluginComponent.emits
]);

// 6. Obtener las funciones y referencias del plugin
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();


const formatDate = (date: any): string => {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (date: any): string => {
    return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<style>
.text-wrap {
    white-space: pre-wrap;
    word-break: break-word;
}

/* Opcional: añade una clase estándar para los diálogos de Quasar */
.q-dialog-plugin {
    border-radius: 8px;
}
</style>