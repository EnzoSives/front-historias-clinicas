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
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/authStore';
import { AuthUser } from 'src/types/index'; // Import AuthUser type

// Define la interfaz para el formulario de login
interface LoginForm {
  username: string;
  password: string;
}

// Define la interfaz para la respuesta del servidor, reflejando exactamente lo que recibes
interface LoginResponse {
  access_token: string;
  user: AuthUser;
  message?: string;
}

const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const authStore = useAuthStore();

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
    const response = await api.post<LoginResponse>('http://localhost:3000/auth/login', form);

    console.log('Login successful:', response.data);

    const { access_token, user } = response.data; // Correctly destructure access_token and user

    // Verificar que tengamos los datos necesarios
    if (!user || !access_token) {
      throw new Error('Respuesta del servidor incompleta. Faltan datos de usuario o token.');
    }

    // Guardar en el store: pasamos el objeto 'user' completo y el 'access_token'
    authStore.setLoginData(user, access_token); // Now passes AuthUser object and string token

    // Emitir evento de login exitoso
    emit('login', { ...form });

    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: `¡Bienvenido, ${user.username}!`, // Access username from the 'user' object
      position: 'top-right'
    });

    // Redireccionar al dashboard o página principal
    await router.push('/');

  } catch (error: any) {
    console.error('Error during login:', error.response || error);

    let errorMessage = 'Error en el inicio de sesión. Verifique sus credenciales.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right'
    });

  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles for LoginForm here if needed */
</style>