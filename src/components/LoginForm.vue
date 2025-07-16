<template>
  <q-card class="q-ma-md" style="max-width: 400px; width: 100%;">
    <q-card-section>
      <div class="text-h6 text-primary">Iniciar Sesión</div>
      <div class="text-subtitle1 text-grey-7">Acceda a su cuenta</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="form.username"
          label="Email o Username"
          filled
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-input
          v-model="form.password"
          label="Contraseña"
          filled
          type="password"
          :rules="[val => !!val || 'La contraseña es requerida']"
        />

        <q-card-actions align="right" class="q-pt-md">
          <q-btn type="submit" label="Ingresar" color="primary" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios'; // Import the API instance

// Define the shape of the login form data
interface LoginForm {
  username: string;
  password: string;
}

const $q = useQuasar();
const loading = ref(false);

const form: LoginForm = reactive({
  username: '',
  password: ''
});

const emit = defineEmits<{
  (e: 'login', formData: LoginForm): void;
}>();

const handleSubmit = async () => {
  loading.value = true;
  try {
    // Make the API call to your backend
    const response = await api.post('http://localhost:3000/auth/login', form); // Use the imported 'api' instance
    console.log('Login successful:', response.data);
    emit('login', { ...form });
    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión exitoso!'
    });
    // You might want to redirect the user or store authentication tokens here
  } catch (error: any) {
    console.error('Error during login:', error.response || error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error en el inicio de sesión. Verifique sus credenciales.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles for LoginForm here if needed */
</style>