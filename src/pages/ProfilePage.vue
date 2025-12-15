<template>
    <q-page class="profile-page-container q-pa-md">
        <div style="max-width: 900px; margin: auto">
            <q-card class="profile-card" flat bordered>
                <q-card-section class="text-center q-pa-lg">
                    <q-avatar size="150px" class="shadow-10">
                        <img :src="medico.foto || '/iconDoc.jpg'" alt="Foto de perfil" />
                    </q-avatar>
                    <div class="text-h4 q-mt-md">{{ medico.nombre }} {{ medico.apellido }}</div>
                    <div class="text-subtitle1 text-grey-8">{{ medico.especialidad }}</div>
                    <div class="q-mt-md">
                        <q-chip outline color="primary" text-color="white" icon="badge">
                            Matrícula: {{ medico.matricula || 'N/A' }}
                        </q-chip>
                        <q-chip outline color="secondary" text-color="white" icon="school" class="q-ml-sm">
                            Colegio: {{ medico.colegioMedico || 'N/A' }}
                        </q-chip>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md">
                    <q-btn v-if="!editMode" color="primary" flat icon-right="edit" label="Editar Perfil"
                        @click="editMode = true" />
                </q-card-actions>

                <q-separator inset />

                <q-card-section v-if="!editMode" class="q-pa-lg">
                    <div class="text-h6 q-mb-lg text-primary"><q-icon name="contact_mail" class="q-mr-sm" />
                        Información de Contacto y Personal</div>
                    <q-list separator>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="badge" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>DNI</q-item-label>
                                <q-item-label caption>{{ medico.dni || 'No especificado' }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="email" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Email</q-item-label>
                                <q-item-label caption>{{ userEmail }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="phone" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Teléfono Personal</q-item-label>
                                <q-item-label caption>{{ medico.telefono || 'No especificado' }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="business" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Dirección del Consultorio</q-item-label>
                                <q-item-label caption>{{ medico.direccionConsultorio || 'No especificada'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="call" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Teléfono del Consultorio</q-item-label>
                                <q-item-label caption>{{ medico.telefonoConsultorio || 'No especificado'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="schedule" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Horario de Atención</q-item-label>
                                <q-item-label caption>{{ medico.horarioAtencion || 'No especificado' }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-py-md">
                            <q-item-section avatar> <q-icon color="primary" name="healing" /> </q-item-section>
                            <q-item-section>
                                <q-item-label>Obras Sociales</q-item-label>
                                <q-item-label caption>{{ medico.obrasSocialesAcepta || 'No especificado'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <div v-if="medico.biografia" class="q-mt-xl">
                        <div class="text-h6 q-mb-md text-primary"><q-icon name="info" class="q-mr-sm" /> Biografía</div>
                        <p class="text-body1 text-grey-8" style="white-space: pre-wrap;">{{ medico.biografia }}</p>
                    </div>
                </q-card-section>

                <q-card-section v-else class="q-pa-lg">
                    <div class="text-h6 q-mb-lg text-primary"><q-icon name="edit" class="q-mr-sm" /> Editar Información
                    </div>
                    <q-form @submit.prevent="saveProfile" class="q-gutter-md">

                        <q-input v-model="editForm.nombre" label="Nombre" filled dense class="col-12 col-sm-6"
                            :rules="[val => !!val || 'Nombre requerido']" />
                        <q-input v-model="editForm.apellido" label="Apellido" filled dense class="col-12 col-sm-6"
                            :rules="[val => !!val || 'Apellido requerido']" />

                        <q-input v-model="editForm.dni" label="DNI" filled dense
                            :rules="[val => !!val || 'DNI requerido']" />
                        <q-input v-model="editForm.telefono" label="Teléfono Personal" filled dense />

                        <q-input v-model="editForm.especialidad" label="Especialidad" filled dense
                            class="col-12 col-sm-6" :rules="[val => !!val || 'Especialidad requerida']" />
                        <q-input v-model="editForm.matricula" label="Matrícula" filled dense class="col-12 col-sm-6" />

                        <q-input v-model="editForm.colegioMedico" label="Colegio Médico" filled dense />
                        <q-input v-model="editForm.direccionConsultorio" label="Dirección del Consultorio" filled
                            dense />
                        <q-input v-model="editForm.telefonoConsultorio" label="Teléfono del Consultorio" filled dense />
                        <q-input v-model="editForm.horarioAtencion" label="Horario de Atención" filled dense />
                        <q-input v-model="editForm.obrasSocialesAcepta" label="Obras Sociales que Acepta" filled
                            dense />
                        <q-input v-model="editForm.foto" label="URL de la Foto de Perfil" filled dense />
                        <q-editor v-model="editForm.biografia" placeholder="Escribe una breve biografía..."
                            :toolbar="[['bold', 'italic', 'underline'], ['link'], ['unordered', 'ordered']]" />

                        <div class="q-mt-lg text-right">
                            <q-btn label="Cancelar" color="grey-7" flat @click="cancelEdit" class="q-mr-sm" />
                            <q-btn label="Guardar Cambios" type="submit" color="primary" unelevated
                                :loading="loading" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import type { Doctor, AuthUser } from 'src/types';

const authStore = useAuthStore();
const $q = useQuasar();

const editMode = ref(false);
const loading = ref(false);

const medico = computed<Doctor>(() => authStore.user?.medico || {} as Doctor);
const userEmail = computed(() => authStore.user?.email || 'No especificado');

const editForm = reactive({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    especialidad: '',
    matricula: '',
    colegioMedico: '',
    direccionConsultorio: '',
    telefonoConsultorio: '',
    horarioAtencion: '',
    obrasSocialesAcepta: '',
    biografia: '',
    foto: ''
});

watch(medico, (currentMedico) => {
    if (!editMode.value) {
        Object.assign(editForm, {
            nombre: currentMedico.nombre || '',
            apellido: currentMedico.apellido || '',
            dni: currentMedico.dni || '',
            telefono: currentMedico.telefono || '',
            especialidad: currentMedico.especialidad || '',
            matricula: currentMedico.matricula || '',
            colegioMedico: currentMedico.colegioMedico || '',
            direccionConsultorio: currentMedico.direccionConsultorio || '',
            telefonoConsultorio: currentMedico.telefonoConsultorio || '',
            horarioAtencion: currentMedico.horarioAtencion || '',
            obrasSocialesAcepta: currentMedico.obrasSocialesAcepta || '',
            biografia: currentMedico.biografia || '',
            foto: currentMedico.foto || ''
        });
    }
}, { immediate: true });

watch(editMode, (isEditing) => {
    if (isEditing) {
        Object.assign(editForm, {
            nombre: medico.value.nombre || '',
            apellido: medico.value.apellido || '',
            dni: medico.value.dni || '',
            telefono: medico.value.telefono || '',
            especialidad: medico.value.especialidad || '',
            matricula: medico.value.matricula || '',
            colegioMedico: medico.value.colegioMedico || '',
            direccionConsultorio: medico.value.direccionConsultorio || '',
            telefonoConsultorio: medico.value.telefonoConsultorio || '',
            horarioAtencion: medico.value.horarioAtencion || '',
            obrasSocialesAcepta: medico.value.obrasSocialesAcepta || '',
            biografia: medico.value.biografia || '',
            foto: medico.value.foto || ''
        });
    }
});

const cancelEdit = () => {
    editMode.value = false;
    Object.assign(editForm, {
        nombre: medico.value.nombre || '',
        apellido: medico.value.apellido || '',
        dni: medico.value.dni || '',
        telefono: medico.value.telefono || '',
        especialidad: medico.value.especialidad || '',
        matricula: medico.value.matricula || '',
        colegioMedico: medico.value.colegioMedico || '',
        direccionConsultorio: medico.value.direccionConsultorio || '',
        telefonoConsultorio: medico.value.telefonoConsultorio || '',
        horarioAtencion: medico.value.horarioAtencion || '',
        obrasSocialesAcepta: medico.value.obrasSocialesAcepta || '',
        biografia: medico.value.biografia || '',
        foto: medico.value.foto || ''
    });
}

const saveProfile = async () => {
    if (!medico.value?.id_medico) {
        $q.notify({ color: 'negative', message: 'No se pudo identificar al médico.' });
        return;
    }
    loading.value = true;
    try {
        const response = await api.patch<{ user: AuthUser }>(`/medico/${medico.value.id_medico}`, editForm);

        if (response.data.user && authStore.token) {
            authStore.setLoginData(response.data.user, authStore.token);
        } else {
            console.warn("La respuesta del backend no incluyó el usuario actualizado. Intentando recargar.")
        }

        $q.notify({
            color: 'positive',
            message: 'Perfil actualizado con éxito',
            icon: 'check_circle',
        });
        editMode.value = false;
    } catch (error: any) {
        console.error("Error updating profile:", error.response?.data || error);
        $q.notify({
            color: 'negative',
            message: error.response?.data?.message || 'Error al actualizar el perfil',
            icon: 'report_problem',
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.profile-page-container {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    min-height: 100vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card {
    background-color: var(--app-white);
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
    }
}

/* Avatar improvements */
::v-deep .q-avatar {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.profile-card:hover ::v-deep .q-avatar {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

/* List items improvements */
::v-deep .q-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
}

::v-deep .q-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

/* Icon improvements */
::v-deep .q-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card:hover ::v-deep .q-icon {
    opacity: 0.9;
}

.q-item__label--caption {
    font-size: 1em;
    color: #6b7280;
    transition: color 0.3s ease;
}

.text-h4,
.text-h6 {
    font-weight: 600;
    color: #1f2937;
    letter-spacing: -0.3px;
}

.text-h4 {
    letter-spacing: -0.5px;
}

/* Separator improvements */
::v-deep .q-separator {
    opacity: 0.4;
}

/* Editor improvements */
.q-editor {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.q-editor:focus-within {
    border-color: var(--q-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button improvements */
::v-deep .q-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
}

::v-deep .q-btn:hover {
    transform: translateY(-2px);
}

/* Chip improvements */
::v-deep .q-chip {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
}

::v-deep .q-chip:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

/* Card sections */
::v-deep .q-card-section {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Input fields improvements */
::v-deep .q-field {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .q-field:focus-within {
    opacity: 1;
}
</style>
