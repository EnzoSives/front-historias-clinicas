<template>
  <q-card class="q-ma-md" style="max-width: 800px; width: 100%;">
    <q-card-section>
      <div class="text-h6 text-primary">Registro de Nuevo Médico</div>
      <div class="text-subtitle1 text-grey-7">Complete los datos para crear su cuenta</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="text-h6 text-secondary q-mb-md">Datos de Usuario</div>
        <q-input
          v-model="form.username"
          label="Username"
          filled
          :rules="[
            val => !!val || 'El username es requerido',
            val => val.trim().length >= 3 && val.trim().length <= 50 || 'El username debe tener entre 3 y 50 caracteres'
          ]"
        />
        <q-input
          v-model="form.email"
          label="Email"
          filled
          type="email"
          :rules="[
            val => !!val || 'El email es requerido',
            val => /.+@.+\..+/.test(val) || 'Debe ser un email válido'
          ]"
        />
        <q-input
          v-model="form.password"
          label="Contraseña"
          filled
          type="password"
          :rules="[
            val => !!val || 'La contraseña es requerida',
            val => val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
          ]"
        />

        <q-separator class="q-my-lg" />

        <div class="text-h6 text-secondary q-mb-md">Datos de Médico</div>
        <div class="row q-gutter-md">
          <q-input
            v-model="form.nombre"
            label="Nombre"
            filled
            class="col"
            :rules="[
              val => !!val || 'El nombre es requerido',
              val => val.trim().length >= 2 && val.trim().length <= 100 || 'El nombre debe tener entre 2 y 100 caracteres'
            ]"
          />
          <q-input
            v-model="form.apellido"
            label="Apellido"
            filled
            class="col"
            :rules="[
              val => !!val || 'El apellido es requerido',
              val => val.trim().length >= 2 && val.trim().length <= 100 || 'El apellido debe tener entre 2 y 100 caracteres'
            ]"
          />
        </div>
        <div class="row q-gutter-md">
          <q-input
            v-model="form.dni"
            label="DNI"
            filled
            class="col"
            :rules="[
              val => !!val || 'El DNI es requerido',
              val => /^\d{7,8}$/.test(val) || 'El DNI debe tener 7 u 8 dígitos'
            ]"
          />
          <q-input
            v-model="form.especialidad"
            label="Especialidad"
            filled
            class="col"
            :rules="[
              val => !!val || 'La especialidad es requerida',
              val => val.trim().length >= 2 && val.trim().length <= 200 || 'La especialidad debe tener entre 2 y 200 caracteres'
            ]"
          />
        </div>
        <q-input
          v-model="form.matricula"
          label="Matrícula"
          filled
          :rules="[
            val => !!val || 'La matrícula es requerida',
            val => val.trim().length >= 3 && val.trim().length <= 50 || 'La matrícula debe tener entre 3 y 50 caracteres'
          ]"
        />

        <q-separator class="q-my-lg" />

        <div class="text-h6 text-secondary q-mb-md">Campos Opcionales</div>
        <q-input
          v-model="form.telefono"
          label="Teléfono"
          filled
          hint="Opcional"
          :rules="[
            val => !val || /^[\d\s\-\+\(\)]+$/.test(val) || 'El teléfono tiene un formato inválido'
          ]"
        />
        <q-input
          v-model="form.colegioMedico"
          label="Colegio Médico"
          filled
          hint="Opcional"
          :rules="[
            val => !val || (val.trim().length >= 2 && val.trim().length <= 200) || 'El colegio médico debe tener entre 2 y 200 caracteres'
          ]"
        />

        <q-card-actions align="right" class="q-pt-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="$emit('cancel')" />
          <q-btn type="submit" label="Registrarse" color="primary" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios'; // Import the API instance

// Define the shape of the registration form data
interface RegisterForm {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  especialidad: string;
  matricula: string;
  telefono?: string;
  colegioMedico?: string;
}

const $q = useQuasar();
const loading = ref(false);

const form: RegisterForm = reactive({
  username: '',
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  dni: '',
  especialidad: '',
  matricula: '',
  telefono: '',
  colegioMedico: ''
});

const emit = defineEmits<{
  (e: 'register', formData: RegisterForm): void;
  (e: 'cancel'): void;
}>();

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Make the API call to your backend
    const response = await api.post('http://localhost:3000/auth/register', form); // Use the imported 'api' instance
    console.log('Registration successful:', response.data);
    emit('register', { ...form });
    $q.notify({
      type: 'positive',
      message: 'Registro exitoso!'
    });
  } catch (error: any) {
    console.error('Error during registration:', error.response || error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error en el registro. Intente nuevamente.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles for RegisterForm here if needed */
</style>