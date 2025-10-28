<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Iniciar Sesión</div>
            <div class="text-grey-8">Accede a tu cuenta</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input filled v-model="form.username" label="Usuario" lazy-rules
                :rules="[(val: string) => (val && val.length > 0) || 'Este campo es requerido']" />

              <q-input filled v-model="form.password" type="password" label="Contraseña" lazy-rules
                :rules="[(val: string) => (val && val.length > 0) || 'La contraseña es requerida']" />

              <q-card-actions class="q-px-md">
                <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Ingresar" type="submit"
                  :loading="loading" />
              </q-card-actions>
              <q-card-section class="text-center q-pa-none">
                <p class="text-grey-6">¿No tienes una cuenta?
                  <router-link to="/register">Regístrate</router-link>
                </p>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/authStore";
import { AuthUser } from "src/types/index"; // Import AuthUser type

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
  username: "",
  password: "",
});

const emit = defineEmits<{
  (e: "login", formData: LoginForm): void;
}>();

const handleSubmit = async () => {
  loading.value = true;

  try {
    const response = await api.post<LoginResponse>(
      "http://66.97.45.96:3007/auth/login",
      form
    );

    console.log("Login successful:", response.data);

    const { access_token, user } = response.data; // Correctly destructure access_token and user

    // Verificar que tengamos los datos necesarios
    if (!user || !access_token) {
      throw new Error(
        "Respuesta del servidor incompleta. Faltan datos de usuario o token."
      );
    }

    // Guardar en el store: pasamos el objeto 'user' completo y el 'access_token'
    authStore.setLoginData(user, access_token); // Now passes AuthUser object and string token

    // Emitir evento de login exitoso
    emit("login", { ...form });

    // Mostrar notificación de éxito
    $q.notify({
      type: "positive",
      message: `¡Bienvenido, ${user.username}!`, // Access username from the 'user' object
      position: "top-right",
    });

    // Redireccionar al dashboard o página principal
    await router.push("/");
  } catch (error: any) {
    console.error("Error during login:", error.response || error);

    let errorMessage =
      "Error en el inicio de sesión. Verifique sus credenciales.";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>